/**
 * Market Data Router
 * Fetches real market data from Yahoo Finance
 */

import { Router, Request, Response } from 'express'
import yahooFinance from 'yahoo-finance2'

export const marketRouter = Router()

// Supported tickers for the demo
const SUPPORTED_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN', 'META', 'JPM']
const CRYPTO_TICKERS = ['BTC-USD', 'ETH-USD']

interface MarketAsset {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  volume: number
  marketCap: number
  sector: string
  type: 'stock' | 'crypto' | 'index'
}

// Cache for market data (5 minute TTL)
let marketCache: { data: MarketAsset[], timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function fetchQuote(ticker: string): Promise<MarketAsset | null> {
  try {
    const quote = await yahooFinance.quote(ticker)
    
    if (!quote) return null
    
    const isCrypto = ticker.includes('-USD') || ticker === 'BTC' || ticker === 'ETH'
    const displayTicker = ticker.replace('-USD', '')
    
    // Type assertion to handle different quote types
    const quoteAny = quote as { sector?: string }
    
    return {
      ticker: displayTicker,
      name: quote.longName || quote.shortName || displayTicker,
      price: quote.regularMarketPrice || 0,
      change: quote.regularMarketChange || 0,
      changePercent: quote.regularMarketChangePercent || 0,
      volume: quote.regularMarketVolume || 0,
      marketCap: quote.marketCap || 0,
      sector: isCrypto ? 'Crypto' : (quoteAny.sector || 'Unknown'),
      type: isCrypto ? 'crypto' : 'stock'
    }
  } catch (error) {
    console.error(`Error fetching quote for ${ticker}:`, error)
    return null
  }
}

/**
 * GET /api/market/assets
 * Returns all market assets with current prices
 */
marketRouter.get('/assets', async (req: Request, res: Response) => {
  const { type, search } = req.query
  
  try {
    // Check cache
    const now = Date.now()
    if (marketCache && (now - marketCache.timestamp) < CACHE_TTL) {
      let assets = marketCache.data
      
      // Filter by type
      if (type && type !== 'all') {
        assets = assets.filter(a => a.type === type)
      }
      
      // Filter by search
      if (search && typeof search === 'string') {
        const searchLower = search.toLowerCase()
        assets = assets.filter(a => 
          a.ticker.toLowerCase().includes(searchLower) ||
          a.name.toLowerCase().includes(searchLower)
        )
      }
      
      return res.json(assets)
    }
    
    // Fetch fresh data
    const allTickers = [...SUPPORTED_TICKERS, ...CRYPTO_TICKERS]
    const quotes = await Promise.all(allTickers.map(fetchQuote))
    const assets = quotes.filter((q): q is MarketAsset => q !== null)
    
    // Update cache
    marketCache = { data: assets, timestamp: now }
    
    // Apply filters
    let filteredAssets = assets
    if (type && type !== 'all') {
      filteredAssets = filteredAssets.filter(a => a.type === type)
    }
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      filteredAssets = filteredAssets.filter(a => 
        a.ticker.toLowerCase().includes(searchLower) ||
        a.name.toLowerCase().includes(searchLower)
      )
    }
    
    res.json(filteredAssets)
  } catch (error) {
    console.error('Error fetching market assets:', error)
    res.status(500).json({ error: 'Failed to fetch market data' })
  }
})

/**
 * GET /api/market/assets/:ticker
 * Returns single asset details
 */
marketRouter.get('/assets/:ticker', async (req: Request, res: Response) => {
  const { ticker } = req.params
  
  try {
    // Check if it's a crypto ticker
    const tickerToFetch = ['BTC', 'ETH'].includes(ticker.toUpperCase()) 
      ? `${ticker.toUpperCase()}-USD` 
      : ticker.toUpperCase()
    
    const asset = await fetchQuote(tickerToFetch)
    
    if (!asset) {
      return res.status(404).json({ error: `Asset ${ticker} not found` })
    }
    
    res.json(asset)
  } catch (error) {
    console.error(`Error fetching asset ${ticker}:`, error)
    res.status(500).json({ error: `Failed to fetch asset ${ticker}` })
  }
})

/**
 * GET /api/market/quote/:ticker
 * Returns detailed quote for a single ticker
 */
marketRouter.get('/quote/:ticker', async (req: Request, res: Response) => {
  const { ticker } = req.params
  
  try {
    const tickerToFetch = ['BTC', 'ETH'].includes(ticker.toUpperCase()) 
      ? `${ticker.toUpperCase()}-USD` 
      : ticker.toUpperCase()
    
    const quote = await yahooFinance.quote(tickerToFetch)
    
    if (!quote) {
      return res.status(404).json({ error: `Quote for ${ticker} not found` })
    }
    
    res.json({
      ticker: ticker.toUpperCase(),
      price: quote.regularMarketPrice,
      previousClose: quote.regularMarketPreviousClose,
      open: quote.regularMarketOpen,
      high: quote.regularMarketDayHigh,
      low: quote.regularMarketDayLow,
      volume: quote.regularMarketVolume,
      marketCap: quote.marketCap,
      fiftyTwoWeekHigh: quote.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: quote.fiftyTwoWeekLow,
      averageVolume: quote.averageDailyVolume10Day
    })
  } catch (error) {
    console.error(`Error fetching quote ${ticker}:`, error)
    res.status(500).json({ error: `Failed to fetch quote for ${ticker}` })
  }
})
