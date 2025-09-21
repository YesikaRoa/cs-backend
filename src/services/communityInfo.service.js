import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

// Obtener toda la información de comunidades
export const getAllInfo = async (req) => {
  try {
    const user = req.user || {}
    const { community_id: communityId, rol_name: rolName } = user
    const { communityId: queryCommunityId } = req.query
    let where = {}

    if (queryCommunityId) {
      const numericCommunityId = validateAndConvertId(queryCommunityId)
      where.community_id = numericCommunityId
    }
    if (
      !queryCommunityId &&
      ['Community_Leader', 'Street_Leader'].includes(rolName)
    ) {
      where.community_id = communityId
    }
    const info = await prisma.communityInformation.findMany({
      where,
      select: {
        id: true,
        title: true,
        value: true,
      },
    })
    return info
  } catch (error) {
    throw error
  }
}

// Obtener información  por ID
export const getInfoByKey = async (key) => {
  try {
    const numericKey = validateAndConvertId(key)
    const info = await prisma.communityInformation.findUnique({
      where: { id: numericKey },
      select: { id: true, title: true, value: true },
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
    const numericKey = validateAndConvertId(key)
    const updatedInfo = await prisma.communityInformation.update({
      where: { id: numericKey },
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
