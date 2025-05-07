import { createError } from './errors.js'

export const validateAndConvertId = (id) => {
  const numericId = Number(id)
  if (isNaN(numericId) || !Number.isInteger(numericId)) {
    throw createError('INVALID_ID')
  }
  return numericId
}
