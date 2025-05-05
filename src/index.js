import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/posts.routes.js'
import testimoniesRoutes from './routes/testimonies.routes.js'
import communityInfoRoutes from './routes/communityInfo.routes.js'

import { errorHandler } from './middlewares/errorHandler.js'
import { setupSwagger } from './docs/swagger.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/testimonies', testimoniesRoutes)
app.use('/api/community_information', communityInfoRoutes)
app.use(errorHandler)

// Swagger docs
setupSwagger(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
