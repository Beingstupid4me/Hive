/**
 * Portfolio Router
 * Manages user portfolio data (mock for now, PostgreSQL SSM in future)
 */

import { Router, Request, Response } from 'express'

export const portfolioRouter = Router()

interface PortfolioHolding {
  ticker: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
  totalValue: number
  profitLoss: number
  profitLossPercent: number
  sector: string
}

interface PortfolioSummary {
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  cashBalance: number
  holdings: PortfolioHolding[]
}

// Mock portfolio data (will be replaced with PostgreSQL SSM)
let mockPortfolio: PortfolioSummary = {
  totalValue: 125750.50,
  totalProfitLoss: 8250.75,
  totalProfitLossPercent: 7.02,
  cashBalance: 15000.00,
  holdings: [
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      quantity: 100,
      avgPrice: 175.00,
      currentPrice: 185.50,
      totalValue: 18550.00,
      profitLoss: 1050.00,
      profitLossPercent: 6.00,
      sector: 'Technology',
    },
    {
      ticker: 'NVDA',
      name: 'NVIDIA Corp.',
      quantity: 25,
      avgPrice: 850.00,
      currentPrice: 945.00,
      totalValue: 23625.00,
      profitLoss: 2375.00,
      profitLossPercent: 11.18,
      sector: 'Technology',
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corp.',
      quantity: 50,
      avgPrice: 400.00,
      currentPrice: 425.50,
      totalValue: 21275.00,
      profitLoss: 1275.00,
      profitLossPercent: 6.38,
      sector: 'Technology',
    },
    {
      ticker: 'GOOGL',
      name: 'Alphabet Inc.',
      quantity: 150,
      avgPrice: 138.00,
      currentPrice: 142.80,
      totalValue: 21420.00,
      profitLoss: 720.00,
      profitLossPercent: 3.48,
      sector: 'Technology',
    },
    {
      ticker: 'TSLA',
      name: 'Tesla Inc.',
      quantity: 75,
      avgPrice: 195.00,
      currentPrice: 178.25,
      totalValue: 13368.75,
      profitLoss: -1256.25,
      profitLossPercent: -8.59,
      sector: 'Automotive',
    },
    {
      ticker: 'JPM',
      name: 'JPMorgan Chase & Co.',
      quantity: 60,
      avgPrice: 185.00,
      currentPrice: 198.75,
      totalValue: 11925.00,
      profitLoss: 825.00,
      profitLossPercent: 7.43,
      sector: 'Finance',
    },
  ],
}

/**
 * GET /api/portfolio
 * Returns user's portfolio summary
 */
portfolioRouter.get('/', (req: Request, res: Response) => {
  res.json(mockPortfolio)
})

/**
 * GET /api/portfolio/holdings
 * Returns just the holdings list
 */
portfolioRouter.get('/holdings', (req: Request, res: Response) => {
  res.json(mockPortfolio.holdings)
})

/**
 * POST /api/portfolio/holdings
 * Add a new holding to the portfolio
 */
portfolioRouter.post('/holdings', (req: Request, res: Response) => {
  const { ticker, quantity, avgPrice } = req.body
  
  if (!ticker || !quantity || !avgPrice) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      required: ['ticker', 'quantity', 'avgPrice']
    })
  }
  
  // Check if holding already exists
  const existingIndex = mockPortfolio.holdings.findIndex(h => h.ticker === ticker)
  
  const currentPrice = avgPrice * (1 + (Math.random() - 0.5) * 0.1) // Simulate price movement
  const totalValue = quantity * currentPrice
  const profitLoss = (currentPrice - avgPrice) * quantity
  const profitLossPercent = ((currentPrice - avgPrice) / avgPrice) * 100
  
  const newHolding: PortfolioHolding = {
    ticker: ticker.toUpperCase(),
    name: ticker.toUpperCase(), // Would normally lookup from market data
    quantity,
    avgPrice,
    currentPrice,
    totalValue,
    profitLoss,
    profitLossPercent,
    sector: 'Unknown'
  }
  
  if (existingIndex >= 0) {
    // Update existing holding (average the prices)
    const existing = mockPortfolio.holdings[existingIndex]
    const totalQty = existing.quantity + quantity
    const newAvgPrice = ((existing.avgPrice * existing.quantity) + (avgPrice * quantity)) / totalQty
    
    newHolding.quantity = totalQty
    newHolding.avgPrice = newAvgPrice
    newHolding.totalValue = totalQty * currentPrice
    newHolding.profitLoss = (currentPrice - newAvgPrice) * totalQty
    newHolding.profitLossPercent = ((currentPrice - newAvgPrice) / newAvgPrice) * 100
    newHolding.name = existing.name
    newHolding.sector = existing.sector
    
    mockPortfolio.holdings[existingIndex] = newHolding
  } else {
    mockPortfolio.holdings.push(newHolding)
  }
  
  // Recalculate portfolio totals
  recalculatePortfolioTotals()
  
  res.status(201).json(newHolding)
})

/**
 * DELETE /api/portfolio/holdings/:ticker
 * Remove a holding from the portfolio
 */
portfolioRouter.delete('/holdings/:ticker', (req: Request, res: Response) => {
  const { ticker } = req.params
  
  const index = mockPortfolio.holdings.findIndex(h => h.ticker === ticker.toUpperCase())
  
  if (index === -1) {
    return res.status(404).json({ error: `Holding ${ticker} not found` })
  }
  
  const removed = mockPortfolio.holdings.splice(index, 1)[0]
  recalculatePortfolioTotals()
  
  res.json({ message: `Removed ${ticker} from portfolio`, holding: removed })
})

/**
 * Recalculate portfolio totals
 */
function recalculatePortfolioTotals() {
  const totalValue = mockPortfolio.holdings.reduce((sum, h) => sum + h.totalValue, 0) + mockPortfolio.cashBalance
  const totalCost = mockPortfolio.holdings.reduce((sum, h) => sum + (h.avgPrice * h.quantity), 0)
  const totalProfitLoss = mockPortfolio.holdings.reduce((sum, h) => sum + h.profitLoss, 0)
  
  mockPortfolio.totalValue = totalValue
  mockPortfolio.totalProfitLoss = totalProfitLoss
  mockPortfolio.totalProfitLossPercent = totalCost > 0 ? (totalProfitLoss / totalCost) * 100 : 0
}
