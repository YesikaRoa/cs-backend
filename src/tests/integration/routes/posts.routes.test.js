import supertest from 'supertest'
import app from '../../../app.js'
import { prisma } from '../../../config/db.js'
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals'
import { redisClient, connectRedis } from '../../../config/redis.js'
import { registerAndLoginUser } from '../../helpers/authHelper.js'
import Ajv from 'ajv'
import addFormats from 'ajv-formats'
import schemas from '../../schemas/posts.schema.json'

const request = supertest(app)

const ajv = new Ajv({ allErrors: true })
addFormats(ajv)

async function CreatePost(postData) {
  const { token } = await registerAndLoginUser()

  const resPost = await request
    .post('/api/posts')
    .set('Authorization', `Bearer ${token}`)
    .send(postData)
  const postId = resPost.body.data?.id
  return { resPost, postId }
}

beforeAll(async () => {
  await prisma.$connect()
  await connectRedis()

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
  await prisma.postCategory.create({
    data: {
      id: 1,
      name: 'Project',
    },
  })
})

afterAll(async () => {
  await prisma.post.deleteMany()
  await prisma.user.deleteMany()
  await prisma.role.deleteMany()
  await prisma.community.deleteMany()
  await prisma.postCategory.deleteMany()

  await prisma.$disconnect()
  await redisClient.quit()
})

