import { prisma, Prisma } from '../config/db.js'

export const getAllInfo = async () => {
  return await prisma.communityInformation.findMany()
}

export const getInfoById = async (id) => {
  return await prisma.communityInformation.findUnique({
    where: { id: Number(id) },
  })
}

export const createInfo = async (data) => {
  const { id, ...safeData } = data // Elimina id si viene en el body
  return await prisma.communityInformation.create({ data: safeData })
}

export const updateInfo = async (id, data) => {
  return await prisma.communityInformation.update({
    where: { id: Number(id) },
    data,
  })
}

export const deleteInfo = async (id) => {
  return await prisma.communityInformation.delete({
    where: { id: Number(id) },
  })
}
