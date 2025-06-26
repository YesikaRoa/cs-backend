import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import dotenv from 'dotenv'
dotenv.config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

class CloudinaryAdapter {
  constructor(folder = 'default') {
    this.cloudinary = cloudinary
    this.folder = folder
    this.storage = new CloudinaryStorage({
      cloudinary: this.cloudinary,
      params: {
        folder: this.folder,
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      },
    })
  }

  getStorage() {
    return this.storage
  }

  async upload(filePath, folder = this.folder) {
    const result = await this.cloudinary.uploader.upload(filePath, {
      folder,
    })
    return result.secure_url
  }

  async deleteByUrl(url) {
    try {
      const parts = url.split('/')
      const fileName = parts[parts.length - 1]
      const publicId = `${this.folder}/${fileName.split('.')[0]}`
      await this.cloudinary.uploader.destroy(publicId)
    } catch (error) {
      console.error('Error al eliminar imagen de Cloudinary:', error)
      throw error
    }
  }
}

export default CloudinaryAdapter
