import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import chatRoutes from './routes/chat.js'
import parseRoutes from './routes/parse.js'
import poolRoutes from './routes/pools.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:5173'] }))
app.use(express.json({ limit: '50mb' }))

app.use('/api/chat', chatRoutes)
app.use('/api/parse', parseRoutes)
app.use('/api/pools', poolRoutes)

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'Runda API', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Runda API running on http://localhost:${PORT}`)
})
