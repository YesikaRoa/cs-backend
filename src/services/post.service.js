import { prisma, Prisma } from '../config/db.js'
import { createError } from '../utils/errors.js'
import { validateAndConvertId } from '../utils/validate.js'
import CloudinaryAdapter from '../adapters/CloudinaryAdapter.js'
import redisClient from '../config/redis.js'
import { clearPostsCache } from '../utils/cache.js'

const cloudinaryPost = new CloudinaryAdapter('posts')
const redisTimeout = parseInt(process.env.REDIS_TIMEOUT) || 1800 // 30 minutes default

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
    await clearPostsCache()
  } catch (error) {
    throw error
  }
}
//obtener todos los posts
export const getPosts = async (req) => {
  try {
    const user = req.user || {}
    const { community_id: communityId, rol_name: rolName } = user
    const { communityId: queryCommunityId } = req.query

    // Construir filtro para consulta en DB
    let where = {}

    if (queryCommunityId) {
      const numericCommunityId = validateAndConvertId(queryCommunityId)
      where.community_id = numericCommunityId
      where.status = {
        in: ['published'],
      }

      // Crear una clave de caché única para esta consulta (basada en req.query y usuario)
      const cacheKey = `posts:${rolName || 'guest'}:communityId=${
        queryCommunityId || 'all'
      }`

      // Intentar obtener datos desde Redis
      const cachedPosts = await redisClient.get(cacheKey)
      if (cachedPosts) {
        // Si existe cache, retornamos el resultado parseado directamente
        console.log('⚡️ Cache hit')
        return JSON.parse(cachedPosts)
      }
      console.log('🔥 Cache miss - consultando DB')
    }

    if (
      !queryCommunityId &&
      ['Community_Leader', 'Street_Leader'].includes(rolName)
    ) {
      where.community_id = communityId
      where.status = {
        in: ['published', 'pending_approval'],
      }
    }

    if (!queryCommunityId && ['Admin'].includes(rolName)) {
      where.status = {
        in: ['published', 'pending_approval'],
      }
    }

    // Si no hay communityId en query y rol name es 'Admin', devuelve todos los posts
    const posts = await prisma.post.findMany({
      where,
      include: {
        user: {
          select: {
            first_name: true,
            last_name: true,
          },
        },
        category: { select: { name: true } },
        community: {
          select: {
            name: true,
          },
        },
        images: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    if (queryCommunityId) {
      // Guardar en cache
      await redisClient.set(cacheKey, JSON.stringify(posts), {
        EX: redisTimeout,
      })
    }

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
        category: { select: { name: true } },
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
        await cloudinaryPost.deleteByUrl(image.url)
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

    await prisma.post.update({
      where: { id: numericId },
      data,
    })
    await clearPostsCache()
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
      await cloudinaryPost.deleteByUrl(image.url)
    }

    await prisma.imagePost.deleteMany({
      where: { post_id: numericId },
    })

    await prisma.post.delete({
      where: { id: numericId },
    })
    await clearPostsCache()
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

export const changePostStatus = async (id, newStatus) => {
  try {
    const numericId = validateAndConvertId(id)
    await prisma.post.update({
      where: { id: numericId },
      data: { status: newStatus },
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
