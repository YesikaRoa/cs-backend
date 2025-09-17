import { errorHandler } from '../../../middlewares/errorHandler.js'

describe('Middleware: errorHandler', () => {
  let req, res, next

  beforeEach(() => {
    req = {}
    res = {
      status: jest.fn().mockReturnThis(), // permite encadenar .json después
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('respond with the error data if defined', () => {
    const err = {
      status: 400,
      message: 'Petición inválida',
      name: 'BadRequest',
    }

    errorHandler(err, req, res, next)

    expect(res.json).toHaveBeenCalledWith({
      status: 400,
      message: 'Petición inválida',
      error: 'BadRequest',
    })
  })

  it('use default values if no properties are passed in err', () => {
    const err = {}

    errorHandler(err, req, res, next)

    expect(res.json).toHaveBeenCalledWith({
      status: 500,
      message: 'Error interno del servidor',
      error: 'InternalServerError',
    })
  })
})
