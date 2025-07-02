import {
  getProfile as getProfileService,
  changePassword as changePasswordService,
  updatePofile as updatePofileService,
} from '../services/profile.service.js'

export const getProfile = async (req, res, next) => {
  try {
    const user = await getProfileService(req.user.id)
    res.json(user)
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

export const updateProfile = async (req, res, next) => {
  try {
    const { first_name, last_name, email, phone } = req.body

    const files = req.files || []

    const data = {
      first_name,
      last_name,
      email,
      phone,
    }

    await updatePofileService(req.user.id, data, files)
    res.status(200).json({ message: 'Perfil actualizado correctamente' })
  } catch (error) {
    next(error)
  }
}
