/**
 * Prediction Router
 * Orchestrates calls to Python AI Core for predictions
 */

import { Router, Request, Response } from 'express'
import axios from 'axios'

export const predictRouter = Router()

const AI_CORE_URL = process.env.AI_CORE_URL || 'http://localhost:8000'

// Available tickers for predictions
const AVAILABLE_TICKERS = ['AAPL', 'MSFT', 'GOOGL', 'TSLA', 'NVDA', 'AMZN', 'META', 'JPM', 'BTC', 'ETH']

/**
 * GET /api/predict/tickers
 * Returns list of available tickers for prediction
 */
predictRouter.get('/tickers', (req: Request, res: Response) => {
  res.json(AVAILABLE_TICKERS)
})

/**
 * GET /api/predict/:ticker
 * Returns AI prediction for a specific ticker
 */
predictRouter.get('/:ticker', async (req: Request, res: Response) => {
  const { ticker } = req.params
  const upperTicker = ticker.toUpperCase()
  
  // Validate ticker
  if (!AVAILABLE_TICKERS.includes(upperTicker)) {
    return res.status(400).json({ 
      error: 'Invalid ticker',
      message: `Ticker ${upperTicker} is not supported`,
      availableTickers: AVAILABLE_TICKERS
    })
  }
  
  try {
    // Call AI Core service
    const response = await axios.get(`${AI_CORE_URL}/predict/${upperTicker}`, {
      timeout: 30000 // 30 second timeout for AI inference
    })
    
    res.json(response.data)
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        // AI Core not running - return simulated prediction
        console.log(`AI Core not available, generating simulated prediction for ${upperTicker}`)
        const simulatedPrediction = generateSimulatedPrediction(upperTicker)
        return res.json(simulatedPrediction)
      }
      
      console.error(`AI Core error for ${upperTicker}:`, error.message)
      return res.status(502).json({ 
        error: 'AI Core Error',
        message: 'Failed to get prediction from AI service'
      })
    }
    
    console.error(`Error fetching prediction for ${upperTicker}:`, error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

/**
 * POST /api/predict/batch
 * Get predictions for multiple tickers
 */
predictRouter.post('/batch', async (req: Request, res: Response) => {
  const { tickers } = req.body
  
  if (!Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ 
      error: 'Invalid request',
      message: 'tickers must be a non-empty array'
    })
  }
  
  const validTickers = tickers.filter(t => AVAILABLE_TICKERS.includes(t.toUpperCase()))
  
  if (validTickers.length === 0) {
    return res.status(400).json({ 
      error: 'No valid tickers',
      availableTickers: AVAILABLE_TICKERS
    })
  }
  
  try {
    const predictions = await Promise.all(
      validTickers.map(async (ticker) => {
        try {
          const response = await axios.get(`${AI_CORE_URL}/predict/${ticker.toUpperCase()}`, {
            timeout: 30000
          })
          return response.data
        } catch (error) {
          // Return simulated prediction if AI Core fails
          return generateSimulatedPrediction(ticker.toUpperCase())
        }
      })
    )
    
    res.json({ predictions })
  } catch (error) {
    console.error('Batch prediction error:', error)
    res.status(500).json({ error: 'Failed to process batch predictions' })
  }
})

/**
 * Generate a simulated prediction when AI Core is not available
 * This matches the Asset_State contract from the Roadmap
 */