describe('Posts Routes', () => {
  describe('api/posts: Create Post', () => {
    test('should create a new post', async () => {
      const postData = {
        title: 'Nuevo post',
        content: 'Este un test del endpoint de Post, para actualizar',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      }

      const validatePost = ajv.compile(schemas.createPost)
      const isValid = validatePost(postData)

      if (!isValid) {
        console.error(validatePost.errors)
      }

      expect(isValid).toBe(true)

      const { resPost } = await CreatePost(postData)

      expect(resPost.statusCode).toBe(201)
      expect(resPost.body.message).toBe('Publicación creada con éxito')
    })
    test('should fail if invalid data is sent.', async () => {
      const { resPost } = await CreatePost({
        title: 1,
        content: 'Este un test del endpoint de Post, para actualizar',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })
      expect(resPost.statusCode).toBe(400)
      expect(resPost.body.error).toBe('Datos inválidos')
      expect(resPost.body.issues).toContain(
        'Expected string, received number [title]'
      )
    })
    test('should fail if the token is not sent', async () => {
      const res = await request.post('/api/posts').send({
        title: 'La comunidad maravillosa',
        content: 'Este un test del endpoint de Post',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })
      expect(res.statusCode).toBe(401)
      expect(res.body.message).toBe('Token no proporcionado')
      expect(res.body.error).toBe('Unauthorized')
      expect(res.body.data?.token).toBeUndefined()
    })
  })
  describe('api/posts: Get Posts', () => {
    test('should retrieve all posts', async () => {
      const res = await request.get('/api/posts')

      const validateResponse = ajv.compile(schemas.getAllPosts)
      const isValidResponse = validateResponse(res.body)

      if (!isValidResponse) console.error(validateResponse.errors)

      expect(isValidResponse).toBe(true)
      expect(res.statusCode).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
    test('should retrieve a publication by ID', async () => {
      const { postId } = await CreatePost({
        title: 'Post para getById',
        content: 'Contenido para test getById',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })
      const res = await request.get(`/api/posts/${postId}`)

      expect(res.status).toBe(200)
      expect(typeof res.body.data).toBe('object')
      expect(res.body.data.id).toBe(postId)
    })
    test('should fail if post ID does not exist', async () => {
      const id = 999999
      const res = await request.get(`/api/posts/${id}`)

      expect(res.status).toBe(404)
      expect(res.body.message).toBe('Registro no encontrado')
    })
    test('should fail if post ID is invalid', async () => {
      const id = 'asddc'
      const res = await request.get(`/api/posts/${id}`)

      expect(res.status).toBe(400)
      expect(res.body.message).toBe('El ID proporcionado no es válido')
    })
  })
  describe('api/posts: Update Post', () => {
    test('should update a post', async () => {
      const { token } = await registerAndLoginUser()
      const { postId } = await CreatePost({
        title: 'Post para actualizar un post',
        content: 'Contenido actualizar un post',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })

      const resUpdatePost = await request
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Nuevo Post actualizado',
          content: 'Contenido actualizado',
        })

      expect(resUpdatePost.statusCode).toBe(200)
      expect(resUpdatePost.body.message).toBe(
        'Publicación actualizada con éxito'
      )
    })
    test('should fail if the data is invalid ', async () => {
      const { token } = await registerAndLoginUser()

      const { postId } = await CreatePost({
        title: 'Post para actualizar un post',
        content: 'Contenido para actualizar un post',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })

      const resUpdatePost = await request
        .put(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 1,
          content: 'Contenido actualizado',
        })

      expect(resUpdatePost.statusCode).toBe(400)
      expect(resUpdatePost.body.error).toBe('Datos inválidos')
      expect(resUpdatePost.body.issues).toContain(
        'Expected string, received number [title]'
      )
    })
    test('should fail if it does not send an authorization token ', async () => {
      const id = 1

      const resUpdatePost = await request.put(`/api/posts/${id}`).send({
        title: 'Nuevo Post actualizado',
        content: 'Contenido actualizado',
      })

      expect(resUpdatePost.statusCode).toBe(401)
      expect(resUpdatePost.body.error).toBe('Unauthorized')
      expect(resUpdatePost.body.message).toBe('Token no proporcionado')
    })
    test('should fail because record not found ', async () => {
      const { token } = await registerAndLoginUser()

      const id = 999999
      const resUpdatePost = await request
        .put(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Nuevo Post actualizado',
          content: 'Contenido actualizado',
        })

      expect(resUpdatePost.statusCode).toBe(404)
      expect(resUpdatePost.body.error).toBe('NotFound')
    })
  })
  describe('api/posts: Update Status Post', () => {
    test('should update the status of a post', async () => {
      const { token } = await registerAndLoginUser()
      const { postId } = await CreatePost({
        title: 'Post para actualizar un post',
        content: 'Contenido actualizar un post',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })

      const resUpdatePost = await request
        .put(`/api/posts/${postId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'published',
        })

      expect(resUpdatePost.statusCode).toBe(200)
      expect(resUpdatePost.body.message).toBe(
        'Estado de la publicación actualizado correctamente'
      )
    })
    test('should fail if it does not send an authorization token ', async () => {
      const id = 1

      const resUpdatePost = await request.put(`/api/posts/${id}/status`).send({
        status: 'published',
      })

      expect(resUpdatePost.statusCode).toBe(401)
      expect(resUpdatePost.body.error).toBe('Unauthorized')
      expect(resUpdatePost.body.message).toBe('Token no proporcionado')
    })
    test('should fail because record not found ', async () => {
      const { token } = await registerAndLoginUser()

      const id = 999999

      const resUpdatePost = await request
        .put(`/api/posts/${id}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'draft',
        })

      expect(resUpdatePost.statusCode).toBe(404)
      expect(resUpdatePost.body.error).toBe('NotFound')
      expect(resUpdatePost.body.message).toBe('Registro no encontrado')
    })
    test('should fail if the data is invalid ', async () => {
      const { token } = await registerAndLoginUser()
      const { postId } = await CreatePost({
        title: 'Post para actualizar un post',
        content: 'Contenido actualizar un post',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })

      const resUpdatePost = await request
        .put(`/api/posts/${postId}/status`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'publishe',
        })

      expect(resUpdatePost.statusCode).toBe(400)
      expect(resUpdatePost.body.error).toBe('Datos inválidos')
      expect(resUpdatePost.body.issues).toContain(
        "El status debe ser 'published' o 'draft' [status]"
      )
    })
  })
  describe('api/posts: Delete Post', () => {
    test('should delete a post', async () => {
      const { token } = await registerAndLoginUser()

      const { postId } = await CreatePost({
        title: 'Post para eliminar un post',
        content: 'Contenido eliminar un post',
        status: 'pending_approval',
        user_id: 1,
        community_id: 1,
        category_id: 1,
      })

      const resDeletePost = await request
        .delete(`/api/posts/${postId}`)
        .set('Authorization', `Bearer ${token}`)

      expect(resDeletePost.statusCode).toBe(200)
      expect(resDeletePost.body.message).toBe('Publicación eliminada con éxito')
    })
    test('should fail if it does not send an authorization token ', async () => {
      const id = 1

      const resDeletePost = await request.delete(`/api/posts/${id}`).send({
        status: 'published',
      })

      expect(resDeletePost.statusCode).toBe(401)
      expect(resDeletePost.body.error).toBe('Unauthorized')
      expect(resDeletePost.body.message).toBe('Token no proporcionado')
    })
    test('should fail because record not found ', async () => {
      const { token } = await registerAndLoginUser()

      const id = 999999

      const resDeletePost = await request
        .delete(`/api/posts/${id}`)
        .set('Authorization', `Bearer ${token}`)

      expect(resDeletePost.statusCode).toBe(404)
      expect(resDeletePost.body.error).toBe('NotFound')
    })
  })
})
