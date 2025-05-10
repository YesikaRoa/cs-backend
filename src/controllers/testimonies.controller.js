import {
  createTestimony as createTestimonyService,
  getAllTestimonies as getTestimoniesService,
  getTestimoniesByCommunity as getTestimoniesByCommunityService,
  updateTestimony as updateTestimonyService,
  deleteTestimony as deleteTestimonyService,
} from '../services/testimonies.service.js'

export const getTestimonies = async (req, res, next) => {
  try {
    const testimonies = await getTestimoniesService()
    res.status(200).json({ status: 200, data: testimonies })
  } catch (error) {
    next(error)
  }
}

export const getTestimoniesByCommunity = async (req, res, next) => {
  try {
    const { communityId } = req.params
    const testimonies = await getTestimoniesByCommunityService(communityId)
    res.status(200).json({ status: 200, data: testimonies })
  } catch (error) {
    next(error)
  }
}

export const createTestimony = async (req, res, next) => {
  try {
    const { name, comment } = req.body // Asegúrate de que el cuerpo de la solicitud incluya estos campos
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
