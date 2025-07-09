import express from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLeaders,
} from '../controllers/users.controller.js'
import { validate } from '../middlewares/validateInput.js'
import { createUserSchema, updateUserSchema } from '../schemas/users.schema.js'
import { verifyToken } from '../middlewares/auth.js'
import { uploadUsers } from '../middlewares/upload.js'
import { optionalVerifyToken } from '../middlewares/optionalVerifyToken.js'

const userRoutes = express.Router()

userRoutes.get('/leaders', optionalVerifyToken, getLeaders)

userRoutes.post(
  '/',
  verifyToken,
  uploadUsers.array('image', 1),
  validate(createUserSchema),
  createUser
)

userRoutes.get('/', verifyToken, getAllUsers)

userRoutes.get('/:id', verifyToken, getUserById)

userRoutes.put('/:id', verifyToken, validate(updateUserSchema), updateUser)

userRoutes.delete('/:id', verifyToken, deleteUser)

export default userRoutes
