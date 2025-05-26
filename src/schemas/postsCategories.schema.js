import { z } from 'zod'

export const createPostCategorySchema = z.object({
  name: z.enum(['Project', 'Event', 'News', 'Announcement'], {
    required_error: 'El nombre de la categoría es requerido',
  }),
})
