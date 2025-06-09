import {
  getAllInfo as getAllCommunityInfoService,
  getInfoByKey as getCommunityInfoByKeyService,
  updateInfo as updateCommunityInfoService,
} from '../services/communityInfo.service.js'

export const getCommunityInfo = async (req, res, next) => {
  try {
    const info = await getAllCommunityInfoService()
    res.status(200).json({ status: 200, data: info })
  } catch (error) {
    next(error)
  }
}

export const getCommunityInfoByKey = async (req, res, next) => {
  try {
    const info = await getCommunityInfoByKeyService(req.params.key)
    if (!info) {
      return res.status(404).json({ status: 404, message: 'Info not found' })
    }
    res.status(200).json({ status: 200, data: info })
  } catch (error) {
    next(error)
  }
}

export const updateCommunityInfo = async (req, res, next) => {
  try {
    const updatedInfo = await updateCommunityInfoService(
      req.params.key,
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
