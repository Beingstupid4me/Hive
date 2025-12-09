/**
 * Health Check Router
 */

import { Router, Request, Response } from 'express'
import axios from 'axios'

export const healthRouter = Router()

interface HealthStatus {
  status: string
  timestamp: string
  services: {
    backend: string
    aiCore: string
    database: string
  }
  uptime: number
}

healthRouter.get('/', async (req: Request, res: Response) => {
  const aiCoreUrl = process.env.AI_CORE_URL || 'http://localhost:8000'
  
  let aiCoreStatus = 'disconnected'
  try {
    const response = await axios.get(`${aiCoreUrl}/health`, { timeout: 2000 })
    aiCoreStatus = response.status === 200 ? 'connected' : 'error'
  } catch (error) {
    aiCoreStatus = 'disconnected'
  }
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      backend: 'connected',
      aiCore: aiCoreStatus,
      database: 'connected' // Placeholder for future PostgreSQL SSM
    },
    uptime: process.uptime()
  }
  
  res.json(health)
})
