/**
 * Asset State Interface - Matches the API Contract from the Roadmap
 */
export interface AssetState {
  ticker: string
  date: string
  current_price: number
  market_context: MarketContext
  forecast: Forecast
  model_metadata: ModelMetadata
  agent_inference: AgentInference
  risk_context: RiskContext
  events: Events
}

export interface MarketContext {
  volume: number
  volatility_regime: 'low' | 'medium' | 'high'
  order_book_imbalance: number
  spread: number
}

export interface Forecast {
  dates: string[]
  quantile_5: number[]
  quantile_50: number[]
  quantile_95: number[]
  forecast_volatility: number
}

export interface ModelMetadata {
  model_version: string
  model_timestamp: string
  data_freshness_sec: number
  drift_score: number
}

export interface AgentInference {
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence: number
  confidence_breakdown: {
    model_confidence: number
    macro_confidence: number
    technical_confidence: number
    ensemble_agreement: number
  }
  reasoning: string
  macro_factors_considered: string[]
}

export interface RiskContext {
  current_position: string
  position_size: number
  max_position_allowed: number
  stop_loss: number
  take_profit: number
  risk_limit_hit: boolean
}

export interface Events {
  upcoming_events: string[]
  news_sentiment_score: number
  news_sentiment_trend: 'rising' | 'falling' | 'stable'
}

/**
 * Portfolio Types
 */
export interface PortfolioHolding {
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

export interface PortfolioSummary {
  totalValue: number
  totalProfitLoss: number
  totalProfitLossPercent: number
  cashBalance: number
  holdings: PortfolioHolding[]
}

/**
 * Market Asset Types
 */
export interface MarketAsset {
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
