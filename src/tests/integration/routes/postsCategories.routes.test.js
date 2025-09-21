import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/postsCategories.schema.json'

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

const request = supertest(app)

beforeAll(async () => {
  await prisma.$connect()
  await prisma.postCategory.createMany({
    data: [{ name: 'Project' }, { name: 'Event' }],
  })
})

afterAll(async () => {
  await prisma.postCategory.deleteMany()
  await prisma.$disconnect()
})

describe('PostCategories Routes', () => {
  describe('api/posts_categories', () => {
    test('should get all post categories', async () => {
      const res = await request.get('/api/posts_categories')
      const validateRequest = ajv.compile(schemas.postsCategories)
      const validRequest = validateRequest(res.body)

      if (!validRequest) console.error(validateRequest.errors)

      expect(validRequest).toBe(true)
      expect(res.statusCode).toBe(200)

      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })
})
