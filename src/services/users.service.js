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
      dni,
      files,
    } = reqBody

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
      dni,
      url_image: '',
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

    throw error
  }
}

// Obtener todos los usuarios
export const getAllUsers = async (req) => {
  const { community_id: communityId, rol_name: rolName } = req.user
  let where = {}

  // Si el rol es Community_Leader o Street_Leader, filtra por comunidad
  if (rolName === 'Community_Leader' || rolName === 'Street_Leader') {
    where.community_id = communityId
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
      rol_id: true,
      community_id: true,
      url_image: true,
      dni: true,
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
        dni: true,
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
export const updateUser = async (id, reqBody) => {
  try {
    const numericId = validateAndConvertId(id)

    const currentUser = await prisma.user.findUnique({
      where: { id: numericId },
    })

    if (!currentUser) {
      throw createError('RECORD_NOT_FOUND')
    }

    const updatedUser = await prisma.user.update({
      where: { id: numericId },
      data: reqBody,
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

// Obtener líderes por comunidad
export const getLeadersByCommunity = async (communityId) => {
  try {
    let where = {
      role: {
        name: {
          in: ['Community_Leader', 'Street_Leader'],
        },
      },
    }

    if (communityId !== null && communityId !== undefined) {
      const numericCommunityId = validateAndConvertId(communityId)
      where.community_id = numericCommunityId
    }

    const leaders = await prisma.user.findMany({
      where,
      select: {
        first_name: true,
        last_name: true,
        url_image: true,
        role: {
          select: {
            name: true,
          },
        },
        community: {
          select: {
            name: true,
          },
        },
      },
    })

    return leaders
  } catch (error) {
    throw error
  }
}
