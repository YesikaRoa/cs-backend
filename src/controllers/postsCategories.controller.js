import { getPostCategories } from '../services/postsCategories.service.js'

export const getPostCategoriesController = async (req, res, next) => {
  try {
    const categories = await getPostCategories()
    res.status(200).json({ status: 200, data: categories })
  } catch (error) {
    next(error)
  }
}
