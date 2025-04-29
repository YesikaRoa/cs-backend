import {
  registerUser,
  loginUser,
  getCurrentDate as getCurrentDateService,
  recoverPasswordUser,
  recover_passwordUser,
} from '../services/auth.service.js'
import { transporter } from '../services/mailer.js'
import prisma from '../config/db.js'
import bcrypt from 'bcrypt'

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({
      status: 201,
      message: 'Usuario creado con éxito',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  console.log('Login request:', req.body)
  try {
    const { token } = await loginUser(req.body)
    res.status(200).json({
      status: 200,
      message: 'Login exitoso',
      data: { token },
    })
  } catch (error) {
    next(error)
  }
}

export const recover_password = async (req, res, next) => {
  console.log('Login request:', req.body)
  try {
    const user = await prisma.user.findUnique({
      where: { email: req.body.email },
    })

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: 'Usuario no registrado en el sistema',
      })
    }

    const newPassword = generateRandomPassword()
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    })

    await transporter.sendMail({
      from: '"forgot password" <cimunidad@ethereal.email>', // sender address
      to: user.email, // list of receivers
      subject: 'Hello ✔', // Subject line
      html: `
      <b>su contraseña fue cambiada exitosamente</b>
        <p>Su nueva contraseña temporal es:</p>
        <h3>${newPassword}</h3>
      `,
    })

    res.status(200).json({
      status: 200,
      message: 'Recuperación de contraseña exitosa',
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req, res) => {
  const { id, email, community_id } = req.user
  res.json({ id, email, community_id })
}

export const getCurrentDate = async (req, res, next) => {
  try {
    const data = await getCurrentDateService()
    res.status(200).json({
      status: 200,
      message: 'Date',
      data,
    })
  } catch (error) {
    next(error)
  }
}
