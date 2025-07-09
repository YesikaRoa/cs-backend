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

export const getTestimonies = async (req) => {
  try {
    const user = req.user || {}
    const { community_id: communityId, rol_name: rolName } = user
    const { communityId: queryCommunityId } = req.query
    let where = {}

    if (queryCommunityId) {
      const numericCommunityId = validateAndConvertId(queryCommunityId)
      where.community_id = numericCommunityId
      where.status = {
        in: ['published'],
      }
    }
    if (
      !queryCommunityId &&
      ['Community_Leader', 'Street_Leader'].includes(rolName)
    ) {
      where.community_id = communityId
    }
    if (!queryCommunityId && ['Admin', 'Community_Leader'].includes(rolName)) {
      where.status = {
        in: ['published', 'pending_approval'],
      }
    }

    const testimonies = await prisma.testimony.findMany({
      where,
      select: {
        id: true,
        name: true,
        comment: true,
        created_at: true,
        status: true,
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
  } catch (error) {
    throw error
  }
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
//id, newStatus
export const changeTestimonyStatus = async (req) => {
  try {
    const { id } = req.params
    const { status } = req.body

    if (![1, 2].includes(req.user.rol_id)) {
      throw createError('UNAUTHORIZED')
    }

    const numericId = validateAndConvertId(id)
    await prisma.testimony.update({
      where: { id: numericId },
      data: { status },
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
