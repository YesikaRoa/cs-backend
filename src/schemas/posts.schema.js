import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  content: z.string().min(1, { message: 'El contenido es requerido' }),
  category_id: z.number({ message: 'La categoría es requerida' }),
  community_id: z.number().optional(),
  status: z.enum(['draft', 'published', 'pending_approval']).optional(), // Hacer que sea opcional
})

export const updatePostSchema = createPostSchema.partial()
