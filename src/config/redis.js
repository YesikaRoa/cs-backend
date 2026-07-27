import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = process.env.REDIS_URL
  ? createClient({ url: process.env.REDIS_URL })
  : createClient({
      username: process.env.REDIS_USER,
      password: process.env.REDIS_PASS,
      socket: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
      },
    })

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error', err)
})

// Función asíncrona para manejar la conexión
async function connectRedis() {
  try {
    await redisClient.connect()
    console.log('✅ Redis conectado correctamente')
  } catch (error) {
    console.error('❌ Error al conectar a Redis:', error)
  }
}

export { redisClient, connectRedis }
