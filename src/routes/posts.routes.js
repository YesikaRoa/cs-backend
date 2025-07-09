import express from 'express'
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  changePostStatus,
} from '../controllers/post.controller.js'
import { validate } from '../middlewares/validateInput.js'
import {
  createPostSchema,
  updatePostSchema,
  changePostStatusSchema,
} from '../schemas/posts.schema.js'
import { verifyToken } from '../middlewares/auth.js'
import { uploadPosts } from '../middlewares/upload.js'
import { optionalVerifyToken } from '../middlewares/optionalVerifyToken.js'

const postRoutes = express.Router()

postRoutes.post(
  '/',
  verifyToken,
  uploadPosts.array('images', 3),
  validate(createPostSchema),
  createPost
)

//postRoutes.get('/', verifyToken, getPosts)
postRoutes.get('/', optionalVerifyToken, getPosts)

postRoutes.get('/:id', getPostById)

postRoutes.put(
  '/:id',
  verifyToken,
  uploadPosts.array('images', 3),
  validate(updatePostSchema),
  updatePost
)

postRoutes.delete('/:id', verifyToken, deletePost)

postRoutes.put(
  '/:id/status',
  verifyToken,
  validate(changePostStatusSchema),
  changePostStatus
)

export default postRoutes
