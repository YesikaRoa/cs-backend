import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
} from '../services/post.service.js'

export const createPost = async (req, res, next) => {
  try {
    const { title, content, category_id } = req.body

    const user_id = req.user.id
    const community_id = req.user.community_id || null

    const newPost = await createPostService({
      title,
      content,
      category_id,
      user_id,
      community_id,
    })

    res.status(201).json({
      status: 201,
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
    res.status(200).json({ status: 200, data: posts })
  } catch (error) {
    next(error)
  }
}

export const getPostById = async (req, res, next) => {
  try {
    const id = Number(req.params.id)
    if (isNaN(id)) {
      return next(createError('INVALID_ID')) // Lanza un error si el ID no es válido
    }

    const post = await getPostByIdService(id)
    res.status(200).json({ status: 200, data: post })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const updated = await updatePostService(Number(req.params.id), req.body)
    res.status(200).json({ status: 200, data: updated })
  } catch (error) {
    next(error)
  }
}

export const deletePost = async (req, res, next) => {
  try {
    const deletedPost = await deletePostService(Number(req.params.id))

    res.status(200).json({
      message: 'Post eliminado con éxito',
      deletedPost,
    })
  } catch (error) {
    next(error)
  }
}
