import express from 'express'
import { getDashboardDataController } from '../controllers/dashboard.controller.js'

const Router = express.Router()

Router.get('/', getDashboardDataController)

export default Router
