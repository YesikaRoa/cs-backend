import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'

//Crea un nuevo post
export const createPost = async (postData) => {
  // Desestructura directamente del objeto 'postData' que recibes
  const { title, content, status, category_id, user_id, community_id, files } =
    postData

  let resolvedCommunityId

  // Resuelve community_id si no se proporciona
  if (community_id === undefined) {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) }, // user_id ya debería ser un número aquí
      select: { community_id: true },
    })

    if (!user) {
      throw createError(
        'RECORD_NOT_FOUND',
        'Usuario no encontrado para resolver la comunidad.'
      )
    }

    resolvedCommunityId = user.community_id
  } else {
    resolvedCommunityId = community_id
  }

  // Create the post
  const post = await prisma.post.create({
    data: {
      title,
      content,
      status: status || 'pending_approval',
      user_id: parseInt(user_id),
      community_id: resolvedCommunityId,
      category_id: category_id, // category_id ya es un número por la validación Zod
    },
  })

  // Upload image URLs to ImagePost table (max 3)
  if (files.length > 3) {
    throw createError('TOO_MANY_IMAGES', 'Demasiadas imágenes. Máximo 3.')
  }

  for (const file of files) {
    await prisma.imagePost.create({
      data: {
        post_id: post.id,
        url: file.path, // Esto es la URL de Cloudinary
      },
    })
  }

  return post // El servicio devuelve el post creado
}

//Obtiene todos los posts
export const getPosts = async () => {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          // otros campos que necesites
        },
      },
      category: true,
      community: true,
      images: true,
    },
    orderBy: {
      created_at: 'desc',
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
      include: {
        user: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        category: true,
        community: true,
        images: true,
      },
    })

    if (!post) {
      throw createError('RECORD_NOT_FOUND')
    }

    return post
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
