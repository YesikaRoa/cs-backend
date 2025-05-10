import {
  getAllInfo as getAllCommunityInfoService,
  getInfoById as getCommunityInfoByIdService,
  createInfo as createCommunityInfoService,
  updateInfo as updateCommunityInfoService,
  deleteInfo as deleteCommunityInfoService,
} from '../services/communityInfo.service.js'

export const getCommunityInfo = async (req, res, next) => {
  try {
    const info = await getAllCommunityInfoService()
    res.status(200).json({ status: 200, data: info })
  } catch (error) {
    next(error)
  }
}

export const getCommunityInfoById = async (req, res, next) => {
  try {
    const info = await getCommunityInfoByIdService(req.params.id)
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
    const info = await createCommunityInfoService(req.body)
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
    const updatedInfo = await updateCommunityInfoService(
      req.params.id,
      req.body
    )
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
    await deleteCommunityInfoService(req.params.id)
    res.status(200).json({
      status: 200,
      message: 'Información eliminada con éxito',
    })
  } catch (error) {
    next(error)
  }
}
