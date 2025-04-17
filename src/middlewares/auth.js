import jwt from 'jsonwebtoken'
import { createError } from '../utils/errors.js'

export function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(createError('NO_TOKEN_PROVIDED'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // guarda info del usuario en el request
    next()
  } catch (error) {
    return next(createError('INVALID_TOKEN'))
  }
}
