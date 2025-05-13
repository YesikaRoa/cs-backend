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
  email: z.string().email({ message: 'El correo debe ser válido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  phone: z
    .string()
    .max(20, { message: 'El teléfono no puede exceder 20 caracteres' })
    .optional(),
  rol_id: z
    .number()
    .int({ message: 'El rol debe ser un número entero' })
    .default(1),
  community_id: z
    .number()
    .int({ message: 'La comunidad debe ser un número entero' })
    .default(1),
  is_active: z.boolean().optional().default(true),
})

export const updateUserSchema = createUserSchema.partial()
