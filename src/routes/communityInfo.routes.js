import express from 'express'
import {
  getCommunityInfo,
  getCommunityInfoByKey,
  updateCommunityInfo,
} from '../controllers/communityInfo.controller.js'

import { validate } from '../middlewares/validateInput.js'
import { CommunityInfoUpdateSchema } from '../schemas/communityInfo.schema.js'
import { verifyToken } from '../middlewares/auth.js'
import { optionalVerifyToken } from '../middlewares/optionalVerifyToken.js'

const router = express.Router()

// Obtener toda la información de la comunidad
router.get('/', optionalVerifyToken, getCommunityInfo)

// Obtener información por Key
router.get('/:key', getCommunityInfoByKey)

// Actualizar información
router.put(
  '/:key',
  verifyToken,
  validate(CommunityInfoUpdateSchema),
  updateCommunityInfo
)

export default router
