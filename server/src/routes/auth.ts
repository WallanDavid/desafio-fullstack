import { Router } from 'express'
import { dbGet, dbRun, lastInsertId } from '../db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { z } from 'zod'

const router = Router()

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
})

router.post('/register', (req, res) => {
  const parse = registerSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.format() })
  }
  const { username, email, password } = parse.data
  const existing = dbGet('SELECT id FROM users WHERE email = ?', [email])
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }
  const passwordHash = bcrypt.hashSync(password, 10)
  dbRun('INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)', [
    username,
    email,
    passwordHash
  ])
  const id = lastInsertId()
  return res.status(201).json({ id, username, email })
})

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

router.post('/login', (req, res) => {
  const parse = loginSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.format() })
  }
  const { email, password } = parse.data
  const user = dbGet('SELECT * FROM users WHERE email = ?', [email]) as
    | { id: number; username: string; email: string; password_hash: string }
    | undefined
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const ok = bcrypt.compareSync(password, user.password_hash)
  if (!ok) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }
  const secret = process.env.JWT_SECRET || 'dev-secret'
  const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' })
  return res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
})

export default router
