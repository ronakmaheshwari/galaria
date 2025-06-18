import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "../lib/prisma/prisma";
import { SigninSchema, SignupSchema } from "../types";
import { OTPgenerator } from "../utils";
import { Resend } from "resend";
import { userMiddleware } from "../middleware";

dotenv.config();

const userRouter = express.Router();
const saltrounds = Number(process.env.Saltrounds) || 10;
const jwtsecret = process.env.JWTSecret || "123456";
const resend = new Resend(process.env.Resend_Key || "");

const OTPEmailTemplate = (email: string, otp: number) => `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #4CAF50;">🔐 Hello ${email}!</h2>
      <p style="font-size: 16px;">Your One-Time Password (OTP) for accessing your Galaria account is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; background-color: #4CAF50; color: #fff; padding: 12px 24px; font-size: 20px; font-weight: bold; border-radius: 5px;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #555;">This OTP is valid for the next 10 minutes. Please do not share it with anyone.</p>
      <hr style="margin-top: 30px;" />
      <p style="font-size: 12px; color: #aaa; text-align: center;">Sent with ❤️ via Galaria</p>
    </div>
  </div>
`;

userRouter.post("/signup", async (req:any, res:any) => {
  try {
    const { success, data } = SignupSchema.safeParse(req.body);
    if (!success) {
      return res.status(400).json({ message: "Invalid inputs were provided" });
    }

    const { username, email, password } = data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists in the database" });
    }

    const hashedPassword = await bcrypt.hash(password, saltrounds);
    const otp = parseInt(OTPgenerator(5) as string);

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    });

    await prisma.otp.upsert({
      where: { userId: newUser.id },
      update: {
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: newUser.id,
        otp,
      },
    });

    const html = OTPEmailTemplate(newUser.email, otp);

    await resend.emails.send({
      from: "onboarding@hire.10xdevs.me",
      to: newUser.email,
      subject: "You've Got the OTP!",
      html,
    });

    const token = jwt.sign({ userId: newUser.id }, jwtsecret, { expiresIn: "1d" });

    return res.status(200).json({
      message: "User successfully registered",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/signin", async (req:any, res:any) => {
  try {
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid inputs were provided",
        errors: parsed.error.flatten(),
      });
    }

    const { email, password } = parsed.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password provided" });
    }

    const otp = parseInt(OTPgenerator(5) as string);

    await prisma.otp.upsert({
      where: { userId: existingUser.id },
      update: {
        otp,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        userId: existingUser.id,
        otp,
      },
    });

    const html = OTPEmailTemplate(existingUser.email, otp);

    await resend.emails.send({
      from: "onboarding@hire.10xdevs.me",
      to: existingUser.email,
      subject: "You've Got the OTP!",
      html,
    });

    const token = jwt.sign({ userId: existingUser.id }, jwtsecret, { expiresIn: "1d" });

    return res.status(200).json({
      message: "Logged in successfully",
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

userRouter.post("/otp", userMiddleware, async (req:any, res:any) => {
  try {
    const userId = req.userId;
    const otpInput = parseInt(req.body.otp);

    if (!userId || isNaN(otpInput)) {
      return res.status(400).json({ message: "Invalid userId or OTP format" });
    }

    const otpRecord = await prisma.otp.findUnique({
      where: { userId },
      select: { otp: true, expiresAt: true },
    });

    if (!otpRecord) {
      return res.status(404).json({ message: "OTP not found or already used" });
    }

    if (new Date() > otpRecord.expiresAt) {
      await prisma.otp.delete({ where: { userId } });
      return res.status(410).json({ message: "OTP has expired" });
    }

    if (otpRecord.otp !== otpInput) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    await prisma.otp.delete({ where: { userId } });
    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default userRouter;
