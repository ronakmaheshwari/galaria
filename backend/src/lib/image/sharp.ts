import sharp from "sharp";

export default async function processImage(buffer:Buffer):Promise<Buffer> {
    return await sharp(buffer).webp({
        quality:100,
        effort:6,
        lossless:true
    })
    .toBuffer()
}