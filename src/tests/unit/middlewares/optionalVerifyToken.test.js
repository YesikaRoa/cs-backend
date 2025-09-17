import { optionalVerifyToken } from '../../../middlewares/optionalVerifyToken.js'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

describe('Middleware: optionalVerifyToken', () => {
  let req, res, next
  const JWT_SECRET = process.env.JWT_SECRET
  const userPayload = { id: 1, role: 'user' }

  beforeEach(() => {
    req = {
      headers: {},
    }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  it('should call next if no token is provided', () => {
    optionalVerifyToken(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  it('should call next if token is valid', () => {
    const token = jwt.sign(userPayload, JWT_SECRET)
    req.headers.authorization = `Bearer ${token}`
    optionalVerifyToken(req, res, next)
    expect(req.user).toBeDefined()
    expect(next).toHaveBeenCalled()
  })

  it('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalidtoken'
    optionalVerifyToken(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' })
  })
})
