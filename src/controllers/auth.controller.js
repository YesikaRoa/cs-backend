import {
  registerUser,
  loginUser,
  getCurrentDate as getCurrentDateService,
  recoverPassword as recoverPasswordService,
} from '../services/auth.service.js'

export const register = async (req, res, next) => {
  try {
    await registerUser(req.body)
    res.status(201).json({
      message: 'Usuario creado con éxito',
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req, res, next) => {
  try {
    const { token } = await loginUser(req.body)
    res.status(200).json({
      data: { token },
    })
  } catch (error) {
    next(error)
  }
}

export const recoverPassword = async (req, res, next) => {
  try {
    await recoverPasswordService({ email: req.body.email })
    res.status(200).json({
      message:
        'Recuperación de contraseña exitosa, verifique su correo electrónico',
    })
  } catch (error) {
    next(error)
  }
}

export const getCurrentDate = async (req, res, next) => {
  try {
    const data = await getCurrentDateService()
    res.status(200).json({
      message: 'Date',
      data,
    })
  } catch (error) {
    next(error)
  }
}
