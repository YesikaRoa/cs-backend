import { z } from 'zod'

export const TestimoniesSchema = z.object({
  name: z.string().max(20),
  comment: z.string().max(150),
  community_id: z.number(),
})

export const TestimoniesUpdateSchema = TestimoniesSchema.partial()
