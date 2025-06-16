import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY
const BUCKET = 'uploads'

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

export default async function uploadToSupabase(
  key: string,
  body: Buffer,
  contentType: string,
  upsert = false
): Promise<string> {
  const { error } = await supabase.storage.from(BUCKET).upload(key, body, {
    contentType,
    upsert,
  })

  if (error) {
    console.error('Supabase upload error:', error.message)
    throw new Error('Failed to upload to Supabase')
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${key}`
}

