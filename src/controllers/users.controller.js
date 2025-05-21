import {
  createUser as createUserService,
  getAllUsers as getUsersService,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '../services/users.service.js'

export const createUser = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      rol_id,
      community_id,
    } = req.body

    const newUser = await createUserService({
      first_name,
      last_name,
      email,
      password,
      phone,
      rol_id,
      community_id,
    })

    res.status(201).json({
      status: 201,
      message: 'Usuario creado con éxito',
      data: newUser,
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsersService()
    res.status(200).json({ status: 200, data: users })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    res.status(200).json({ status: 200, data: user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await updateUserService(req.params.id, req.body)
    res.status(200).json({ status: 200, data: updatedUser })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id)

    res.status(200).json({
      message: 'Usuario eliminado con éxito',
      deletedUser,
    })
  } catch (error) {
    next(error)
  }
}
