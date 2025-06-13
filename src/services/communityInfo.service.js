import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

// Obtener toda la información de comunidades
export const getAllInfo = async () => {
  try {
    const info = await prisma.communityInformation.findMany({
      select: {
        id: true,
        title: true,
        value: true,
      },
    })
    return info
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

// Obtener información  por ID
export const getInfoByKey = async (key) => {
  try {
    const info = await prisma.communityInformation.findUnique({
      where: { title: key },
      select: {
        id: true,
        title: true,
        value: true,
      },
    })

    if (!info) {
      throw createError('RECORD_NOT_FOUND')
    }

    return info
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    throw error
  }
}

// Actualizar información de comunidad
export const updateInfo = async (key, data) => {
  try {
    const updatedInfo = await prisma.communityInformation.update({
      where: { title: key },
      data,
    })

    return updatedInfo
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    throw error
  }
}
