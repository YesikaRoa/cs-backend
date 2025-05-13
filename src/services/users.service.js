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
      password: hashedPassword, // Usar el password encriptado
      phone,
      rol_id,
      community_id,
      is_active: true,
    }

    const user = await prisma.user.create({ data })

    return user
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
    include: {
      role: true,
      community: true,
    },
  })

  return users
}

// Obtener usuario por ID o usuarios por comunidad
export const getUserById = async (id, searchBy = 'user') => {
  try {
    if (searchBy !== 'true' && searchBy !== 'false') {
      throw createError('INVALID_ID')
    }

    const numericId = validateAndConvertId(id)

    const searchByType = searchBy === 'true' ? 'user' : 'community'

    const whereCondition =
      searchByType === 'user' ? { id: numericId } : { community_id: numericId }

    const queryMethod = searchByType === 'user' ? 'findUnique' : 'findMany'

    const result = await prisma.user[queryMethod]({
      where: whereCondition,
      include: {
        role: true,
        community: true,
      },
    })

    if (!result || (Array.isArray(result) && result.length === 0)) {
      throw createError('RECORD_NOT_FOUND')
    }

    return result
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

    const deletedUser = await prisma.user.delete({
      where: { id: numericId },
    })

    return deletedUser
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
