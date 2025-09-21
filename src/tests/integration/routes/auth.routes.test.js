import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { registerAndLoginUser } from '../../helpers/authHelper.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/auth.schema.json'

const request = supertest(app)
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

beforeAll(async () => {
  await prisma.$connect()

  await prisma.role.create({
    data: { id: 2, name: 'Community_Leader' },
  })
  await prisma.community.create({
    data: {
      id: 1,
      name: 'Libertador Sineral',
      description:
        'Libertador Sineral es una comunidad muy agradable, y entusiasta.',
      name_clap: 'Clap Libertador Sineral',
      rif_community: 'J-30242443',
      address: 'Calle Falsa 123',
    },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.community.deleteMany()

  await prisma.$disconnect()
})

describe('Auth Routes', () => {
  describe('api/auth/register', () => {
    test('should register a new user', async () => {
      const payload = {
        email: 'test@gmail.com',
        password: 'pas123',
        first_name: 'Test',
        last_name: 'integration',
        community_id: 1,
        phone: '04120000000',
        rol_id: 2,
      }

      const validatePayload = ajv.compile(schemas.createRegister)
      const isValidPayload = validatePayload(payload)

      if (!isValidPayload) console.error(validatePayload.errors)

      expect(isValidPayload).toBe(true)
      const res = await request.post('/api/auth/register').send(payload)
      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Usuario creado con éxito')

      const user = await prisma.user.findUnique({
        where: {
          email: 'test@gmail.com',
        },
      })
      expect(user).not.toBeNull()
    })
    test('should fail if the email address already exists', async () => {
      const { userId } = await registerAndLoginUser()

      const user = await prisma.user.findUnique({ where: { id: userId } })

      const res = await request.post('/api/auth/register').send({
        email: user.email,
        password: 'pas123',
        first_name: 'Test',
        last_name: 'integration',
        phone: '04120007000',
        rol_id: 2,
        community_id: 1,
        dni: '12345677',
      })
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe('El correo electrónico ya está en uso')
    })
  })
  describe('api/auth/login', () => {
    test('should log in a valid user and return the token', async () => {
      const { token, userId } = await registerAndLoginUser()

      expect(token).toBeDefined()

      const user = await prisma.user.findUnique({
        where: { id: userId },
      })
      expect(user).not.toBeNull()
    })

    test('should fail if credentials are invalid', async () => {
      const res = await request.post('/api/auth/login').send({
        email: 'wrong@gmail.com',
        password: 'pas125',
      })
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe('Credenciales inválidas')
    })
  })
})
