import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export default async function uploadToSupabase(
  key: string,
  body: Buffer,
  contentType: string
): Promise<string | null> {
  const { data, error } = await supabase.storage.from('uploads').upload(key, body, {
    contentType,
    upsert: false,
  });

  if (error) {
    console.error('Supabase upload error:', error.message);
    return null;
  }

  const fileUrl = `${SUPABASE_URL}/storage/v1/object/public/uploads/${key}`;
  return fileUrl;
}
