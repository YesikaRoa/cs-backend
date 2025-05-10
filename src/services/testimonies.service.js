import e from 'cors'
import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

export const getAllTestimonies = async () => {
  const testimonies = await prisma.testimony.findMany({
    orderBy: { created_at: 'desc' },
  })
  return testimonies
}

// Obtener todos los testimonios por ID de comunidad
export const getTestimoniesByCommunity = async (communityId) => {
  try {
    const numericId = validateAndConvertId(communityId)

    const testimonies = await prisma.testimony.findMany({
      where: { community_id: numericId },
      orderBy: { created_at: 'desc' },
      include: { community: true },
    })

    if (testimonies.length === 0) {
      throw createError('RECORD_NOT_FOUND')
    }

    return testimonies
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

// Crear un nuevo testimonio
export const createTestimony = async (data) => {
  try {
    const { name, comment, community_id } = data

    const testimony = await prisma.testimony.create({
      data: {
        name,
        comment,
        community_id,
      },
    })

    return testimony
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

// Actualizar un testimonio
export const updateTestimony = async (id, data) => {
  try {
    const numericId = validateAndConvertId(id)

    const updatedTestimony = await prisma.testimony.update({
      where: { id: numericId },
      data,
    })

    return updatedTestimony
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

// Eliminar un testimonio
export const deleteTestimony = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    const deletedTestimony = await prisma.testimony.delete({
      where: { id: numericId },
    })

    return deletedTestimony
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
