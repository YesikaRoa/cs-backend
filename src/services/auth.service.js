import { BcryptAdapter } from '../adapters/bcryptAdapter.js'
import jwt from 'jsonwebtoken'
import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { transporter } from './mailer.js'

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

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
export const recoverPassword = async ({ email }) => {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) throw createError('USER_NOT_FOUND')

  const newPassword = generateRandomPassword()
  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await prisma.user.update({
    where: { email: user.email },
    data: { password: hashedPassword },
  })

  await transporter.sendMail({
    from: '"forgot password" <cimunidad@ethereal.email>',
    to: user.email,
    subject: 'Hello ✔',
    html: `
            <b>Su contraseña ha sido actualizada.</b>
            <p>Su nueva contraseña es:</p>
            <h3>${newPassword}</h3>
            <p>Le recomendamos por seguridad, que una vez acceda al sistema con esta nueva contraseña la cambie por otra de su conveniencia</p>
        `,
  })

  return { message: 'Recuperación de contraseña exitosa' }
}
