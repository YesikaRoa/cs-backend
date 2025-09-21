import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/testimonies.schema.json'
import { registerAndLoginUser } from '../../helpers/authHelper.js'

const request = supertest(app)

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

beforeAll(async () => {
  await prisma.$connect()

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
  await prisma.role.create({
    data: { id: 2, name: 'Community_Leader' },
  })
})

afterAll(async () => {
  await prisma.user.deleteMany()
  await prisma.community.deleteMany()
  await prisma.role.deleteMany()

  await prisma.$disconnect()
})
describe('Testimonies Routes', () => {
  describe('api/testimonies: Create testimony', () => {
    test('should create a new testimonial', async () => {
      const requestBody = {
        name: 'Testimonio',
        comment: 'Un test de testimonio',
        status: 'pending_approval',
        community_id: 1,
      }

      const validateRequest = ajv.compile(schemas.createTestimony)
      const validRequest = validateRequest(requestBody)
      if (!validRequest) console.error(validateRequest.errors)
      expect(validRequest).toBe(true)

      const res = await request.post('/api/testimonies').send(requestBody)

      expect(res.statusCode).toBe(201)
      expect(res.body.message).toBe('Testimonio creado con éxito')
    })
  })
  describe('api/testimonies: Get testimonies', () => {
    test('should obtain all the testimonies', async () => {
      const res = await request.get('/api/testimonies')

      const validate = ajv.compile(schemas.allTestimonies)
      const valid = validate(res.body)

      if (!valid) {
        console.error(validate.errors)
      }

      expect(res.statusCode).toBe(200)
      expect(valid).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
    test('should obtain the testimony by ID', async () => {
      const community_id = 1
      const res = await request.get(`/api/testimonies/${community_id}`)

      const validate = ajv.compile(schemas.testimoniesByCommunity)
      const valid = validate(res.body)

      if (!valid) console.error(validate.errors)
      expect(valid).toBe(true)

      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.data.length).toBeGreaterThan(0)
      expect(res.body.data[0]).toHaveProperty('community.id', 1)
    })
    test('should return 404 if no testimonies found for the community', async () => {
      const community_id = 99999
      const res = await request.get(`/api/testimonies/${community_id}`)

      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
    })
    test('should return 400 for invalid community ID', async () => {
      const community_id = 'invalid-id'
      const res = await request.get(`/api/testimonies/${community_id}`)
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe('El ID proporcionado no es válido')
    })
  })
  describe('api/testimonies: Update testimonies', () => {
    test('should update an testimony', async () => {
      const { token } = await registerAndLoginUser()

      await request.post('/api/testimonies').send({
        name: 'Test',
        comment: 'original',
        community_id: 1,
      })
      const testimonies = await request.get('/api/testimonies/1')
      const id = testimonies.body.data.at(-1).id

      const res = await request
        .put(`/api/testimonies/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ comment: 'Test actualizado' })

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Testimonio actualizado con éxito')
    })
    test('should fail if the token is not sent', async () => {
      await request.post('/api/testimonies').send({
        name: 'Test',
        comment: 'original',
        community_id: 1,
      })
      const testimonies = await request.get('/api/testimonies/1')
      const id = testimonies.body.data.at(-1).id

      const res = await request
        .put(`/api/testimonies/${id}`)
        .send({ comment: 'Test actualizado' })

      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
    })
    test('should fail if the data and ID is invalid', async () => {
      const { token } = await registerAndLoginUser()
      const id = 'id_invalid'

      const res = await request
        .put(`/api/testimonies/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ comment: 2 })

      expect(res.statusCode).toBe(400)
      expect(res.body.error).toBe('Datos inválidos')
      expect(res.body.issues).toContain(
        'Expected string, received number [comment]'
      )
    })
    test('should fail if it cannot find the record.', async () => {
      const { token } = await registerAndLoginUser()
      const id = 99999

      const res = await request
        .put(`/api/testimonies/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ comment: 'Test actualizado' })

      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
    })
  })
  describe('api/testimonies: Delete testimonies', () => {
    test('should delete a testimony', async () => {
      const { token } = await registerAndLoginUser()

      const testimonies = await request.get('/api/testimonies/1')
      const id = testimonies.body.data.at(-1).id

      const res = await request
        .delete(`/api/testimonies/${id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Testimonio eliminado con éxito')
    })
    test('should fail if the token is not sent', async () => {
      const testimonies = await request.get('/api/testimonies/1')
      const id = testimonies.body.data.at(-1).id

      const res = await request.delete(`/api/testimonies/${id}`)

      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
    })
    test('should fail if the ID is invalid', async () => {
      const { token } = await registerAndLoginUser()
      const id = 'invalid_id'

      const res = await request
        .delete(`/api/testimonies/${id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe('El ID proporcionado no es válido')
    })
  })
})
