import express from "express"
import { userMiddleware } from "../middleware"
import z from 'zod'
import prisma from "../lib/prisma/prisma"
import RandomlinkGenerator from "../utils"

const shareRouter = express.Router()
const Shareschema = z.object({
    share:z.boolean()
}) 

shareRouter.post('/',userMiddleware,async(req:any,res:any)=>{
    try {
        const share = Shareschema.safeParse(req.body);
        if(!share.success){
            return res.status(400).json({
                message:"Invalid Inputs were provided",
                error:share.error.flatten()
            })
        }
        if(share){
            const userId = req.userId;
        const ExistingHash = await prisma.link.findUnique({
            where:{
                userId:userId
            }
        })
        if(ExistingHash){
            return res.status(200).json({
                link:ExistingHash.hash
            })
        }
        const hash = RandomlinkGenerator(6);
        if (typeof hash !== "string") {
            return res.status(500).json({ error: "Failed to generate a valid hash" });
        }
        const newHash = await prisma.link.create({
            data:{
                userId:userId,
                hash:hash
            }
        })
        return res.status(200).json({
                link:newHash.hash
        })
        }else{
            await prisma.link.delete({
                where:{
                    userId:req.userId
                }
            })
            return res.status(200).json({
                message:"Deleted Shared Link"
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Sharing Feature Failed" })
    }
})

shareRouter.get('/:shareLink',userMiddleware,async(req:any,res:any)=>{
    try {
        const hash  = req.params.shareLink
        const response = await prisma.link.findFirst({
            where:{
                hash:hash
            }
        })
        if(!response){
            return res.status(404).json({
                message:"Invalid Link Provided"
            })
        }
        const content = await prisma.content.findMany({
            where:{
                userId:response.userId
            }
        })
        const userDetails = await prisma.user.findFirst({
            where:{
                id:response.userId
            },
            select:{
                username:true,email:true,password:false,id:false
            }
        })
        return res.status(200).json({
            message:"Returned Successfully",
            userDetails,
            content
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: "Sharing Feature Failed" })
    }
})

export default shareRouter