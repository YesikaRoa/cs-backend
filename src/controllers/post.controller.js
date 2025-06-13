import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  changePostStatus as changePostStatusService,
} from '../services/post.service.js'
import { changePostStatusSchema } from '../schemas/posts.schema.js'

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category_id } = req.body
    const { community_id, id: user_id, rol_id } = req.user
    const files = req.files || []

    let status = [1, 2].includes(rol_id) ? 'published' : 'pending_approval'

    const postDataForService = {
      title,
      content,
      category_id,
      user_id,
      community_id,
      status,
      files,
    }

    await createPostService(postDataForService)

    res.status(201).json({
      message: 'Publicación creada con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const getPosts = async (req, res, next) => {
  try {
    const posts = await getPostsService()
    res.status(200).json({ data: posts })
  } catch (error) {
    next(error)
  }
}

export const getPostById = async (req, res, next) => {
  try {
    const post = await getPostByIdService(req.params.id)
    res.status(200).json({ data: post })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const { title, content, category_id } = req.body

    const files = req.files || []

    const data = {
      title,
      content,
      category_id,
    }

    await updatePostService(req.params.id, data, files)

    res.status(200).json({
      message: 'Publicación actualizada con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    await deletePostService(req.params.id)

    res.status(200).json({
      message: 'Publicación eliminada con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const changePostStatus = async (req, res, next) => {
  try {
    // Solo los usuarios con rol 1 o 2 pueden cambiar el status
    if (!(req.user.rol_id === 1 || req.user.rol_id === 2)) {
      return next(new Error('No tienes permiso para cambiar el status'))
    }
    // Valida que el body contenga un status válido ("published" o "draft")
    const { status: newStatus } = changePostStatusSchema.parse(req.body)

    const updatedPost = await changePostStatusService(req.params.id, newStatus)
    res.status(200).json({
      message: 'Estado de la publicación actualizado correctamente',
      data: updatedPost,
    })
  } catch (error) {
    next(error)
  }
}
