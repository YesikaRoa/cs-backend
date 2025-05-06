import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

export const getAllInfo = async () => {
  return await prisma.communityInformation.findMany()
}

export const getInfoById = async (id) => {
  try {
    const numericId = Number(id)
    if (isNaN(numericId)) throw createError('INVALID_ID')

    const info = await prisma.communityInformation.findUnique({
      where: { id: numericId },
    })

    if (!info) {
      throw createError('RECORD_NOT_FOUND')
    }

    return info
  } catch (error) {
    // Si el error es de Prisma y tiene el código P2025, lanza RECORD_NOT_FOUND
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    // Propaga otros errores inesperados
    throw error
  }
}

export const createInfo = async (data) => {
  const { id, ...safeData } = data // Elimina id si viene en el body
  return await prisma.communityInformation.create({ data: safeData })
}

export const updateInfo = async (id, data) => {
  const numericId = Number(id)
  if (isNaN(numericId)) throw createError('INVALID_ID')

  try {
    return await prisma.communityInformation.update({
      where: { id: numericId },
      data,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    throw createError('INTERNAL_SERVER_ERROR')
  }
}

export const deleteInfo = async (id) => {
  const numericId = Number(id)
  if (isNaN(numericId)) throw createError('INVALID_ID')

  try {
    return await prisma.communityInformation.delete({
      where: { id: numericId },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    throw createError('INTERNAL_SERVER_ERROR')
  }
}
