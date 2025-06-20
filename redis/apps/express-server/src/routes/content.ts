import express from "express"
import dotenv from "dotenv"
import multer from "multer"
import { PrismaClient } from "@prisma/client";
import { userMiddleware } from "../middleware.js";
import { filesZod } from "@repo/zod/types";
import client from "@repo/redis/redis";

dotenv.config()

const contentRouter =express.Router()
const prisma = new PrismaClient();
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
    } catch (err) {
      console.error("Upload Queue Error:", err);
      return res.status(500).json({ error: "Upload failed" });
    }
  }
);
export default contentRouter