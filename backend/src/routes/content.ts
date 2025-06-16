import express from "express"
import dotenv from "dotenv"
import multer from "multer"
import { userMiddleware } from "../middleware"
import { filesZod } from "../types"
import processImage from "../lib/image/sharp"
import processVideo from "../lib/video/ffmpeg"
import uploadToSupabase from "../lib/supabase/supabase" 
import prisma from "../lib/prisma/prisma"

dotenv.config()

const contentRouter = express.Router()
const upload = multer()

contentRouter.post(
  "/upload",
  userMiddleware,
  upload.array("files", 10),
  async (req: any, res: any) => {
    try {
      const userId = req.userId
      // console.log('The userId is',userId);
      const files = req.files as Express.Multer.File[]

      const validation = filesZod.safeParse(files)
      if (!validation.success) {
        return res.status(400).json({
          message: "User sent wrong files",
          error: validation.error.format(),
        })
      }

      const results = await Promise.all(
        validation.data.map(async (file) => {
          const { buffer, mimetype, originalname } = file
          let processed: Buffer
          let contentType: string
          let type: "image" | "video"
          let ext: string

          if (mimetype.startsWith("image/")) {
            processed = await processImage(buffer)
            contentType = "image/webp"
            type = "image"
            ext = "webp"
          } else if (mimetype.startsWith("video/")) {
            processed = await processVideo(buffer)
            contentType = "video/mp4"
            type = "video"
            ext = "mp4"
          } else {
            throw new Error("Unsupported MIME type")
          }

          const key = `${Date.now()}-${originalname.replace(/\.[^/.]+$/, "")}.${ext}`
          const url = await uploadToSupabase(key, processed, contentType) //uploadtoR2(key, processed, contentType)

          const response = await prisma.content.create({
            data: {
              url,
              type,
              user: {
                connect: { id: userId },
              },
            },
          })

          return response
        })
      )
      return res.json({ success: true, files: results })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Upload failed" })
    }
  }
)

contentRouter.get('/',userMiddleware,async(req:any,res:any)=>{
  try{
      const userId = req.userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page-1)*limit
      const [total,data] = await Promise.all([
        prisma.content.count({
          where:{
            userId:userId
          }}
        ),
        prisma.content.findMany({
          where:{
            userId:userId
          },
          skip,
          take:limit
        })
      ])
      const totalPages = Math.ceil(total/limit);
      return res.status(200).json({
          success: true,
          page,
          limit,
          total,
          totalPages,
          data
      })
  }catch(error){
      console.error(error)
      return res.status(500).json({ error: "Error at Content fetch" })
  }
})

contentRouter.delete('/:id', userMiddleware, async(req: any, res:any) => {
  try {
    const userId = req.userId
    const contentId = req.params.id

    const existing = await prisma.content.findUnique({
      where: { id: contentId },
    })
    if (!existing) {
      return res.status(404).json({ error: 'Content not found' })
    }
    if (existing.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await prisma.content.delete({
      where: { id: contentId },
    })

    return res.status(200).json({ message: 'Content has been deleted' })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: 'Error deleting content' })
  }
})

export default contentRouter
