import express from 'express'
import {
  getProfile,
  changePassword,
  updateProfile,
} from '../controllers/profile.controller.js'
import { verifyToken } from '../middlewares/auth.js'
import { validate } from '../middlewares/validateInput.js'
import {
  changePasswordSchema,
  updateProfileSchema,
} from '../schemas/profile.schema.js'

const profileRoutes = express.Router()

// Mostrar el perfil del usuario autenticado
profileRoutes.get('/', verifyToken, getProfile)

// Cambiar contraseña
profileRoutes.put(
  '/change_password',
  verifyToken,
  validate(changePasswordSchema),
  changePassword
)

// Actualizar su propio perfil
profileRoutes.put(
  '/',
  verifyToken,
  validate(updateProfileSchema),
  updateProfile
)

export default profileRoutes
