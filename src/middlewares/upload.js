import multer from 'multer'
import CloudinaryAdapter from '../adapters/CloudinaryAdapter.js'

const postAdapter = new CloudinaryAdapter('posts')
const userAdapter = new CloudinaryAdapter('users')

const uploadPosts = multer({ storage: postAdapter.getStorage() })
const uploadUsers = multer({ storage: userAdapter.getStorage() })

export { uploadPosts, uploadUsers }
