import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'
import { BcryptAdapter } from '../adapters/bcryptAdapter.js'

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

    // Encriptar el password
    const hashedPassword = await BcryptAdapter.hash(password)

    const data = {
      first_name,
      last_name,
      email,
      password: hashedPassword,
      phone,
      rol_id,
      community_id,
      is_active: true,
    }

    await prisma.user.create({
      data,
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw createError('DUPLICATE_RECORD')
    }
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
export const updateUser = async (id, data) => {
  try {
    const numericId = validateAndConvertId(id)

    await prisma.user.update({
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

// Eliminar un usuario
export const deleteUser = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

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