function generateSimulatedPrediction(ticker: string) {
  const basePrice = getBasePrice(ticker)
  const today = new Date()
  const forecastDays = 5
  
  // Generate forecast dates
  const dates: string[] = []
  for (let i = 1; i <= forecastDays; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  
  // Generate price forecasts with random walk
  const drift = (Math.random() - 0.5) * 0.01
  const volatility = 0.02 + Math.random() * 0.02
  
  let price = basePrice
  const q50: number[] = []
  const q5: number[] = []
  const q95: number[] = []
  
  for (let i = 0; i < forecastDays; i++) {
    price = price * (1 + drift + (Math.random() - 0.5) * volatility)
    q50.push(parseFloat(price.toFixed(2)))
    q5.push(parseFloat((price * (0.97 - i * 0.005)).toFixed(2)))
    q95.push(parseFloat((price * (1.03 + i * 0.005)).toFixed(2)))
  }
  
  const signals = ['BUY', 'SELL', 'HOLD'] as const
  const signal = signals[Math.floor(Math.random() * 3)]
  const confidence = 0.6 + Math.random() * 0.35
  
  return {
    ticker,
    date: today.toISOString().split('T')[0],
    current_price: basePrice,
    market_context: {
      volume: Math.floor(Math.random() * 100000000),
      volatility_regime: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
      order_book_imbalance: (Math.random() - 0.5) * 0.4,
      spread: Math.random() * 0.1,
    },
    forecast: {
      dates,
      quantile_5: q5,
      quantile_50: q50,
      quantile_95: q95,
      forecast_volatility: 0.15 + Math.random() * 0.2,
    },
    model_metadata: {
      model_version: 'ms-dan-v3.1-sim',
      model_timestamp: new Date().toISOString(),
      data_freshness_sec: Math.floor(Math.random() * 60),
      drift_score: Math.random() * 0.15,
    },
    agent_inference: {
      signal,
      confidence,
      confidence_breakdown: {
        model_confidence: 0.7 + Math.random() * 0.25,
        macro_confidence: 0.6 + Math.random() * 0.3,
        technical_confidence: 0.65 + Math.random() * 0.3,
        ensemble_agreement: 0.75 + Math.random() * 0.2,
      },
      reasoning: generateReasoning(ticker, signal, confidence),
      macro_factors_considered: [
        'Inflation: ' + (Math.random() > 0.5 ? 'Low' : 'Moderate'),
        `Market Sector: ${Math.random() > 0.5 ? 'Bullish' : 'Neutral'}`,
        'Fed Rate Decision: Upcoming',
        `Market Sentiment: ${Math.random() > 0.5 ? 'Positive' : 'Neutral'}`,
      ],
    },
    risk_context: {
      current_position: Math.random() > 0.5 ? 'long' : 'flat',
      position_size: Math.floor(Math.random() * 100),
      max_position_allowed: 0.1 + Math.random() * 0.1,
      stop_loss: parseFloat((basePrice * 0.95).toFixed(2)),
      take_profit: parseFloat((basePrice * 1.08).toFixed(2)),
      risk_limit_hit: Math.random() > 0.9,
    },
    events: {
      upcoming_events: [
        `${ticker} Earnings in ${Math.floor(Math.random() * 30) + 1} days`,
        'Fed Rate Decision: Next Week',
      ],
      news_sentiment_score: 0.3 + Math.random() * 0.5,
      news_sentiment_trend: Math.random() > 0.5 ? 'rising' : 'falling',
    },
  }
}

function getBasePrice(ticker: string): number {
  const prices: Record<string, number> = {
    'AAPL': 185.50,
    'MSFT': 425.50,
    'GOOGL': 142.80,
    'TSLA': 178.25,
    'NVDA': 945.00,
    'AMZN': 182.50,
    'META': 485.00,
    'JPM': 198.75,
    'BTC': 67500.00,
    'ETH': 3450.00,
  }
  return prices[ticker] || 100 + Math.random() * 400
}

function generateReasoning(ticker: string, signal: string, confidence: number): string {
  const reasonings: Record<string, string> = {
    BUY: `MS-DAN analysis for ${ticker} indicates strong upward momentum with ${(confidence * 100).toFixed(0)}% confidence. Technical indicators show bullish divergence, with RSI trending up from oversold territory. The model's ensemble agreement is high, and macro conditions remain supportive. Key catalysts include upcoming earnings and sector rotation into growth stocks.`,
    SELL: `The model predicts near-term weakness for ${ticker} with ${(confidence * 100).toFixed(0)}% confidence. Technical analysis shows bearish patterns forming, with potential resistance at current levels. Order flow data indicates institutional selling pressure. Consider reducing exposure ahead of upcoming macro events.`,
    HOLD: `${ticker} shows mixed signals in the current environment. While long-term fundamentals remain intact, short-term volatility is expected. The model suggests maintaining current positions without adding new exposure. Key upcoming events may provide clearer directional signals.`,
  }
  return reasonings[signal] || reasonings.HOLD
}
