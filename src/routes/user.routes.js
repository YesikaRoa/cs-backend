import express from 'express'
import {
  getAllUsers,
  getSingleUser,
  updateAUser,
  deleteAUser,
} from '../controllers/user.controller.js'
import { validate } from '../middlewares/validateInput.js'
import { userCreateSchema, userUpdateSchema } from '../schemas/user.schema.js'

// Puedes agregar esquemas de validación para crear/actualizar usuario si los tienes
// import { userCreateSchema, userUpdateSchema } from '../schemas/user.schema.js'

const router = express.Router()

router.get('/', getAllUsers)
router.get('/:id', getSingleUser)
router.put('/:id', validate(userUpdateSchema), updateAUser)
router.delete('/:id', deleteAUser)

export default router
