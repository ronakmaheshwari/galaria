import client from "@repo/redis/redis";
import processImage from "./lib/sharp.js";
import processVideo from "./lib/ffmpeg.js";
import uploadToSupabase from "./lib/supabase.js";
import { prisma } from "@repo/prisma";

async function processNextJob() {
  const raw = await client.rPop("content"); 
  if (!raw) return;

  let job;
  try {
    job = JSON.parse(raw);
    job.retryCount = job.retryCount ?? 0;

    if (!job.buffer || typeof job.buffer !== "string") {
      throw new Error("Missing or invalid buffer");
    }

    const buffer = Buffer.from(job.buffer, "base64");

    let processed: Buffer;
    let contentType: string;
    let type: "image" | "video";
    let ext: string;

    if (job.mimetype?.startsWith("image/")) {
      const processedImage = await processImage(buffer);
      if (!processedImage) {
        throw new Error("Image processing failed");
      }
      processed = processedImage;
      contentType = "image/webp";
      type = "image";
      ext = "webp";
    } else if (job.mimetype?.startsWith("video/")) {
      processed = await processVideo(buffer);
      if (!processed) {
        throw new Error("Video processing failed");
      }
      contentType = "video/mp4";
      type = "video";
      ext = "mp4";
    } else {
      throw new Error("Unsupported MIME type: " + job.mimetype);
    }

    const key = `${Date.now()}-${job.originalName?.replace(/\.[^/.]+$/, "") || "file"}.${ext}`;
    const url = await uploadToSupabase(key, processed, contentType);

    await prisma.content.create({
      data: {
        url,
        type,
        userId: job.userId,
      },
    });

    console.log("✅ Success:", job.originalName);
  } catch (error) {
    console.error("❌ Job failed:", error);

    if (job) {
      job.retryCount = (job.retryCount || 0) + 1;

      if (job.retryCount <= 3) {
        console.log(`🔁 Retrying job (${job.retryCount})...`);
        await client.lPush("queue:content", JSON.stringify(job));
      } else {
        console.log("🪦 Moved to dead-letter queue");
        await client.lPush("queue:dead", JSON.stringify(job));
      }
    }
  }
}

setInterval(() => {
  processNextJob().catch(console.error); 
}, 1000);
