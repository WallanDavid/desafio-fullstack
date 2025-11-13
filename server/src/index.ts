import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth'
import productRoutes from './routes/products'
import { initDb } from './db'

const app = express()
app.use(cors({ origin: '*', exposedHeaders: ['Authorization'] }))
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)

const port = process.env.PORT ? Number(process.env.PORT) : 4000
;(async () => {
  await initDb()
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`)
  })
})()
