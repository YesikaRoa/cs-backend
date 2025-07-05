import express from 'express'
import { generateDocument } from '../controllers/communityDocuments.controller.js'

const router = express.Router()

router.post('/', generateDocument)

export default router
