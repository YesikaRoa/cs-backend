import express from 'express'
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
} from '../controllers/post.controller.js'
import { validate } from '../middlewares/validateInput.js'
import { createPostSchema, updatePostSchema } from '../schemas/posts.schema.js'
import { verifyToken } from '../middlewares/auth.js'

const postRoutes = express.Router()

postRoutes.post('/', verifyToken, validate(createPostSchema), createPost)
postRoutes.get('/', getPosts)
postRoutes.get('/:id', getPostById)
postRoutes.put('/:id', verifyToken, validate(updatePostSchema), updatePost)
postRoutes.delete('/:id', verifyToken, deletePost)
export default postRoutes
