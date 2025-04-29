import { z } from 'zod'

export const registerSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z
    .string()
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
})

export const loginSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
  password: z.string().min(1, { message: 'La contraseña es requerida' }),
})

export const recover_passwordSchema = z.object({
  email: z.string().email({ message: 'Correo inválido' }),
})
