import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SigninSchema, SignupSchema } from "@repo/zod/types";
import dotenv from "dotenv";
import { Resend } from "resend";
import { OTPgenerator } from "../utils.js";
import { userMiddleware } from "../middleware.js";

dotenv.config();

const userRouter = express.Router();
const prisma = new PrismaClient();
const saltrounds = Number(process.env.SALTRounds || 10);
const jwtsecret = process.env.JWTSecret || "123456";
const resend = new Resend(process.env.Resend_Key || "");

const OTPEmailTemplate = (email: string, otp: number) => `
  <div style="margin: 0; padding: 0; background-color: #f9fafb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <div style="max-width: 600px; width: 100%; margin: 0 auto; padding: 40px 20px;">
      <div style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 5px 15px rgba(0,0,0,0.05); padding: 30px 20px; box-sizing: border-box;">
        <h2 style="color: #111827; font-size: 24px; text-align: center; margin-bottom: 20px;">🔐 Hello ${email}!</h2>
        <p style="color: #374151; font-size: 16px; text-align: center; margin-bottom: 30px;">
          Your One-Time Password (OTP) for verifying your Galaria account is:
        </p>
        <div style="text-align: center; margin-bottom: 30px;">
          <span style="
            display: inline-block;
            background-color: #4F46E5;
            color: #ffffff;
            padding: 16px 32px;
            font-size: 22px;
            font-weight: bold;
            letter-spacing: 2px;
            border-radius: 8px;
            text-align: center;
            min-width: 120px;
          ">
            ${otp}
          </span>
        </div>
        <p style="color: #6B7280; font-size: 14px; text-align: center; margin-bottom: 20px;">
          This OTP is valid for <strong>10 minutes</strong>. Please do not share it with anyone.
        </p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;" />
        <p style="color: #9CA3AF; font-size: 12px; text-align: center;">
          Sent with ❤️ by <strong>Galaria</strong>
        </p>
      </div>
    </div>
  </div>
`;

userRouter.post('/signup', async (req:any, res:any) => {
  try {
    const parsed = SignupSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        message: "Invalid Inputs were provided",
        error: parsed.error.flatten()
      });
    }

    const { username, email, password } = parsed.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, saltrounds);
    const otp = parseInt(OTPgenerator(6) as string );

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword }
    });

    await prisma.otp.upsert({
      where: { userId: newUser.id },
      update: { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      create: { userId: newUser.id, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });

    const html = OTPEmailTemplate(newUser.email, otp);
    await resend.emails.send({
      from: "onboarding@hire.10xdevs.me",
      to: newUser.email,
      subject: "You've Got the OTP!",
      html,
    });

    const token = jwt.sign({ userId: newUser.id }, jwtsecret);
    return res.status(200).json({ message: "User successfully registered", token });
  } catch (error) {
    console.error("Error occurred at signup", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.post("/signin", async (req:any, res:any) => {
  try {
    const parsed = SigninSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid Inputs", error: parsed.error.flatten() });
    }

    const { email, password } = parsed.data;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const otp = parseInt(OTPgenerator(6) as string);
    await prisma.otp.upsert({
      where: { userId: existingUser.id },
      update: { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      create: { userId: existingUser.id, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
    });

    const html = OTPEmailTemplate(existingUser.email, otp);
    await resend.emails.send({
      from: "onboarding@hire.10xdevs.me",
      to: existingUser.email,
      subject: "You've Got the OTP!",
      html,
    });

    const token = jwt.sign({ userId: existingUser.id }, jwtsecret);
    return res.status(200).json({ message: "Logged in successfully", token });
  } catch (error) {
    console.error("Error occurred at signin", error);
    res.status(500).json({ error: "Internal server error" });
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
    console.error("Error occurred at OTP verification", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default userRouter;