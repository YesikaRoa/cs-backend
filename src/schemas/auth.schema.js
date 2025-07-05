import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  first_name: z.string().min(1, { message: 'El nombre es requerido' }),
  last_name: z.string().min(1, { message: 'El apellido es requerido' }),
  phone: z.string().optional(),
  rol_id: z.number().int(),
  community_id: z.number().int(),
})

export const loginSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
})

export const recoverPasswordSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
})
