import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import prisma from '../config/db.js'
import { createError } from '../utils/errors.js'

export const registerUser = async (reqBody) => {
  const { email, password } = reqBody

  const userExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userExists) throw createError('EMAIL_IN_USE')

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: { email, password: hashedPassword },
  })

  return {
    id: user.id,
    email: user.email,
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  const isValid = user && (await bcrypt.compare(password, user.password))
  if (!isValid) throw createError('INVALID_CREDENTIALS')

  const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, {
    expiresIn: '1h',
  })

  return { token }
}

//recover_passwordUser
export const recoverPasswordUser = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw createError('USER_NOT_FOUND')

  return { message: 'Correo válido. Proceder con recuperación.' }
}
