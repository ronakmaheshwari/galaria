import ffmpeg from "fluent-ffmpeg"
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, readFile, unlink } from 'fs/promises'
import { v4 as uuid } from 'uuid'

export default async function processVideo(buffer:Buffer):Promise<Buffer>{
    const inputPath = join(tmpdir(),`${uuid()}.mp4`);
    const outputPath = join(tmpdir(), `${uuid()}-out.mp4`);

    await writeFile(buffer,inputPath);

    return new Promise<Buffer>((resolve, reject) => {
      ffmpeg(inputPath)
        .outputOptions(['-preset fast', '-crf 18'])
        .output(outputPath)
        .on('end', async () => {    
            const data = await readFile(outputPath)
            await unlink(inputPath)
            await unlink(outputPath)
            resolve(data)
        })
        .on('error', reject)
        .run()
    })
}