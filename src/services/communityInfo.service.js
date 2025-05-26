import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

// Crear nueva información de comunidad
export const createInfo = async (reqBody) => {
  try {
    const { title, value } = reqBody

    const data = {
      title,
      value,
    }

    const info = await prisma.communityInformation.create({ data })

    return info
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

// Obtener toda la información de comunidades
export const getAllInfo = async () => {
  try {
    const info = await prisma.communityInformation.findMany()
    return info
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

// Obtener información  por ID
export const getInfoById = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    const info = await prisma.communityInformation.findUnique({
      where: { id: numericId },
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
export const updateInfo = async (id, data) => {
  try {
    const numericId = validateAndConvertId(id)

    const updatedInfo = await prisma.communityInformation.update({
      where: { id: numericId },
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

// Eliminar información de comunidad
export const deleteInfo = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    const deletedInfo = await prisma.communityInformation.delete({
      where: { id: numericId },
    })

    return deletedInfo
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
