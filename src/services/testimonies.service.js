import { prisma, Prisma } from '../config/db.js'

export const getAllTestimonies = async () => {
  return await prisma.testimony.findMany()
}

export const getTestimoniesByCommunity = async (communityId) => {
  const id = Number(communityId)
  if (isNaN(id)) throw new Error('Invalid community ID')

  return await prisma.testimony.findMany({
    where: { community_id: id },
    orderBy: { created_at: 'desc' },
  })
}

export const createTestimony = async (data) => {
  return await prisma.testimony.create({ data })
}

export const updateTestimony = async (id, data) => {
  const numericId = Number(id)
  if (isNaN(numericId)) throw new Error('Invalid testimony ID')

  return await prisma.testimony.update({
    where: { id: numericId },
    data,
  })
}

export const deleteTestimony = async (id) => {
  const numericId = Number(id)
  if (isNaN(numericId)) throw new Error('Invalid testimony ID')

  return await prisma.testimony.delete({ where: { id: numericId } })
}
