export const errorList = {
  EMAIL_IN_USE: {
    status: 400,
    message: 'El correo electrónico ya está en uso',
    error: 'BadRequest',
  },
  EMAIL_NOT_FOUND: {
    status: 400,
    message: 'El correo electrónico no se encuentra registrado',
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
  COMMUNITY_NOT_FOUND: {
    status: 404,
    message: 'La comunidad no existe',
    error: 'NotFound',
  },
  NO_COMMUNITY_LEADERS_FOUND: {
    status: 404,
    message: 'No se encontraron líderes de comunidad',
    error: 'NotFound',
  },
  INVALID_DOCUMENT_TYPE: {
    status: 400,
    message: 'Tipo de documento inválido',
    error: 'BadRequest',
  },
  DUPLICATE_RECORD: {
    status: 409,
    message: 'El registro ya existe',
    error: 'DuplicateRecord',
  },
  INVALID_DOCUMENT_TYP: {
    status: 401,
    message: 'Documento invalido',
    error: 'InvalidDocument',
  },
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: 'Error interno del servidor',
    error: 'InternalServerError',
  },
  TOO_MANY_IMAGES: {
    status: 400,
    message: 'Solo se permiten hasta 3 imágenes por post.',
    error: 'BadRequest',
  },
  INVALID_DOCUMENT_TYPE: {
    status: 400,
    message: 'Tipo de documento inválido',
    error: 'BadRequest',
  },
  ERROR_PDF: {
    status: 400,
    message: 'Error al procesar el PDF',
    error: 'BadRequest',
  },
}
