import express from 'express'
import {
  getCommunityInfo,
  getCommunityInfoById,
  createCommunityInfo,
  updateCommunityInfo,
  deleteCommunityInfo,
} from '../controllers/communityInfo.controller.js'

import { validate } from '../middlewares/validateInput.js'
import {
  CommunityInfoSchema,
  CommunityInfoUpdateSchema,
} from '../schemas/communityInfo.schema.js'
import { verifyToken } from '../middlewares/auth.js'

const router = express.Router()

// Obtener toda la información de la comunidad
router.get('/', getCommunityInfo)

// Obtener información por ID
router.get('/:id', getCommunityInfoById)

// Crear información
router.post(
  '/',
  verifyToken,
  validate(CommunityInfoSchema),
  createCommunityInfo
)

// Actualizar información
router.put(
  '/:id',
  verifyToken,
  validate(CommunityInfoUpdateSchema),
  updateCommunityInfo
)

// Eliminar información
router.delete('/:id', verifyToken, deleteCommunityInfo)

export default router
