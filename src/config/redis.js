import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = createClient({
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT), // Asegúrate que es número
  },
})

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error', err)
})

await redisClient.connect()
console.log('✅ Redis conectado correctamente')

export default redisClient
