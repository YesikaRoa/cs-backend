import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
  changePostStatus as changePostStatusService,
} from '../services/post.service.js'

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category_id } = req.body
    const community_id = req.user.community_id || null
    const user_id = req.user.id
    const files = req.files || []
    const user_role = req.user.rol_id

    let status = [1, 2].includes(user_role) ? 'published' : 'pending_approval'

    const postDataForService = {
      title,
      content,
      category_id,
      user_id,
      community_id,
      status,
      files,
    }

    const newPost = await createPostService(postDataForService)

    res.status(201).json({
      message: 'Post creado con éxito',
      data: newPost,
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

    const updatedPost = await updatePostService(req.params.id, data, files)

    res.status(200).json({
      message: 'Post actualizado correctamente',
      data: updatedPost,
    })
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await deletePostService(req.params.id)

    res.status(200).json({
      message: 'Post eliminado con éxito',
      deletedPost,
    })
  } catch (error) {
    next(error)
  }
}

export const changePostStatus = async (req, res, next) => {
  try {
    const postId = req.params.id
    const role = req.user.rol_id

    let newStatus
    if (role && (role === 1 || role === 2)) {
      newStatus = 'published'
    } else if (role && role === 3) {
      newStatus = 'pending_approval'
    } else {
      return next(new Error('No tienes permiso para cambiar el status'))
    }

    const updatedPost = await changePostStatusService(postId, newStatus)
    res.status(200).json({
      message: 'Estado de la publicación actualizado correctamente',
      data: updatedPost,
    })
  } catch (error) {
    next(error)
  }
}
