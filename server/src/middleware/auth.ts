import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthPayload {
  userId: number
}

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const auth = req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  const token = auth.slice('Bearer '.length)
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret'
    const payload = jwt.verify(token, secret) as AuthPayload
    ;(req as any).user = { id: payload.userId }
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

