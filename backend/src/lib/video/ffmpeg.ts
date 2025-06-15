import ffmpeg from "ffmpeg"
import { tmpdir } from 'os'
import { join } from 'path'
import { writeFile, readFile, unlink } from 'fs/promises'
import { v4 as uuid } from 'uuid'