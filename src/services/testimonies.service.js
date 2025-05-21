import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

// Crear un nuevo testimonio
export const createTestimony = async (reqBody) => {
  try {
    const { name, comment, community_id } = reqBody

    const data = {
      name,
      comment,
      community_id,
    }

    const testimony = await prisma.testimony.create({ data })

    return testimony
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

// Obtener todos los testimonios
export const getTestimonies = async () => {
  const testimonies = await prisma.testimony.findMany({
    include: {
      community: true,
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
      include: {
        community: true,
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
    const community = await prisma.community.findUnique({
      where: { id: data.community_id },
    })

    if (!community) {
      throw createError('COMMUNITY_NOT_FOUND')
    }

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
