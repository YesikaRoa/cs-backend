import { validateAndConvertId } from '../../../utils/validate'

describe('Utils: validateAndConvertId', () => {
  it('should convert a valid numeric string to number', () => {
    const result = validateAndConvertId('123')
    expect(result).toBe(123)
  })

  it('should throw an error for a non-numeric string', () => {
    expect(() => validateAndConvertId('abc')).toThrow()
    expect(() => validateAndConvertId('abc')).toThrow(
      'El ID proporcionado no es válido'
    ) // según tu errorList
  })

  it('should throw an error for a decimal number string', () => {
    expect(() => validateAndConvertId('12.34')).toThrow()
  })
})
