import express from 'express'
import {
  login,
  register,
  getProfile,
  getCurrentDate,
  recover_password,
} from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validateInput.js'
import {
  registerSchema,
  loginSchema,
  recoverPasswordSchema,
} from '../schemas/auth.schema.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getCurrentDate)
router.post('/login', validate(loginSchema), login)
router.post('/register', validate(registerSchema), register)
router.get('/profile', verifyToken, getProfile)
router.post(
  '/recover_password',
  validate(recoverPasswordSchema),
  recover_password
)

export default router
