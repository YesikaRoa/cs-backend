import { redisClient } from '../config/redis.js'

export const clearPostsCache = async () => {
  try {
    const keys = await redisClient.keys('posts:*')
    if (keys.length > 0) {
      await redisClient.del(keys)
      console.log('🧹 Caché de posts invalidado')
    }
  } catch (error) {
    console.error('❌ Error limpiando la caché de posts:', error)
  }
}
