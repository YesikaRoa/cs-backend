import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../services/user.service.js'

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsers()
    res.status(200).json({ status: 200, data: users })
  } catch (error) {
    next(error)
  }
}

export const getSingleUser = async (req, res, next) => {
  try {
    const user = await getUserById(req.params.id)
    if (!user) {
      return res
        .status(404)
        .json({ status: 404, message: 'Usuario no encontrado' })
    }
    res.status(200).json({ status: 200, data: user })
  } catch (error) {
    next(error)
  }
}

export const updateAUser = async (req, res, next) => {
  try {
    const updated = await updateUser(req.params.id, req.body)
    res.status(200).json({
      status: 200,
      message: 'Usuario actualizado correctamente',
      data: updated,
    })
  } catch (error) {
    next(error)
  }
}

export const deleteAUser = async (req, res, next) => {
  try {
    await deleteUser(req.params.id)
    res.status(200).json({
      status: 200,
      message: 'Usuario eliminado correctamente',
    })
  } catch (error) {
    next(error)
  }
}
