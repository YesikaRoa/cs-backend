import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'
import { BcryptAdapter } from '../adapters/bcryptAdapter.js'
import CloudinaryAdapter from '../adapters/CloudinaryAdapter.js'

const cloudinaryUser = new CloudinaryAdapter('users')

// Crear un nuevo usuario
export const createUser = async (reqBody) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      rol_id,
      community_id,
    } = reqBody

    const files = reqBody.files

    const hashedPassword = await BcryptAdapter.hash(password)

    const userDataToCreate = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      rol_id: parseInt(rol_id),
      community_id: parseInt(community_id),
      is_active: true,
    }

    if (files && files.length > 0) {
      const imageUrl = files[0].path
      userDataToCreate.url_image = imageUrl
    }

    await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: userDataToCreate,
      })
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw createError('DUPLICATE_RECORD')
    }

    console.error('Error en createUser:', error)
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

// Obtener todos los usuarios
export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      rol_id: true,
      community_id: true,
      url_image: true,
      is_active: true,
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

  return users
}

// Obtener usuario por ID
export const getUserById = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    const user = await prisma.user.findUnique({
      where: { id: numericId },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        phone: true,
        rol_id: true,
        community_id: true,
        url_image: true,
        is_active: true,
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

    if (!user) {
      throw createError('RECORD_NOT_FOUND')
    }

    return user
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

// Actualizar un usuario
export const updateUser = async (id, data, files) => {
  try {
    const numericId = validateAndConvertId(id)

    const currentUser = await prisma.user.findUnique({
      where: { id: numericId },
    })

    if (!currentUser) {
      throw createError('RECORD_NOT_FOUND')
    }

    if (files && files.length > 0) {
      if (currentUser.url_image) {
        await cloudinaryUser.deleteByUrl(currentUser.url_image)
      }

      const newImageUrl = files[0].path
      data.url_image = newImageUrl
    }

    const updatedUser = await prisma.user.update({
      where: { id: numericId },
      data,
    })

    return updatedUser
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

// Eliminar un usuario
export const deleteUser = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    const user = await prisma.user.findUnique({
      where: { id: numericId },
    })

    if (!user) {
      throw createError('RECORD_NOT_FOUND')
    }

    if (user.url_image) {
      await cloudinaryUser.deleteByUrl(user.url_image)
    }

    await prisma.user.delete({
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
