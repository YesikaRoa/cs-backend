import jwt from 'jsonwebtoken'

export function optionalVerifyToken(req, res, next) {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decoded
    } catch (err) {
      // Token inválido: puedes decidir si fallas aquí o simplemente ignoras
      return res.status(401).json({ error: 'Invalid token' })
    }
  }

  next()
}
