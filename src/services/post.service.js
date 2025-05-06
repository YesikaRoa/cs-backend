import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'

//Crea un nuevo post
export const createPost = async (reqBody) => {
  try {
    const { title, content, category_id, user_id, community_id } = reqBody

    const data = {
      title,
      content,
      status: 'published',
      user_id,
      community_id,
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
export const getPostByIdService = async (id) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id },
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
    const updatedPost = await prisma.post.update({
      where: { id },
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

    throw createError('INTERNAL_SERVER_ERROR')
  }
}

//eliminar un post
export const deletePost = async (id) => {
  try {
    const deletedPost = await prisma.post.delete({
      where: { id },
    })

    return deletedPost
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND')
    }

    throw createError('INTERNAL_SERVER_ERROR')
  }
}
