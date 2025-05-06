import * as testimonyService from '../services/testimonies.service.js'

export const getTestimonies = async (req, res, next) => {
  try {
    const testimonies = await testimonyService.getAllTestimonies()
    res.json(testimonies)
  } catch (error) {
    next(error)
  }
}

export const getTestimoniesByCommunity = async (req, res, next) => {
  try {
    const { communityId } = req.params
    const testimonies = await testimonyService.getTestimoniesByCommunity(
      communityId
    )
    res.status(200).json(testimonies)
  } catch (error) {
    next(error)
  }
}

export const createTestimony = async (req, res, next) => {
  try {
    const testimony = await testimonyService.createTestimony(req.body)
    res.status(201).json(testimony)
  } catch (error) {
    next(error)
  }
}

export const updateTestimony = async (req, res, next) => {
  try {
    const testimony = await testimonyService.updateTestimony(
      req.params.id,
      req.body
    )
    res.status(200).json(testimony)
  } catch (error) {
    next(error)
  }
}

export const deleteTestimony = async (req, res, next) => {
  try {
    await testimonyService.deleteTestimony(req.params.id)
    res.json({ status: 200, message: 'Testimony deleted successfully' })
  } catch (error) {
    next(error)
  }
}
