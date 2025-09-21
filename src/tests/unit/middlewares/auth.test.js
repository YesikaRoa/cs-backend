import jwt from 'jsonwebtoken'
import { verifyToken } from '../../../middlewares/auth.js'
import 'dotenv/config'

describe('Middleware: verifyToken', () => {
  let req, res, next
  const JWT_SECRET = process.env.JWT_SECRET
  const userPayload = { id: 1, role: 'user' }

  beforeEach(() => {
    req = { headers: {} }
    res = {}
    next = jest.fn()
  })

  const getNextError = () => next.mock.calls[0][0]

  it('calls next with NO_TOKEN_PROVIDED if header is missing', () => {
    verifyToken(req, res, next)
    const err = getNextError()
    expect(err.message).toBe('Token no proporcionado')
    expect(err.status).toBe(401)
    expect(err.name).toBe('Unauthorized')
  })

  it('calls next with NO_TOKEN_PROVIDED if header does not start with Bearer', () => {
    req.headers.authorization = 'invalid_token'
    verifyToken(req, res, next)
    const err = getNextError()
    expect(err.message).toBe('Token no proporcionado')
    expect(err.status).toBe(401)
    expect(err.name).toBe('Unauthorized')
  })

  it('calls next with INVALID_TOKEN if token is invalid', () => {
    req.headers.authorization = 'Bearer invalid_token'
    verifyToken(req, res, next)
    const err = getNextError()
    expect(err.message).toBe('Token inválido')
    expect(err.status).toBe(401)
    expect(err.name).toBe('Unauthorized')
  })

  it('sets req.user and calls next with valid token', () => {
    const token = jwt.sign(userPayload, JWT_SECRET)
    req.headers.authorization = `Bearer ${token}`

    verifyToken(req, res, next)

    expect(req.user).toMatchObject(userPayload)
    expect(next).toHaveBeenCalledWith()
  })
})
