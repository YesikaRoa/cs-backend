import express from 'express'
import {
  getTestimonies,
  getTestimoniesByCommunityId,
  createTestimony,
  updateTestimony,
  deleteTestimony,
  changeTestimonyStatus,
} from '../controllers/testimonies.controller.js'
import { verifyToken } from '../middlewares/auth.js'
import { validate } from '../middlewares/validateInput.js'
import {
  TestimoniesSchema,
  TestimoniesUpdateSchema,
  ChangeTestimonyStatusSchema,
} from '../schemas/testimonies.schema.js'
import { optionalVerifyToken } from '../middlewares/optionalVerifyToken.js'

const router = express.Router()

// Ruta para obtener testimonios
router.get('/', optionalVerifyToken, getTestimonies)

// Obtener testimonio por ID de comunidad
router.get('/:id', getTestimoniesByCommunityId)

// Crear un nuevo testimonio (requiere token y validación)
router.post('/', validate(TestimoniesSchema), createTestimony)

// Actualizar un testimonio existente (requiere token y validación)
router.put(
  '/:id',
  verifyToken,
  validate(TestimoniesUpdateSchema),
  updateTestimony
)

// Eliminar un testimonio (requiere token)
router.delete('/:id', verifyToken, deleteTestimony)

router.put(
  '/:id/status',
  verifyToken,
  validate(ChangeTestimonyStatusSchema),
  changeTestimonyStatus
)

export default router
