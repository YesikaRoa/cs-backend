import { errorList } from '../errors/errorList.js'

export function createError(code) {
  const {
    status = 500,
    message = 'Error interno',
    error = 'InternalServerError',
  } = errorList[code] || {}
  const err = new Error(message)
  err.status = status
  err.name = error
  return err
}
