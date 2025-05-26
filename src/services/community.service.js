import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

export const getCommunityNames = async () => {
  try {
    const communities = await prisma.community.findMany({
      select: { id: true, name: true }, // Incluye el id y el name
    })
    return communities
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}
