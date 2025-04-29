import express from 'express'
import { login, register, getProfile } from '../controllers/auth.controller.js'
import { validate } from '../middlewares/validateInput.js'
import {
  registerSchema,
  loginSchema,
  recover_passwordSchema,
} from '../schemas/auth.schema.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

router.get('/', getCurrentDate)
router.post('/login', validate(loginSchema), login)
router.post('/register', validate(registerSchema), register)
router.get('/profile', verifyToken, getProfile)
router.post(
  '/recover_password',
  validate(recover_passwordSchema),
  recover_password
)

export default router
