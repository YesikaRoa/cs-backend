import express from 'express'
import dotenv from 'dotenv'
dotenv.config()

import './config/env.js'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import postRoutes from './routes/posts.routes.js'
import testimoniesRoutes from './routes/testimonies.routes.js'
import communityInfoRoutes from './routes/communityInfo.routes.js'
import userRoutes from './routes/users.routes.js'
import communityRoute from './routes/community.routes.js'
import postCategoryRoutes from './routes/postsCategories.routes.js'
import dashboardRouter from './routes/dashboard.routes.js'
import profileRoutes from './routes/profile.routes.js'

import { errorHandler } from './middlewares/errorHandler.js'
import { setupSwagger } from './docs/swagger.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/testimonies', testimoniesRoutes)
app.use('/api/community_information', communityInfoRoutes)
app.use('/api/users', userRoutes)
app.use('/api/communities', communityRoute)
app.use('/api/posts_categories', postCategoryRoutes)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/profile', profileRoutes)
app.use(errorHandler)

// Swagger docs
setupSwagger(app)

const PORT = process.env.PORT || 3002
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
