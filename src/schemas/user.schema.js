import { z } from 'zod'

export const userCreateSchema = z.object({
  first_name: z
    .string({
      required_error: 'El nombre es obligatorio',
      invalid_type_error: 'El nombre debe ser un texto',
    })
    .max(50, { message: 'El nombre debe tener máximo 50 caracteres' }),

  last_name: z
    .string({
      required_error: 'El apellido es obligatorio',
      invalid_type_error: 'El apellido debe ser un texto',
    })
    .max(50, { message: 'El apellido debe tener máximo 50 caracteres' }),

  email: z
    .string({
      required_error: 'El correo es obligatorio',
      invalid_type_error: 'El correo debe ser un texto',
    })
    .email({ message: 'El correo no tiene un formato válido' })
    .max(50, { message: 'El correo debe tener máximo 50 caracteres' }),

  password: z
    .string({
      required_error: 'La contraseña es obligatoria',
      invalid_type_error: 'La contraseña debe ser un texto',
    })
    .min(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    .max(64, { message: 'La contraseña puede tener máximo 64 caracteres' }),

  // Se utiliza cadena de texto para el teléfono, permitiendo formatos variados.
  phone: z
    .string({
      required_error: 'El teléfono es obligatorio',
      invalid_type_error: 'El teléfono debe ser un texto',
    })
    .max(20, { message: 'El teléfono debe tener máximo 20 caracteres' })
    .optional(),

  // Definimos el rol con un enum que incluye 'Admin', 'Community_Leader' y 'Street_Leader'
  rol: z.enum(['Admin', 'Community_Leader', 'Street_Leader'], {
    required_error: 'El rol es obligatorio',
    invalid_type_error:
      'El rol debe ser uno de los valores válidos: Admin, Community_Leader o Street_Leader',
  }),

  community_id: z.number({
    required_error: 'La comunidad es obligatoria',
    invalid_type_error: 'La comunidad debe ser un número',
  }),
})

export const userUpdateSchema = userCreateSchema.partial()
