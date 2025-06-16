import express from "express"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import prisma from "../lib/prisma/prisma"
import { SigninSchema, SignupSchema } from "../types"

const userRouter = express.Router()
dotenv.config();
const saltrounds = Number(process.env.Saltrounds) || 10
const jwtsecret = process.env.JWTSecret || "123456"

userRouter.post('/signup',async(req:any,res:any)=>{
    try {
        const { success, data } = SignupSchema.safeParse(req.body);
        if(!success){
            return res.status(400).json({
                message:"Invalid inputs were provided"
            })
        }
        const { username, email, password } = data;
        const ExistingUser = await prisma.user.findUnique({
            where:{
                email:email
            }
        })
        if(ExistingUser){
            return res.status(400).json({
                message:"Email already exists in the Database"
            })
        }
        const hash = await bcrypt.hash(password, saltrounds);
        const newUser = await prisma.user.create({
            data:{
                username,email,password:hash
            }
        })
        const token = jwt.sign({id: newUser.id},jwtsecret)
        return res.status(200).json({
            message:"User Successfully Added",
            token:token
        })
    } catch (error) {
         return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

userRouter.post('/signin',async(req:any,res:any)=>{
    try {
        const parsed = SigninSchema.safeParse(req.body);
        if(!parsed.success){
             return res.status(400).json({
                message:"Invalid inputs were provided",
                errors: parsed.error.flatten()
            })
        }
        const {email,password} = parsed.data;
        const ExistingUser = await prisma.user.findUnique({
            where:{
                email
            }
        })
        if(!ExistingUser){
            return res.status(404).json({
                message:"User doesn't exist"
            })
        }
        const hash = await bcrypt.compare(password, ExistingUser.password);
        if(!hash){
            return res.status(404).json({
                message:"Invalid Password recieved"
            })
        }
        const token = jwt.sign({userId: ExistingUser.id},jwtsecret);
        return res.status(200).json({
            message:"Logged in successfully",
            token:token
        })
    } catch (error) {
        return res.status(500).json({
            message:"Internal Server Error"
        })
    }
})

export default userRouter