import {
  getProfileService,
  updateProfileService,
  changePasswordService,
} from '../services/profile.service.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user.id)
    res.json(user)
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await updateProfileService(req.user.id, req.body)
    res.json({
      message: 'Perfil actualizado correctamente',
      user: updatedUser,
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const result = await changePasswordService(
      req.user.id,
      currentPassword,
      newPassword
    )
    res.json(result)
  } catch (error) {
    next(error)
  }
}
