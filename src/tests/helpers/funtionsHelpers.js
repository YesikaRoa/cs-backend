import { BcryptAdapter } from '../../adapters/bcryptAdapter.js'
import jwt from 'jsonwebtoken'
import { prisma } from '../../config/db.js'
import { createError } from '../../utils/errors.js'

export const registerUser = async (reqBody) => {
  const {
    email,
    password,
    first_name,
    last_name,
    phone,
    rol_id,
    community_id,
    dni,
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
      dni,
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
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      url_image: true,
      community_id: true,
      rol_id: true,
      password: true,
      role: { select: { name: true } },
    },
    where: { email },
  })

  const isValid = user && (await BcryptAdapter.compare(password, user.password))
  if (!isValid) throw createError('INVALID_CREDENTIALS')

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
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
    first_name: user.first_name,
    last_name: user.last_name,
    url_image: user.url_image,
  }
}
