import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

//Crea un nuevo post
export const createPost = async (reqBody) => {
  try {
    const { title, content, status, category_id, user_id, community_id } =
      reqBody

    let resolvedCommunityId

    if (community_id === undefined) {
      // No vino community_id en la petición, lo buscamos en DB
      const user = await prisma.user.findUnique({
        where: { id: user_id },
        select: { community_id: true },
      })

      if (!user) {
        throw createError('RECORD_NOT_FOUND')
      }

      resolvedCommunityId = user.community_id
    } else {
      // Vino community_id explícito (incluso null o 0)
      resolvedCommunityId = community_id
    }

    const data = {
      title,
      content,
      status: status || 'pending_approval',
      user_id,
      community_id: resolvedCommunityId,
      category_id,
    }

    const post = await prisma.post.create({ data })

    return post
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

//Obtiene todos los posts
export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      category: true,
      community: true,
    },
  })

  return posts
}

//obtener un post por id
export const getPostById = async (id) => {
  try {
    const numericId = validateAndConvertId(id)

    const post = await prisma.post.findUnique({
      where: { id: numericId },
      include: { user: true, category: true },
    })

    if (!post) {
      throw createError('RECORD_NOT_FOUND')
    }

    return post
  } catch (error) {
    // Si el error es de Prisma y tiene el código P2025, lanza RECORD_NOT_FOUND
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    // Propaga otros errores inesperados
    throw error
  }
}
//actualizar un post
export const updatePost = async (id, data) => {
  try {
    const numericId = validateAndConvertId(id)

    const updatedPost = await prisma.post.update({
      where: { id: numericId },
      data,
    })

    return updatedPost
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

//eliminar un post
export const deletePost = async (id) => {
  try {
    const numericId = validateAndConvertId(id)
    const deletedPost = await prisma.post.delete({
      where: { id: numericId },
    })

    return deletedPost
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
