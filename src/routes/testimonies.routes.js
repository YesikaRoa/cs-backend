import express from 'express'
import {
  getTestimonies,
  getTestimonyById,
  createTestimony,
  updateTestimony,
  deleteTestimony,
} from '../controllers/testimonies.controller.js'
import { verifyToken } from '../middlewares/auth.js'
import { validate } from '../middlewares/validateInput.js'
import {
  TestimoniesSchema,
  TestimoniesUpdateSchema,
} from '../schemas/testimonies.schema.js'

const router = express.Router()

// Ruta para obtener testimonios
router.get('/', getTestimonies)

// Obtener testimonio por ID o testimonios por comunidad
router.get('/:id', getTestimonyById)

// Crear un nuevo testimonio (requiere token y validación)
router.post('/', verifyToken, validate(TestimoniesSchema), createTestimony)

// Actualizar un testimonio existente (requiere token y validación)
router.put(
  '/:id',
  verifyToken,
  validate(TestimoniesUpdateSchema),
  updateTestimony
)

// Eliminar un testimonio (requiere token)
router.delete('/:id', verifyToken, deleteTestimony)

export default router
