import { BcryptAdapter } from '../adapters/bcryptAdapter.js'
import { NodemailerAdapter } from '../adapters/email/NodemailerAdapter.js'

import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

export const registerUser = async (reqBody) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    rol_id,
    community_id,
  } = reqBody

  const userExists = await prisma.user.findUnique({
    where: { email },
  })

  if (userExists) throw createError('EMAIL_IN_USE')

  const hashedPassword = await BcryptAdapter.hash(password)

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
      rol_id,
      community_id,
    },
  })

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    phone: user.phone,
    rol_id: user.rol_id,
    community_id: user.community_id,
  }
}

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  })

  const isValid = user && (await BcryptAdapter.compare(password, user.password))
  if (!isValid) throw createError('INVALID_CREDENTIALS')

  const token = jwt.sign(
    {
      id: user.id,
      email,
      community_id: user.community_id,
      rol_id: user.rol_id,
      rol_name: user.role.name,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '1h',
    }
  )
  await prisma.user.update({
    where: { id: user.id },
    data: { last_login: new Date() },
  })

  return {
    token,
  }
}

export const recoverPassword = async ({ email }) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } })

    if (!user) throw createError('EMAIL_NOT_FOUND')

    const newPassword = generateRandomPassword()
    const hashedPassword = await BcryptAdapter.hash(newPassword)

    await prisma.user.update({
      where: { email: user.email },
      data: { password: hashedPassword },
    })

    const emailService = new NodemailerAdapter()
    const data = {
      to: email,
      subject: 'Servicio de Recuperación de Contraseña - Consejo Comunal',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Hola ${user.first_name},</p>
        <p>Tu contraseña ha sido actualizada correctamente.</p>
        <p><strong>Nueva contraseña:</strong> <span style="color: #007BFF;">${newPassword}</span></p>
        <p>Por seguridad, te recomendamos cambiar esta contraseña tan pronto inicies sesión.</p>
        <hr/>
        <p style="font-size: 12px; color: #999;">Este correo fue generado automáticamente. Por favor, no respondas.</p>
      </div>
    `,
    }

    await emailService.sendEmail(data)
  } catch (error) {
    throw error
  }
}

const generateRandomPassword = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let password = ''
  for (let i = 0; i < 6; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

export const getCurrentDate = async () => {
  const currentDate = await prisma.$queryRaw`SELECT NOW() as date;`
  return currentDate[0].date
}
