import { z } from 'zod'

export const createUserSchema = z.object({
  first_name: z
    .string()
    .min(1, { message: 'El nombre es requerido' })
    .max(50, { message: 'El nombre no puede exceder 50 caracteres' }),
  last_name: z
    .string()
    .min(1, { message: 'El apellido es requerido' })
    .max(50, { message: 'El apellido no puede exceder 50 caracteres' }),
  cedula: z.string().max(20, 'La cédula no puede superar los 20 caracteres'),
  email: z.string().email({ message: 'El correo debe ser válido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  phone: z
    .string()
    .max(20, { message: 'El teléfono no puede exceder 20 caracteres' })
    .optional(),
  rol_id: z.coerce.number().int().positive({ message: 'El rol es requerido' }),
  community_id: z.coerce
    .number()
    .int()
    .positive({ message: 'La comunidad es requerida' }),
})

export const updateUserSchema = createUserSchema.partial()
