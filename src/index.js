// index.js

import app from './app.js'
import { connectRedis } from './config/redis.js'

const PORT = process.env.PORT || 3002

// Llama a la función de conexión y espera a que termine.
// Solo inicia el servidor si la conexión fue exitosa.
async function startServer() {
  try {
    await connectRedis()
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1) // Sal del proceso si no se puede conectar a Redis
  }
}

startServer()
