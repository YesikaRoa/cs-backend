import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { registerAndLoginUser } from '../../helpers/authHelper.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/users.schema.json'

const request = supertest(app)
const ajv = new Ajv({ allErrors: true })
addFormats(ajv)
beforeAll(async () => {
  await prisma.$connect()

  await prisma.community.create({
    data: {
      id: 1,
      name: 'Comunidad de prueba',
      description: 'Esta es una comunidad de prueba.',
      name_clap: 'Clap Comunidad de prueba',
      rif_community: 'J-prueba',
      address: 'Calleprueba',
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

describe('Users Routes', () => {
  describe('api/users: Get Users', () => {
    test('should return all users', async () => {
      const { token } = await registerAndLoginUser()
      const res = await request
        .get('/api/users')
        .set('Authorization', `Bearer ${token}`)
      const validate = ajv.compile(schemas.getAllUsers)
      const valid = validate(res.body)

      if (!valid) console.error(validate.errors)

      expect(valid).toBe(true)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
    test('should return 401 if no token provided', async () => {
      const res = await request.get('/api/users')
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
    })
    test('should return an user by ID', async () => {
      const { token, userId } = await registerAndLoginUser()

      const res = await request
        .get(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)

      const validate = ajv.compile(schemas.getUserById)
      const valid = validate(res.body)

      if (!valid) console.error(validate.errors)

      expect(valid).toBe(true)

      expect(res.statusCode).toBe(200)
      expect(typeof res.body.data).toBe('object')
    })
    test('should return 401 if no token provided an user by ID', async () => {
      const { userId } = await registerAndLoginUser()
      const res = await request.get(`/api/users/${userId}`)
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
    })
    test('should return 404 if user not found by ID', async () => {
      const { token } = await registerAndLoginUser()
      const res = await request
        .get(`/api/users/999999`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
      expect(res.body.error).toBe('NotFound')
    })
    test('should return 400 if user ID is invalid', async () => {
      const { token } = await registerAndLoginUser()
      const res = await request
        .get(`/api/users/invalid_id`)
        .set('Authorization', `Bearer ${token}`)
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe('El ID proporcionado no es válido')
      expect(res.body.error).toBe('BadRequest')
    })
    test('should return Community leaders', async () => {
      const res = await request.get(`/api/users/leaders`)
      const validate = ajv.compile(schemas.getCommunityLeaders)
      const valid = validate(res.body)

      if (!valid) console.error(validate.errors)

      expect(valid).toBe(true)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })
  describe('api/users: Create Users', () => {
    test('should create a new user', async () => {
      const { token } = await registerAndLoginUser()

      const payload = {
        email: 'prueba@gmail.com',
        password: 'pas123',
        first_name: 'Test',
        last_name: 'integration',
        phone: `${Date.now()}`,
        rol_id: 2,
        community_id: 1,
        dni: '1345678',
      }

      const validatePayload = ajv.compile(schemas.createUserPayload)
      const isPayloadValid = validatePayload(payload)

      if (!isPayloadValid) console.error(validatePayload.errors)
      expect(isPayloadValid).toBe(true)

      const res = await request
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Usuario creado con éxito')
    })
    test('should fail if the token is not sent', async () => {
      const res = await request.post('/api/users').send({
        email: 'prueba@gmail.com',
        password: 'pas123',
        first_name: 'Test',
        last_name: 'integration',
        phone: `${Date.now()}`,
        rol_id: 2,
        community_id: 1,
        dni: '1345678',
      })

      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
    })
    test('should fail if the data is invalid', async () => {
      const { token } = await registerAndLoginUser()
      const res = await request
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'prueba@gmail.com',
          password: 'pas123',
          first_name: 1,
          last_name: 'integration',
          phone: `${Date.now()}`,
          rol_id: 2,
          community_id: 1,
          dni: '1345678',
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Datos inválidos')
      expect(res.body.issues).toContain(
        'Expected string, received number [first_name]'
      )
    })
    test('should fail if the email already exists and return 409', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .post('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'prueba@gmail.com',
          password: 'pas123',
          first_name: 'Test',
          last_name: 'integration',
          phone: `${Date.now()}`,
          rol_id: 2,
          community_id: 1,
          dni: '1345678',
        })

      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('El registro ya existe')
    })
  })
  describe('api/users: Update Users', () => {
    test('should update an existing user', async () => {
      const { token, userId } = await registerAndLoginUser()

      const payload = {
        phone: `${Date.now()}`,
      }

      const validate = ajv.compile(schemas.updateUser)
      const valid = validate(payload)

      if (!valid) console.error(validate.errors)
      expect(valid).toBe(true)

      const res = await request
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(payload)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Usuario actualizado con éxito')
    })

    test('should fail if the token is not sent', async () => {
      const { userId } = await registerAndLoginUser()
      const res = await request.put(`/api/users/${userId}`).send({
        first_name: 'Test',
        phone: `${Date.now()}`,
      })

      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
    })
    test('should fail if the data is invalid', async () => {
      const { token, userId } = await registerAndLoginUser()

      const res = await request
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          first_name: 1,
        })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Datos inválidos')
      expect(res.body.issues).toContain(
        'Expected string, received number [first_name]'
      )
    })
    test('should fail if the email already exists and return 409', async () => {
      const { token, userId } = await registerAndLoginUser()

      const res = await request
        .put(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          email: 'prueba@gmail.com',
          dni: '1345678',
        })

      expect(res.statusCode).toBe(409)
      expect(res.body.message).toBe('El registro ya existe')
    })
  })
  describe('api/users: Delete Users', () => {
    test('should delete an existing user', async () => {
      const { token, userId } = await registerAndLoginUser()

      const res = await request
        .delete(`/api/users/${userId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Usuario eliminado con éxito')
    })

    test('should fail if the token is not sent', async () => {
      const { userId } = await registerAndLoginUser()
      const res = await request.delete(`/api/users/${userId}`)

      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
    })
    test('should return 404 if user to delete is not found', async () => {
      const { token } = await registerAndLoginUser()
      const res = await request
        .delete(`/api/users/999999`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
    })
  })
})
