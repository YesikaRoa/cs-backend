import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

export const getAllTestimonies = async () => {
  return await prisma.testimony.findMany()
}

export const getTestimoniesByCommunity = async (communityId) => {
  const id = Number(communityId)
  if (isNaN(id)) throw createError('INVALID_ID')

  const testimonies = await prisma.testimony.findMany({
    where: { community_id: id },
    orderBy: { created_at: 'desc' },
  })

  if (testimonies.length === 0) {
    throw createError('RECORD_NOT_FOUND') // Usar el error definido en errorList
  }

  return testimonies
}

export const createTestimony = async (data) => {
  return await prisma.testimony.create({ data })
}

export const updateTestimony = async (id, data) => {
  const numericId = Number(id)
  if (isNaN(numericId)) throw createError('INVALID_ID')

  try {
    return await prisma.testimony.update({
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

export const deleteTestimony = async (id) => {
  const numericId = Number(id)
  if (isNaN(numericId)) throw createError('INVALID_ID')

  try {
    return await prisma.testimony.delete({ where: { id: numericId } })
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
