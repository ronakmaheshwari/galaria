import sharp from "sharp";

export default async function processImage(buffer:Buffer){
    try {
        return await sharp(buffer).webp({
            quality:85,
            lossless:true,
            effort:3
        }).toBuffer();
    } catch (error) {
        console.error("Error at Image Processing",error);
    }
}