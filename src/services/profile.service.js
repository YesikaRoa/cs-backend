import { prisma } from '../config/db.js'
import bcrypt from 'bcryptjs'
import { createError } from '../utils/errors.js'

// export const getProfile = async (userId) => {
//   try {
//     const user = await prisma.user.findUnique({
//       where: { id: userId },
//       include: {
//         role: { select: { id: true, name: true } },
//         community: { select: { id: true, name: true } },
//       },
//     })

//     console.log('User found:', user)

//     if (!user) throw createError('RECORD_NOT_FOUND')

//     return {
//       first_name: user.first_name,
//       last_name: user.last_name,
//       email: user.email,
//       phone: user.phone,
//       role: user.role,
//       community: user.community,
//     }
//   } catch (error) {
//     throw error
//   }
// }

export const getProfile = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        role: {
          select: {
            id: true,
            name: true,
          },
        },
        community: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (!user) throw createError('RECORD_NOT_FOUND')

    return user
  } catch (error) {
    throw error
  }
}

export const changePassword = async (userId, currentPassword, newPassword) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) throw createError('USER_NOT_FOUND')

    const isMatch = await bcrypt.compare(currentPassword, user.password)
    if (!isMatch) throw createError('INVALID_CREDENTIALS')

    const hashedPassword = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword, updatedAt: new Date() },
    })

    return { message: 'Contraseña actualizada correctamente' }
  } catch (error) {
    throw error
  }
}
