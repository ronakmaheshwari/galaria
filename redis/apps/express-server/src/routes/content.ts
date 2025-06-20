import express from "express"
import dotenv from "dotenv"
import multer from "multer"
import { prisma } from "@repo/prisma";
import { userMiddleware } from "../middleware.js";
import { filesZod } from "@repo/zod/types";
import client from "@repo/redis/redis";

dotenv.config()

const contentRouter =express.Router()
const upload = multer()

contentRouter.post(
  "/upload",
  userMiddleware,
  upload.array("files", 10),
  async (req: any, res: any) => {
    try {
      const userId = req.userId;
      const files = req.files as Express.Multer.File[];

      const validation = filesZod.safeParse(files);
      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid files",
          error: validation.error.format(),
        });
      }

      const queueJobs = validation.data.map((file) => {
        const job = {
          userId,
          originalName: file.originalname,
          mimetype: file.mimetype,
          buffer: file.buffer.toString("base64"), 
          uploadedAt: new Date().toISOString(),
        };

        return client.lPush("content", JSON.stringify(job));
      });

      await Promise.all(queueJobs);

      return res.status(200).json({ success: true, message: "Files queued for processing" });
    } catch (error) {
      console.error("Upload Queue Error:", error);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);

contentRouter.get("/",userMiddleware,async(req:any,res:any)=>{
  try {
    const userId = req.userId
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10
    const skip = (page-1)*limit
    const [total,data] = await Promise.all([
      prisma.content.count({
        where:{
          userId:userId
        }
      }),
      prisma.content.findMany({
        where:{
          userId
        },
        take:limit,
        skip
      })
    ])
    const totalPages = Math.ceil(total/limit)
    return res.status(200).json({
        success: true,
        page,
        limit,
        total,
        totalPages,
        data
    })
  } catch (error) {
    console.error("Upload Queue Error:", error);
      return res.status(500).json({ error: "Upload failed" });
  }
})

contentRouter.post("/:id",userMiddleware,async(req:any,res:any)=>{
  try {
    const userId = req.userId;
    const deleteId = parseInt(req.params.id as string)
    const CheckId = await prisma.content.findUnique({
      where:{
        id:deleteId
      }
    })
    if(!CheckId){
      return res.status(400).json({
        message:"Invalid Content Id provided"
      })
    }
    if (CheckId.userId !== userId) {
      return res.status(403).json({ error: 'Unauthorized' })
    }

    await prisma.content.delete({
      where: { id: deleteId },
    })

    return res.status(200).json({ message: 'Content has been deleted' })
  } catch (error) {
     console.error("Upload Queue Error:", error);
      return res.status(500).json({ error: "Upload failed" });
  }
})

export default contentRouter