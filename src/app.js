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

const defaultOrigins = [
  'https://libertadores-cs.netlify.app',
  'https://cs-websitee.netlify.app',
  'http://localhost:3004',
  'http://localhost:5173',
  'http://localhost:3000',
]

const envOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim())
  : []

const allowedOrigins = [...new Set([...defaultOrigins, ...envOrigins])]

const corsOptions = {
  origin: (origin, callback) => {
    // Permite solicitudes sin origen (Postman, cURL, servidor-a-servidor)
    if (!origin) return callback(null, true)

    const normalizedOrigin = origin.replace(/\/$/, '')
    const isAllowed = allowedOrigins.some(
      (allowed) => allowed.replace(/\/$/, '') === normalizedOrigin
    )

    if (isAllowed) {
      callback(null, true)
    } else {
      console.warn('❌ CORS bloqueado para origen:', origin)
      callback(null, false)
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  credentials: true,
  optionsSuccessStatus: 200,
}

app.use(cors(corsOptions))
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
