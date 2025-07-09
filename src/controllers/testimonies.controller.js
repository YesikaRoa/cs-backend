import {
  createTestimony as createTestimonyService,
  getTestimoniesByCommunityId as getTestimoniesByCommunityIdService,
  updateTestimony as updateTestimonyService,
  deleteTestimony as deleteTestimonyService,
  getTestimonies as getTestimoniesService,
  changeTestimonyStatus as changeTestimonyStatusService,
} from '../services/testimonies.service.js'

// Obtener todos los testimonios
export const getTestimonies = async (req, res, next) => {
  try {
    const testimonies = await getTestimoniesService(req)
    res.status(200).json({ data: testimonies })
  } catch (error) {
    next(error)
  }
}

// Obtener todos los testimonios por ID de comunidad
export const getTestimoniesByCommunityId = async (req, res, next) => {
  const { searchBy } = req.query

  try {
    const testimonies = await getTestimoniesByCommunityIdService(
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
    const { name, comment, community_id } = req.body

    await createTestimonyService({
      name,
      comment,
      community_id,
    })

    res.status(201).json({
      message: 'Testimonio creado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

// Actualizar un testimonio
export const updateTestimony = async (req, res, next) => {
  try {
    await updateTestimonyService(req.params.id, req.body)
    res.status(200).json({
      message: 'Testimonio actualizado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

// Eliminar un testimonio
export const deleteTestimony = async (req, res, next) => {
  try {
    await deleteTestimonyService(req.params.id)
    res.status(200).json({
      message: 'Testimonio eliminado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const changeTestimonyStatus = async (req, res, next) => {
  try {
    await changeTestimonyStatusService(req)
    res.status(200).json({
      message: 'Estado del testimonio actualizado correctamente',
    })
  } catch (error) {
    next(error)
  }
}
