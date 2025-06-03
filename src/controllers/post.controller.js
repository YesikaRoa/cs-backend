import {
  createPost as createPostService,
  getPosts as getPostsService,
  getPostById as getPostByIdService,
  updatePost as updatePostService,
  deletePost as deletePostService,
} from '../services/post.service.js'

import { z } from 'zod'

export const createPost = async (req, res, next) => {
  try {
    const { title, content, status, category_id, community_id } = req.body

    const user_id = req.user.id
    const files = req.files || []

    const postDataForService = {
      title,
      content,
      status,
      category_id,
      user_id,
      community_id,
      files,
    }

    const newPost = await createPostService(postDataForService)

    res.status(201).json({
      status: 201,
      message: 'Post creado con éxito',
      data: newPost,
    })
  } catch (error) {
    console.error('[POST_CREATE_ERROR]', error)

    if (error && error.isCustomError) {
      return res.status(error.statusCode || 500).json({ error: error.message })
    }
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
    const post = await getPostByIdService(req.params.id)
    res.status(200).json({ status: 200, data: post })
  } catch (error) {
    next(error)
  }
}

export const updatePost = async (req, res, next) => {
  try {
    const updated = await updatePostService(req.params.id, req.body)
    res.status(200).json({ status: 200, data: updated })
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
