import {
  registerUser,
  loginUser,
  recoverPasswordUser,
} from '../services/auth.service.js'

export const register = async (req, res, next) => {
  try {
    const user = await registerUser(req.body)
    res.status(201).json({
      status: 201,
      message: 'Usuario creado con éxito',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  console.log('Login request:', req.body)
  try {
    const { token } = await loginUser(req.body)
    res.status(200).json({
      status: 200,
      message: 'Login exitoso',
      data: { token },
    })
  } catch (error) {
    next(error)
  }
}

export const recoverPassword = async (req, res, next) => {
  console.log('Login request:', req.body)
  try {
    const user = await recoverPasswordUser(req.body)
    res.status(200).json({
      status: 200,
      message: 'Recuperación de contraseña exitosa',
      data: user,
    })
  } catch (error) {
    next(error)
  }
}

export const getProfile = async (req, res) => {
  const { id, email } = req.user
  res.json({ id, email })
}
