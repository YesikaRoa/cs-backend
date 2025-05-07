const errorList = {
  EMAIL_IN_USE: {
    status: 400,
    message: 'El correo ya está en uso',
    error: 'BadRequest',
  },
  INVALID_CREDENTIALS: {
    status: 400,
    message: 'Credenciales inválidas',
    error: 'BadRequest',
  },
  INVALID_ID: {
    status: 400,
    message: 'El ID proporcionado no es válido',
    error: 'BadRequest',
  },
  UNAUTHORIZED: {
    status: 401,
    message: 'No autorizado',
    error: 'Unauthorized',
  },
  NO_TOKEN_PROVIDED: {
    status: 401,
    message: 'Token no proporcionado',
    error: 'Unauthorized',
  },
  INVALID_TOKEN: {
    status: 401,
    message: 'Token inválido',
    error: 'Unauthorized',
  },
  RECORD_NOT_FOUND: {
    status: 404,
    message: 'Registro no encontrado',
    error: 'NotFound',
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: 'Error interno del servidor',
    error: 'InternalServerError',
  },
}

export function createError(code) {
  const {
    status = 500,
    message = 'Error interno',
    error = 'InternalServerError',
  } = errorList[code] || {}
  const err = new Error(message)
  err.status = status
  err.name = error
  return err
}
