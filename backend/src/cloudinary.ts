import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadImage(base64Data: string): Promise<string> {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder: '99percent',
    transformation: [{ width: 400, height: 400, crop: 'fill', quality: 'auto' }]
  })
  return result.secure_url
}
