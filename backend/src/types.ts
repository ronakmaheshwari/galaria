import z from "zod";

export const SignupSchema = z.object({
    username:z.string().min(4).max(20),
    email:z.string().email(),
    password:z.string().min(8).regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/, 
  "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
})

export const SigninSchema = z.object({
  email:z.string().email(),
  password:z.string().min(8).regex(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/, 
  "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.")
})

export const acceptedMimeTypes = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/*',
  'video/mp4',
  'video/quicktime'
]

export const fileZod = z.object({
  originalname:z.string(),
  mimetype: z.string().refine(t => acceptedMimeTypes.includes(t), {
    message: 'Unsupported file type'
  }),
  size: z.number().max(10 * 1024 * 1024 * 1024,{ message: 'Max 100 MB allowed' }),
  buffer: z.instanceof(Buffer)
})

export const filesZod = z.array(fileZod)