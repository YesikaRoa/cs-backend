import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
} from '../services/post.service.js'

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
