/**
 * Hive Backend - Main Server Entry Point
 * Node.js/Express orchestrator (Service B)
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { marketRouter } from './routes/market.js'
import { portfolioRouter } from './routes/portfolio.js'
import { predictRouter } from './routes/predict.js'
import { healthRouter } from './routes/health.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}))
app.use(express.json())

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
  next()
})

// API Routes
app.use('/api/health', healthRouter)
app.use('/api/market', marketRouter)
app.use('/api/portfolio', portfolioRouter)
app.use('/api/predict', predictRouter)

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'Hive Backend API',
    version: '1.0.0',
    description: 'AI Portfolio Orchestrator Service',
    endpoints: {
      health: '/api/health',
      market: '/api/market/assets',
      portfolio: '/api/portfolio',
      predict: '/api/predict/:ticker'
    }
  })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Not Found',
    message: `Route ${req.path} not found`
  })
})

// Error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server Error:', err)
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🐝 Hive Backend Server                                  ║
║                                                           ║
║   Port: ${PORT}                                            ║
║   Environment: ${process.env.NODE_ENV || 'development'}                          ║
║   AI Core: ${process.env.AI_CORE_URL || 'http://localhost:8000'}                ║
║                                                           ║
║   Ready to serve requests!                                ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `)
})

export default app
