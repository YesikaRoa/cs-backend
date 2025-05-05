import {
  getAllInfo,
  getInfoById,
  createInfo,
  updateInfo,
  deleteInfo,
} from '../services/communityInfo.service.js'

export const getCommunityInfo = async (req, res, next) => {
  try {
    const info = await getAllInfo()
    res.status(200).json({ status: 200, data: info })
  } catch (error) {
    next(error)
  }
}

export const getCommunityInfoById = async (req, res, next) => {
  try {
    const info = await getInfoById(req.params.id)
    if (!info) {
      return res.status(404).json({ status: 404, message: 'Info not found' })
    }
    res.status(200).json({ status: 200, data: info })
  } catch (error) {
    next(error)
  }
}

export const createCommunityInfo = async (req, res, next) => {
  try {
    const info = await createInfo(req.body)
    res.status(201).json({
      status: 201,
      message: 'Información creada con éxito',
      data: info,
    })
  } catch (error) {
    next(error)
  }
}

export const updateCommunityInfo = async (req, res, next) => {
  try {
    const updatedInfo = await updateInfo(req.params.id, req.body)
    res.status(200).json({
      status: 200,
      message: 'Información actualizada con éxito',
      data: updatedInfo,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteCommunityInfo = async (req, res, next) => {
  try {
    await deleteInfo(req.params.id)
    res.status(200).json({
      status: 200,
      message: 'Información eliminada con éxito',
    })
  } catch (error) {
    next(error)
  }
}
