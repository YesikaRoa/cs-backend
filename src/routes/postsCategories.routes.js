import express from 'express'
import { getPostCategoriesController } from '../controllers/postsCategories.controller.js'

const postCategoryRoutes = express.Router()

postCategoryRoutes.get('/', getPostCategoriesController)

export default postCategoryRoutes
