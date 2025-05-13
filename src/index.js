import './config/env.js'
import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/posts.routes.js'
import testimoniesRoutes from './routes/testimonies.routes.js'
import communityInfoRoutes from './routes/communityInfo.routes.js'
import userRoutes from './routes/users.routes.js'

import { errorHandler } from './middlewares/errorHandler.js'
import { setupSwagger } from './docs/swagger.js'

const app = express()
app.use(express.json())
app.use(cors())
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/testimonies', testimoniesRoutes)
app.use('/api/community-information', communityInfoRoutes)
app.use('/api/users', userRoutes)
app.use(errorHandler)

// Swagger docs
setupSwagger(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
