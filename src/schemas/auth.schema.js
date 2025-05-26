import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  /* first_name: z.string().min(1, { message: 'El nombre es requerido' }),
  last_name: z.string().min(1, { message: 'El apellido es requerido' }),
  phone: z.string().min(1, { message: 'El teléfono es requerido' }).optional(),
  rol_id: z.number().int().optional(), // Se puede optar por enviar este campo o dejar el default del modelo
  community_id: z.number().int().optional(), */
})

export const loginSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
})
