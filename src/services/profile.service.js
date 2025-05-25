import { prisma } from '../config/db.js'
import bcrypt from 'bcryptjs'
import { createError } from '../utils/errors.js'

export const getProfileService = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      role: {
        select: {
          name: true,
        },
      },
      community: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  })
  if (!user) throw createError('USER_NOT_FOUND')
  return user
}

export const updateProfileService = async (userId, body) => {
  // Construir el objeto de actualización dinámicamente,
  // incluyendo los campos opcionales que se deseen actualizar.
  const updateData = { updatedAt: new Date() }

  if (body.first_name !== undefined) updateData.first_name = body.first_name
  if (body.last_name !== undefined) updateData.last_name = body.last_name
  if (body.email !== undefined) updateData.email = body.email
  if (body.phone !== undefined) updateData.phone = body.phone
  if (body.rol_id !== undefined) updateData.rol_id = body.rol_id
  if (body.community_id !== undefined)
    updateData.community_id = body.community_id

  if (body.community_address !== undefined) {
    updateData.community = {
      update: {
        address: body.community_address,
      },
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      role: {
        select: {
          name: true,
        },
      },
      community: {
        select: {
          name: true,
          address: true,
        },
      },
    },
  })
  return updatedUser
}

export const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  })
  if (!user) throw createError('USER_NOT_FOUND')

  const isMatch = await bcrypt.compare(currentPassword, user.password)
  if (!isMatch) throw createError('INVALID_CREDENTIALS')

  const hashedPassword = await bcrypt.hash(newPassword, 10)
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword, updatedAt: new Date() },
  })

  return { message: 'Contraseña actualizada correctamente' }
}
