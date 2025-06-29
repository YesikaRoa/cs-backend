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

const userRoutes = express.Router()

userRoutes.get('/leaders', getLeaders)

userRoutes.post(
  '/',
  verifyToken,
  uploadUsers.array('image', 1),
  validate(createUserSchema),
  createUser
)

userRoutes.get('/', getAllUsers)

userRoutes.get('/:id', getUserById)

userRoutes.put(
  '/:id',
  verifyToken,
  uploadUsers.array('image', 1),
  validate(updateUserSchema),
  updateUser
)

userRoutes.delete('/:id', verifyToken, deleteUser)

export default userRoutes
