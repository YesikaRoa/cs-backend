import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { registerAndLoginUser } from '../../helpers/authHelper.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/profile.schema.json'

const request = supertest(app)
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

beforeAll(async () => {
  await prisma.$connect()

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

  await prisma.$disconnect()
})

describe('Profile Routes', () => {
  describe('/api/profile: Get Profile', () => {
    test('should return profile data for authenticated user', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .get('/api/profile')
        .set('Authorization', `Bearer ${token}`)

      const validateRequest = ajv.compile(schemas.getProfile)
      const validRequest = validateRequest(res.body)
      if (!validRequest) console.error(validateRequest.errors)
      expect(validRequest).toBe(true)
      expect(res.statusCode).toBe(200)
    })
    test('should return 401 if no token provided', async () => {
      const res = await request.get('/api/profile')
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('status', 401)
      expect(res.body).toHaveProperty('message', 'Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
    })
  })
  describe('api/profile: Update Profile', () => {
    test('should update profile data for authenticated user', async () => {
      const { token } = await registerAndLoginUser()
      const payload = {
        first_name: 'Updated',
        last_name: 'User',
        email: 'updateduser@example.com',
        phone: '987654321',
      }
      const validatePayload = ajv.compile(schemas.updateProfile)
      const validRequest = validatePayload(payload)
      if (!validRequest) console.error(validatePayload.errors)
      expect(validRequest).toBe(true)

      const res = await request
        .put('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty(
        'message',
        'Perfil actualizado correctamente'
      )
    })
    test('should return 401 if no token provided', async () => {
      const res = await request.put('/api/profile').send({
        first_name: 'Updated',
        last_name: 'User',
        email: 'updateduser@example.com',
        phone: '987654321',
      })
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('status', 401)
      expect(res.body).toHaveProperty('message', 'Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
    })
    test('should return 400 for invalid data', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .put('/api/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'invalid-email',
        })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Datos inválidos')
      expect(res.body.issues).toContain('El correo debe ser válido [email]')
    })
  })
  describe('api/profile/change_password: Change Password', () => {
    test('should change password for authenticated user', async () => {
      const { token } = await registerAndLoginUser()
      const payload = {
        currentPassword: 'pas123',
        newPassword: 'newpass123',
      }
      const validatePayload = ajv.compile(schemas.updatePassword)
      const validRequest = validatePayload(payload)
      if (!validRequest) console.error(validatePayload.errors)
      expect(validRequest).toBe(true)
      const res = await request
        .put('/api/profile/change_password')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.statusCode).toBe(200)
      expect(res.body).toHaveProperty(
        'message',
        'Contraseña actualizada correctamente'
      )
    })
    test('should return 401 if no token provided', async () => {
      const res = await request.put('/api/profile/change_password').send({
        currentPassword: 'pas123',
        newPassword: 'newpass123',
      })
      expect(res.statusCode).toBe(401)
      expect(res.body).toHaveProperty('status', 401)
      expect(res.body).toHaveProperty('message', 'Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
    })
    test('should return 400 for invalid data', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .put('/api/profile/change_password')
        .set('Authorization', `Bearer ${token}`)
        .send({
          currentPassword: 'pas123',
          newPassword: 'short',
        })
      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Datos inválidos')
      expect(res.body.issues).toContain(
        'La nueva contraseña debe tener al menos 6 caracteres [newPassword]'
      )
    })
  })
})
