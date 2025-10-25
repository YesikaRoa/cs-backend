import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

if (process.env.NODE_ENV !== 'test') {
  import('./config/env.js')
}
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/posts.routes.js'
import testimoniesRoutes from './routes/testimonies.routes.js'
import communityInfoRoutes from './routes/communityInfo.routes.js'
import userRoutes from './routes/users.routes.js'
import communityRoute from './routes/community.routes.js'
import postCategoryRoutes from './routes/postsCategories.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import profileRoutes from './routes/profile.routes.js'
import communityDocumentsRoutes from './routes/communityDocuments.route.js'

import { errorHandler } from './middlewares/errorHandler.js'
import { setupSwagger } from './docs/swagger.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(
  cors({
    origin: 'https://libertadores-cs.netlify.app', // tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true, // si usas cookies o autenticación con credenciales
  })
)
// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/testimonies', testimoniesRoutes)
app.use('/api/community_information', communityInfoRoutes)
app.use('/api/users', userRoutes)
app.use('/api/communities', communityRoute)
app.use('/api/posts_categories', postCategoryRoutes)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/profile', profileRoutes)
app.use('/api/documents', communityDocumentsRoutes)

app.use(errorHandler)

// Swagger
setupSwagger(app)

export default app
