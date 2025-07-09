import { z } from 'zod'

export const TestimoniesSchema = z.object({
  name: z.string().max(20),
  comment: z.string().max(150),
  community_id: z
    .number()
    .int()
    .positive({ message: 'La comunidad es requerida' }),
})

export const TestimoniesUpdateSchema = TestimoniesSchema.partial()

export const ChangeTestimonyStatusSchema = z.object({
  status: z.enum(['published', 'draft'], {
    errorMap: () => ({ message: "El status debe ser 'published' o 'draft'" }),
  }),
})
