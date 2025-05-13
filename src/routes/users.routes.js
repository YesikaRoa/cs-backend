import express from 'express'
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/users.controller.js'
import { validate } from '../middlewares/validateInput.js'
import { createUserSchema, updateUserSchema } from '../schemas/users.schema.js'
import { verifyToken } from '../middlewares/auth.js'

const userRoutes = express.Router()

userRoutes.post('/', verifyToken, validate(createUserSchema), createUser)
userRoutes.get('/', getAllUsers)
userRoutes.get('/:id', getUserById)
userRoutes.put('/:id', verifyToken, validate(updateUserSchema), updateUser)
userRoutes.delete('/:id', verifyToken, deleteUser)

export default userRoutes
