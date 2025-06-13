import { z } from 'zod'

export const createPostSchema = z.object({
  title: z.string().min(1, { message: 'El título es requerido' }),
  content: z.string().min(1, { message: 'El contenido es requerido' }),
  category_id: z.coerce.number({ message: 'La categoría es requerida' }),
})

export const updatePostSchema = createPostSchema.partial()

export const changePostStatusSchema = z.object({
  status: z.enum(['published', 'draft'], {
    errorMap: () => ({ message: "El status debe ser 'published' o 'draft'" }),
  }),
})
