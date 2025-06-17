import sharp from "sharp";

export default async function processImage(buffer: Buffer): Promise<Buffer> {
  return await sharp(buffer)
    .webp({
      quality: 85,       
      effort: 1,         
      lossless: false   
    })
    .toBuffer();
}