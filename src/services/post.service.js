import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'
import { deleteFromCloudinary } from '../../cloudinary.js'

//Crea un nuevo post
export const createPost = async (postData) => {
  const { title, content, status, category_id, user_id, community_id, files } =
    postData

  let resolvedCommunityId

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

  const post = await prisma.post.create({
    data: {
      title,
      content,
      status: status || 'pending_approval',
      user_id: parseInt(user_id),
      community_id: resolvedCommunityId,
      category_id: category_id,
    },
  })

  if (files.length > 3) {
    throw createError('TOO_MANY_IMAGES', 'Demasiadas imágenes. Máximo 3.')
  }

  for (const file of files) {
    await prisma.imagePost.create({
      data: {
        post_id: post.id,
        url: file.path,
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
export const updatePost = async (id, data, files = []) => {
  const numericId = validateAndConvertId(id)

  // Solo permite modificar estos campos
  const allowedFields = ['title', 'content', 'status', 'category_id']
  const filteredData = Object.fromEntries(
    Object.entries(data).filter(([key]) => allowedFields.includes(key))
  )

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: numericId },
      include: { images: true },
    })

    if (!existingPost) {
      throw createError('RECORD_NOT_FOUND', 'El post no existe.')
    }

    if (files.length > 0) {
      for (const image of existingPost.images) {
        await deleteFromCloudinary(image.url)
      }

      await prisma.imagePost.deleteMany({
        where: { post_id: numericId },
      })

      for (const file of files.slice(0, 3)) {
        await prisma.imagePost.create({
          data: {
            post_id: numericId,
            url: file.path,
          },
        })
      }
    }

    const updatedPost = await prisma.post.update({
      where: { id: numericId },
      data: filteredData,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
            email: true,
            phone: true,
            role: {
              select: {
                name: true,
              },
            },
            is_active: true,
          },
        },
        community: {
          select: {
            name: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            url: true,
          },
        },
      },
    })

    return updatedPost
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND', 'Post no encontrado.')
    }
    throw error
  }
}

//eliminar un post
export const deletePost = async (id) => {
  const numericId = validateAndConvertId(id)

  try {
    const post = await prisma.post.findUnique({
      where: { id: numericId },
      include: { images: true },
    })

    if (!post) {
      throw createError('RECORD_NOT_FOUND', 'Post no encontrado.')
    }

    for (const image of post.images) {
      await deleteFromCloudinary(image.url)
    }

    await prisma.imagePost.deleteMany({
      where: { post_id: numericId },
    })

    const deletedPost = await prisma.post.delete({
      where: { id: numericId },
    })

    return deletedPost
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2025'
    ) {
      throw createError('RECORD_NOT_FOUND', 'El post no existe.')
    }

    throw error
  }
}
