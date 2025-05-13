import {
  createTestimony as createTestimonyService,
  getTestimonyByIdOrCommunity as getTestimonyByIdOrCommunityService,
  updateTestimony as updateTestimonyService,
  deleteTestimony as deleteTestimonyService,
  getTestimonies as getTestimoniesService,
} from '../services/testimonies.service.js'

// Obtener todos los testimonios
export const getTestimonies = async (req, res, next) => {
  try {
    const testimonies = await getTestimoniesService()
    res.status(200).json({ status: 200, data: testimonies })
  } catch (error) {
    next(error)
  }
}

// Obtener todos los testimonios o uno por ID/comunidad
export const getTestimonyById = async (req, res, next) => {
  const { searchBy } = req.query

  try {
    const testimonies = await getTestimonyByIdOrCommunityService(
      req.params.id,
      searchBy
    )
    res.status(200).json({ status: 200, data: testimonies })
  } catch (error) {
    next(error)
  }
}

// Crear un nuevo testimonio
export const createTestimony = async (req, res, next) => {
  try {
    const { name, comment } = req.body
    const community_id = req.user.community_id || null

    const newTestimony = await createTestimonyService({
      name,
      comment,
      community_id,
    })

    res.status(201).json({
      status: 201,
      message: 'Testimonio creado con éxito',
      data: newTestimony,
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar un testimonio
export const updateTestimony = async (req, res, next) => {
  try {
    const updatedTestimony = await updateTestimonyService(
      req.params.id,
      req.body
    )
    res.status(200).json({ status: 200, data: updatedTestimony })
  } catch (error) {
    next(error)
  }
}

// Eliminar un testimonio
export const deleteTestimony = async (req, res, next) => {
  try {
    const deletedTestimony = await deleteTestimonyService(req.params.id)

    res.status(200).json({
      message: 'Testimonio eliminado con éxito',
      deletedTestimony,
    })
  } catch (error) {
    next(error)
  }
}
