import { Router } from 'express'
import { dbAll, dbGet, dbRun, lastInsertId } from '../db'
import { z } from 'zod'
import { authMiddleware } from '../middleware/auth'

const router = Router()

router.get('/', (req, res) => {
  const { q, minPrice, maxPrice } = req.query as Record<string, string | undefined>
  const clauses: string[] = []
  const params: unknown[] = []
  if (q) {
    clauses.push('(name LIKE ? OR description LIKE ?)')
    params.push(`%${q}%`, `%${q}%`)
  }
  if (minPrice) {
    clauses.push('price >= ?')
    params.push(Number(minPrice))
  }
  if (maxPrice) {
    clauses.push('price <= ?')
    params.push(Number(maxPrice))
  }
  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''
  const products = dbAll(`SELECT * FROM products ${where} ORDER BY created_at DESC`, params)
  return res.json(products)
})

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().min(0)
})

router.post('/', authMiddleware, async (req, res) => {
  const parse = createSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.format() })
  }
  const { name, description, price } = parse.data
  const userId = (req as any).user.id as number
  await dbRun(
    'INSERT INTO products (user_id, name, description, price, updated_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
    [userId, name, description ?? null, price]
  )
  const product = dbGet('SELECT * FROM products WHERE id = ?', [lastInsertId()])
  return res.status(201).json(product)
})

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().min(0).optional()
})

router.put('/:id', authMiddleware, async (req, res) => {
  const parse = updateSchema.safeParse(req.body)
  if (!parse.success) {
    return res.status(400).json({ message: 'Invalid data', errors: parse.error.format() })
  }
  const id = Number(req.params.id)
  const userId = (req as any).user.id as number
  const product = dbGet('SELECT * FROM products WHERE id = ?', [id]) as any
  if (!product) return res.status(404).json({ message: 'Not found' })
  if (product.user_id !== userId) return res.status(403).json({ message: 'Forbidden' })
  const fields: string[] = []
  const params: unknown[] = []
  if (parse.data.name !== undefined) {
    fields.push('name = ?')
    params.push(parse.data.name)
  }
  if (parse.data.description !== undefined) {
    fields.push('description = ?')
    params.push(parse.data.description)
  }
  if (parse.data.price !== undefined) {
    fields.push('price = ?')
    params.push(parse.data.price)
  }
  if (!fields.length) return res.status(400).json({ message: 'No fields to update' })
  params.push(id)
  await dbRun(`UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, params)
  const updated = dbGet('SELECT * FROM products WHERE id = ?', [id])
  return res.json(updated)
})

router.delete('/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id)
  const userId = (req as any).user.id as number
  const product = dbGet('SELECT * FROM products WHERE id = ?', [id]) as any
  if (!product) return res.status(404).json({ message: 'Not found' })
  if (product.user_id !== userId) return res.status(403).json({ message: 'Forbidden' })
  await dbRun('DELETE FROM products WHERE id = ?', [id])
  return res.status(204).send()
})

export default router
