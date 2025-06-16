import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import dotenv from 'dotenv'
dotenv.config();

const r2 = new S3Client({
    region:'auto',
    endpoint: process.env.R2_ENDPOINT,
    credentials:{
        accessKeyId:process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey:process.env.R2_SECRET_ACCESS_KEY!,
    }
})

export default async function uploadtoR2(key:string,body:Buffer,contentType:string) {
    await r2.send(new PutObjectCommand({
        Bucket: process.env.R2_BUCKET,
        Key: key,
        Body:body,
        ContentType:contentType
    }))
    return `${process.env.R2_PUBLIC_URL}/${key}`
}