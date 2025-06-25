import multer from 'multer'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import cloudinary from '../utils/cloudinary.js'

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'posts',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
})

const upload = multer({ storage })

const usersStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'users',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
  },
})

const uploadUsers = multer({ storage: usersStorage })

export { upload, uploadUsers }
