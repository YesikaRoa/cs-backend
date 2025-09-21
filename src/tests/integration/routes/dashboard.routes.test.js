import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { registerAndLoginUser } from '../../helpers/authHelper.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/dashboard.schema.json'

const request = supertest(app)
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

beforeAll(async () => {
  await prisma.$connect()

  await prisma.postCategory.create({
    data: {
      id: 1,
      name: 'Project',
    },
  })
  await prisma.community.create({
    data: {
      id: 1,
      name: 'Rio Zuñiga',
      description: 'Rio Zuñiga es una comunidad muy agradable, y entusiasta.',
      name_clap: 'Clap Rio Zuñiga',
      rif_community: 'J-30242483',
      address: 'Calle Falsa 456',
    },
  })
  await prisma.role.create({
    data: { id: 2, name: 'Community_Leader' },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.community.deleteMany()
  await prisma.postCategory.deleteMany()

  await prisma.$disconnect()
})

describe('Dashboard Routes', () => {
  describe('api/dashboard : Get dashboard', () => {
    test('should return dashboard statistics', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .get('/api/dashboard')
        .set('Authorization', `Bearer ${token}`)

      const validateRequest = ajv.compile(schemas.getDashboard)
      const validRequest = validateRequest(res.body)

      if (!validRequest) console.error(validateRequest.errors)

      expect(validRequest).toBe(true)
      expect(res.statusCode).toBe(200)
    })
    test('should return 401 if no token provided', async () => {
      const res = await request.get('/api/dashboard')
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('status', 401)
      expect(res.body).toHaveProperty('message', 'Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
    })
  })
})
