import {
  createUser as createUserService,
  getAllUsers as getUsersService,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
  getLeadersByCommunity as getLeadersService,
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
      dni,
    } = req.body
    const files = req.files || []

    const userDataForService = {
      first_name,
      last_name,
      email,
      password,
      phone,
      rol_id,
      community_id,
      dni,
      files,
    }

    await createUserService(userDataForService)

    res.status(201).json({
      message: 'Usuario creado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await getUsersService(req)
    res.status(200).json({ data: users })
  } catch (error) {
    next(error)
  }
}

export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id)
    res.status(200).json({ data: user })
  } catch (error) {
    next(error)
  }
}

export const updateUser = async (req, res, next) => {
  try {
    await updateUserService(req.params.id, req.body)
    res.status(200).json({
      message: 'Usuario actualizado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const deleteUser = async (req, res, next) => {
  try {
    await deleteUserService(req.params.id)
    res.status(200).json({
      message: 'Usuario eliminado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const getLeaders = async (req, res, next) => {
  try {
    const { communityId } = req.query
    const leaders = await getLeadersService(communityId)
    res.status(200).json({ data: leaders })
  } catch (error) {
    next(error)
  }
}
