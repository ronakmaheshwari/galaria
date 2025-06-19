import express from "express"
import z from "zod"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userRouter = express.Router()
const prisma = new PrismaClient()

userRouter.post('/signup',async(req:any,res:any)=>{
    try {
        

    } catch (error) {
        console.error("Error occured at signup");
        res.status(500).json({
            error: "Internal Error occured"
        })
    }
})

export default userRouter