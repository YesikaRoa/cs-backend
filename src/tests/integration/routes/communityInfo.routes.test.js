import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { registerAndLoginUser } from '../../helpers/authHelper.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/communityInfo.schema.json'

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
  await prisma.communityInformation.create({
    data: {
      id: 1,
      title: 'Información sobre Libertador Sineral',
      value: 'Libertador Sineral es una comunidad muy agradable, y entusiasta.',
      community_id: 1,
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
  await prisma.communityInformation.deleteMany()

  await prisma.$disconnect()
})

describe('CommunityInfo Routes', () => {
  describe('api/community_information: Get community_information ', () => {
    test('should retrieve all information from the communities', async () => {
      const res = await request.get('/api/community_information')

      const validateResponse = ajv.compile(schemas.getAllCommunity)
      const isValidResponse = validateResponse(res.body)

      if (!isValidResponse) console.error(validateResponse.errors)

      expect(isValidResponse).toBe(true)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
    test('should show each community', async () => {
      const res = await request.get('/api/communities')
      const validateResponse = ajv.compile(schemas.getAllCommunities)
      const isValidResponse = validateResponse(res.body)

      if (!isValidResponse) console.error(validateResponse.errors)

      expect(isValidResponse).toBe(true)

      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
    test('should retrieve information by id', async () => {
      const res = await request.get('/api/community_information/1')
      expect(res.statusCode).toBe(200)
      expect(res.body.data).toHaveProperty('id', 1)
    })
    test('should return 404 for non-existing id', async () => {
      const res = await request.get('/api/community_information/99999')
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
    })
    test('should return 400 for invalid id', async () => {
      const res = await request.get('/api/community_information/invalid-id')
      expect(res.statusCode).toBe(400)
      expect(res.body.message).toBe('El ID proporcionado no es válido')
    })
  })
  describe('api/communityInformation: Put community_information ', () => {
    test('should update community information', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .put('/api/community_information/1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Información actualizada',
          value: 'Esta es la información actualizada de la comunidad.',
        })
      expect(res.statusCode).toBe(200)
      expect(res.body.message).toBe('Información actualizada con éxito')
    })
    test('should return 401 if token is not provided', async () => {
      const res = await request.put('/api/community_information/1').send({
        title: 'Información actualizada',
        value: 'Esta es la información actualizada de la comunidad.',
      })
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
    })
    test('should return 404 for updating non-existing id', async () => {
      const { token } = await registerAndLoginUser()

      const res = await request
        .put('/api/community_information/99999')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Información actualizada',
          value: 'Esta es la información actualizada de la comunidad.',
        })
      expect(res.statusCode).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
    })
  })
})
