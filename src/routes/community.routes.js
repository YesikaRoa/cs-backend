import express from 'express'
import fetchCommunityNames from '../controllers/community.controller.js'

const router = express.Router()

// Route to fetch community names
router.get('/', fetchCommunityNames)

export default router
