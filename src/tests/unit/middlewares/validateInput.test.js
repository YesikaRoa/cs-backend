import { validate } from '../../../middlewares/validateInput.js'

describe('Middleware: validateInput', () => {
  let req, res, next

  const validData = { id: 1, name: 'Yesika' }
  const schema = {
    parse: jest.fn().mockReturnValue(validData),
  }

  beforeEach(() => {
    req = { body: {} }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should call next and set req.body if validation succeeds', () => {
    validate(schema)(req, res, next)

    expect(req.body).toEqual(validData)

    expect(next).toHaveBeenCalled()
  })

  it('should return 400 with proper issues if validation fails', () => {
    schema.parse.mockImplementationOnce(() => {
      throw {
        errors: [
          { message: 'ID must be a number', path: ['id'] },
          { message: 'Name must be at least 2 characters', path: ['name'] },
        ],
      }
    })

    validate(schema)(req, res, next)

    expect(res.status).toHaveBeenCalledWith(400)

    expect(res.json).toHaveBeenCalledWith({
      error: 'Datos inválidos',
      issues: [
        'ID must be a number [id]',
        'Name must be at least 2 characters [name]',
      ],
    })
  })
})
