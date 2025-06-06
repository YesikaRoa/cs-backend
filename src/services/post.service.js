import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'
import { deleteFromCloudinary } from '../../cloudinary.js'

//Crea un nuevo post
export const createPost = async (postData) => {
  try {
    const {
      title,
      content,
      status,
      category_id,
      user_id,
      community_id,
      files,
    } = postData

    const post = await prisma.post.create({
      data: {
        title,
        content,
        status,
        user_id: parseInt(user_id),
        community_id,
        category_id,
      },
    })

    if (files.length > 3) {
      throw createError('TOO_MANY_IMAGES')
    }

    for (const file of files) {
      await prisma.imagePost.create({
        data: {
          post_id: post.id,
          url: file.path,
        },
      })
    }

    return post
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
}

//Obtiene todos los posts
export const getPosts = async () => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: {
          select: {
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
  } catch (error) {
    throw createError('INTERNAL_SERVER_ERROR')
  }
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
            first_name: true,
            last_name: true,
            email: true,
          },
        },
        category: true,
        community: {
          select: {
            name: true,
          },
        },
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

// actualizar un post
export const updatePost = async (id, data, files = []) => {
  const numericId = validateAndConvertId(id)

  try {
    const existingPost = await prisma.post.findUnique({
      where: { id: numericId },
      include: { images: true },
    })

    if (!existingPost) {
      throw createError('RECORD_NOT_FOUND')
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

// eliminar un post
export const deletePost = async (id) => {
  const numericId = validateAndConvertId(id)

  try {
    const post = await prisma.post.findUnique({
      where: { id: numericId },
      include: { images: true },
    })

    if (!post) {
      throw createError('RECORD_NOT_FOUND')
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
      throw createError('RECORD_NOT_FOUND')
    }

    throw error
  }
}
