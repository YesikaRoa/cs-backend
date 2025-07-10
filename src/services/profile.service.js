import { prisma, Prisma } from '../config/db.js'
import bcrypt from 'bcryptjs'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'
import CloudinaryAdapter from '../adapters/CloudinaryAdapter.js'

const cloudinaryUser = new CloudinaryAdapter('users')

export const getProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        url_image: true,
        dni: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) throw createError('RECORD_NOT_FOUND')

    return user
  } catch (error) {
    throw error
  }
}

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) throw createError('RECORD_NOT_FOUND')

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) throw createError('INVALID_CREDENTIALS')

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, updatedAt: new Date() },
    })

    return { message: 'Contraseña actualizada correctamente' }
  } catch (error) {
    throw error
  }
}

export const updatePofile = async (id, data, files) => {
  try {
    const numericId = validateAndConvertId(id)

    const currentUser = await prisma.user.findUnique({
      where: { id: numericId },
    })

    if (!currentUser) {
      throw createError('RECORD_NOT_FOUND')
    }

    if (files && files.length > 0) {
      if (currentUser.url_image) {
        await cloudinaryUser.deleteByUrl(currentUser.url_image)
      }

      const newImageUrl = files[0].path
      data.url_image = newImageUrl
    }

    const updatedUser = await prisma.user.update({
      where: { id: numericId },
      data,
    })

    return updatedUser
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw createError('DUPLICATE_RECORD')
    }

    throw error
  }
}
