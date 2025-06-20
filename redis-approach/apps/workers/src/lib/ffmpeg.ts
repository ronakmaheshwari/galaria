import ffmpeg from "fluent-ffmpeg";
import { tmpdir } from "os";
import { join } from "path";
import { writeFile, readFile, unlink } from "fs/promises";
import { v4 as uuid } from "uuid";

export default async function processVideo(buffer: Buffer): Promise<Buffer> {
  const inputPath = join(tmpdir(), `${uuid()}.mp4`);
  const outputPath = join(tmpdir(), `${uuid()}-out.mp4`);

  await writeFile(inputPath, buffer); 

  return new Promise<Buffer>((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-preset ultrafast", 
        "-crf 20"            
      ])
      .output(outputPath)
      .on("end", async () => {
        try {
          const data = await readFile(outputPath);
          await unlink(inputPath);
          await unlink(outputPath);
          resolve(data);
        } catch (err) {
          reject(err);
        }
      })
      .on("error", reject)
      .run();
  });
}
