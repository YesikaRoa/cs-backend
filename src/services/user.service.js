import prisma from '../config/db.js'
import bcrypt from 'bcryptjs'

export const getUsers = async () => {
  return await prisma.user.findMany()
}

export const getUserById = async (id) => {
  return await prisma.user.findUnique({
    where: { id: Number(id) },
  })
}

export const updateUser = async (id, data) => {
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10)
  }
  const updatedUser = await prisma.user.update({
    where: { id: Number(id) },
    data,
  })
  return updatedUser
}

export const deleteUser = async (id) => {
  return await prisma.user.delete({
    where: { id: Number(id) },
  })
}
