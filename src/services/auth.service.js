import { BcryptAdapter } from '../adapters/bcryptAdapter.js'
import jwt from 'jsonwebtoken'
import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

export const registerUser = async (reqBody) => {
  const { email, password } = reqBody

  const userExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userExists) throw createError('EMAIL_IN_USE')

  const hashedPassword = await BcryptAdapter.hash(password)

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

  const isValid = user && (await BcryptAdapter.compare(password, user.password))
  if (!isValid) throw createError('INVALID_CREDENTIALS')

  const token = jwt.sign(
    { id: user.id, email, community_id: user.community_id },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  )

  return { token }
}

export const getCurrentDate = async () => {
  const currentDate = await prisma.$queryRaw`SELECT NOW() as date;`
  return currentDate[0].date
}

//recover_passwordUser
export const recoverPasswordUser = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } })

  if (!user) throw createError('USER_NOT_FOUND')

  return { message: 'Correo válido. Proceder con recuperación.' }
}
