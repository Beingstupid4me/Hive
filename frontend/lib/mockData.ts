/**
 * Mock Data Service
 * Provides realistic mock data for development while backend is being built
 * These match the API contract defined in the project Roadmap
 */

import type { AssetState } from '@/types'
import type { MarketAsset, PortfolioSummary, PortfolioHolding, HealthStatus } from './api'

// ==================== Helper Functions ====================

function generateForecastDates(startDate: Date, days: number): string[] {
  const dates: string[] = []
  for (let i = 1; i <= days; i++) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

function generatePriceArray(basePrice: number, days: number, drift: number, volatility: number): number[] {
  const prices: number[] = []
  let price = basePrice
  for (let i = 0; i < days; i++) {
    price = price * (1 + drift + (Math.random() - 0.5) * volatility)
    prices.push(parseFloat(price.toFixed(2)))
  }
  return prices
}

// ==================== Mock Market Assets ====================

export const mockMarketAssets: MarketAsset[] = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    price: 185.50,
    change: 2.35,
    changePercent: 1.28,
    volume: 72000000,
    marketCap: 2850000000000,
    sector: 'Technology',
    type: 'stock',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    price: 178.25,
    change: -3.50,
    changePercent: -1.93,
    volume: 95000000,
    marketCap: 567000000000,
    sector: 'Automotive',
    type: 'stock',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    price: 142.80,
    change: 1.20,
    changePercent: 0.85,
    volume: 28000000,
    marketCap: 1790000000000,
    sector: 'Technology',
    type: 'stock',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corp.',
    price: 425.50,
    change: 4.80,
    changePercent: 1.14,
    volume: 21000000,
    marketCap: 3160000000000,
    sector: 'Technology',
    type: 'stock',
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corp.',
    price: 945.00,
    change: 22.50,
    changePercent: 2.44,
    volume: 45000000,
    marketCap: 2330000000000,
    sector: 'Technology',
    type: 'stock',
  },
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    price: 67500.00,
    change: 1250.00,
    changePercent: 1.89,
    volume: 28000000000,
    marketCap: 1320000000000,
    sector: 'Crypto',
    type: 'crypto',
  },
  {
    ticker: 'ETH',
    name: 'Ethereum',
    price: 3450.00,
    change: -45.00,
    changePercent: -1.29,
    volume: 15000000000,
    marketCap: 415000000000,
    sector: 'Crypto',
    type: 'crypto',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    price: 182.50,
    change: 1.80,
    changePercent: 1.00,
    volume: 35000000,
    marketCap: 1890000000000,
    sector: 'Consumer',
    type: 'stock',
  },
  {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    price: 485.00,
    change: 8.50,
    changePercent: 1.78,
    volume: 18000000,
    marketCap: 1230000000000,
    sector: 'Technology',
    type: 'stock',
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    price: 198.75,
    change: -1.25,
    changePercent: -0.63,
    volume: 9000000,
    marketCap: 572000000000,
    sector: 'Finance',
    type: 'stock',
  },
]

// ==================== Mock Predictions ====================

const signals = ['BUY', 'SELL', 'HOLD'] as const
const volatilityRegimes = ['low', 'medium', 'high'] as const

export function generateMockPrediction(ticker: string): AssetState {
  const asset = mockMarketAssets.find(a => a.ticker === ticker) || {
    ticker,
    price: 100 + Math.random() * 400,
  }
  
  const basePrice = 'price' in asset ? asset.price : 150
  const today = new Date()
  const forecastDays = 5
  
  // Generate cone data
  const dates = generateForecastDates(today, forecastDays)
  const q50 = generatePriceArray(basePrice, forecastDays, 0.005, 0.02)
  const q5 = q50.map((p, i) => parseFloat((p * (0.97 - i * 0.005)).toFixed(2)))
  const q95 = q50.map((p, i) => parseFloat((p * (1.03 + i * 0.005)).toFixed(2)))
  
  const signal = signals[Math.floor(Math.random() * 3)]
  const confidence = 0.6 + Math.random() * 0.35
  
  return {
    ticker,
    date: today.toISOString().split('T')[0],
    current_price: basePrice,
    market_context: {
      volume: Math.floor(Math.random() * 100000000),
      volatility_regime: volatilityRegimes[Math.floor(Math.random() * 3)],
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
      model_version: 'ms-dan-v3.1',
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
        `${asset && 'sector' in asset ? asset.sector : 'Market'} Sector: ${Math.random() > 0.5 ? 'Bullish' : 'Neutral'}`,
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
      upcoming_events: generateUpcomingEvents(ticker),
      news_sentiment_score: 0.3 + Math.random() * 0.5,
      news_sentiment_trend: Math.random() > 0.5 ? 'rising' : 'falling',
    },
  }
}

function generateReasoning(ticker: string, signal: string, confidence: number): string {
  const reasonings = {
    BUY: `MS-DAN analysis for ${ticker} indicates strong upward momentum with ${(confidence * 100).toFixed(0)}% confidence. Technical indicators show bullish divergence, with RSI trending up from oversold territory. The model's ensemble agreement is high, and macro conditions remain supportive. Key catalysts include upcoming earnings and sector rotation into growth stocks.`,
    SELL: `The model predicts near-term weakness for ${ticker} with ${(confidence * 100).toFixed(0)}% confidence. Technical analysis shows bearish patterns forming, with potential resistance at current levels. Order flow data indicates institutional selling pressure. Consider reducing exposure ahead of upcoming macro events.`,
    HOLD: `${ticker} shows mixed signals in the current environment. While long-term fundamentals remain intact, short-term volatility is expected. The model suggests maintaining current positions without adding new exposure. Key upcoming events may provide clearer directional signals.`,
  }
  return reasonings[signal as keyof typeof reasonings] || reasonings.HOLD
}

function generateUpcomingEvents(ticker: string): string[] {
  const events = [
    `${ticker} Earnings in ${Math.floor(Math.random() * 30) + 1} days`,
    'Fed Rate Decision: Next Week',
    'Options Expiration: Friday',
    `${ticker} Investor Day: Upcoming`,
    'Sector Conference: Next Month',
  ]
  return events.slice(0, 2 + Math.floor(Math.random() * 2))
}

// ==================== Mock Portfolio ====================

export const mockPortfolio: PortfolioSummary = {
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

// ==================== Mock Health Status ====================

export const mockHealthStatus: HealthStatus = {
  status: 'healthy',
  services: {
    backend: 'connected',
    aiCore: 'connected',
    database: 'connected',
  },
}

// ==================== Available Tickers ====================

export const availableTickers = mockMarketAssets.map(a => a.ticker)
