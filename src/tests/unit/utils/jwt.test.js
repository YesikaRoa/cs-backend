import { generateToken } from '../../../utils/jwt'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

describe('Utils: generateToken ', () => {
  beforeEach(() => {
    JWT_SECRET = process.env.JWT_SECRET
  })

  it('should generate a valid JWT with the correct payload', () => {
    const token = generateToken('user123')

    // Verificar que sea un string
    expect(typeof token).toBe('string')

    // Decodificar el token
    const decoded = jwt.verify(token, JWT_SECRET)
    expect(decoded.userId).toBe('user123')
    expect(decoded.exp).toBeDefined() // tiene fecha de expiración
  })
})
