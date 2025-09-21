import { createError } from '../../../utils/errors'
import { errorList } from '../../../errors/errorList'

describe('Utils: createError', () => {
  test('should return the correct error for a random valid code', () => {
    const codes = Object.keys(errorList)
    const randomCode = codes[Math.floor(Math.random() * codes.length)]

    const err = createError(randomCode)
    const expected = errorList[randomCode]

    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe(expected.message)
    expect(err.status).toBe(expected.status)
    expect(err.name).toBe(expected.error)
  })

  test('should return default error if code does not exist', () => {
    const err = createError('CODE_NOT_EXIST')

    expect(err).toBeInstanceOf(Error)
    expect(err.message).toBe('Error interno')
    expect(err.status).toBe(500)
    expect(err.name).toBe('InternalServerError')
  })
})
