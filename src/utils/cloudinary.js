import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export const deleteFromCloudinary = async (url) => {
  try {
    const parts = url.split('/')
    const fileName = parts[parts.length - 1] // ejemplo: abc123.jpg
    const publicId = `posts/${fileName.split('.')[0]}` // ejemplo: posts/abc123

    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error('Error al eliminar imagen de Cloudinary:', error)
    throw error
  }
}

export default cloudinary
