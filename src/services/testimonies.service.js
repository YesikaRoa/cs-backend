import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

// Crear un nuevo testimonio
export const createTestimony = async (reqBody) => {
  try {
    await prisma.testimony.create({ data: reqBody })
  } catch (error) {
    throw error
  }
}

// Obtener todos los testimonios
export const getTestimonies = async () => {
  const testimonies = await prisma.testimony.findMany({
    select: {
      id: true,
      name: true,
      comment: true,
      created_at: true,
      community: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  return testimonies
}

// Obtener testimonios por ID de comunidad
export const getTestimoniesByCommunityId = async (communityId) => {
  try {
    const numericId = validateAndConvertId(communityId)

    const testimonies = await prisma.testimony.findMany({
      where: { community_id: numericId },
      select: {
        id: true,
        name: true,
        comment: true,
        created_at: true,
        community: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    if (!testimonies || testimonies.length === 0) {
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

// Actualizar un testimonio
export const updateTestimony = async (id, data) => {
  try {
    const numericId = validateAndConvertId(id)

    await prisma.testimony.update({
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
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw createError('DUPLICATE_RECORD')
    }

    throw error
  }
}

// Eliminar un testimonio
export const deleteTestimony = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    await prisma.testimony.delete({
      where: { id: numericId },
    })
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
