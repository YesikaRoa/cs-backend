import { z } from 'zod'

export const CommunityInfoSchema = z.object({
  title: z.string().min(1).max(20),
  value: z.string().min(1),
})

export const CommunityInfoUpdateSchema = CommunityInfoSchema.partial()
