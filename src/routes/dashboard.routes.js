import express from 'express'
import { getDashboardData } from '../controllers/dashboard.controller.js'
import { verifyToken } from '../middlewares/auth.js'

const Router = express.Router()

Router.get('/', verifyToken, getDashboardData)

export default Router
