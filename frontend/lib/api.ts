/**
 * API Service Layer
 * Handles all communication with the Node.js backend (Service B)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3003'

/**
 * Generic fetch wrapper with error handling
 */
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }
    
    return response.json()
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Network error - please check your connection')
  }
}

// ==================== Market Data API ====================

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

/**
 * Fetch all market assets
 */
export async function fetchMarketAssets(params?: {
  type?: string
  search?: string
}): Promise<MarketAsset[]> {
  const queryParams = new URLSearchParams()
  if (params?.type) queryParams.append('type', params.type)
  if (params?.search) queryParams.append('search', params.search)
  
  const query = queryParams.toString()
  return fetchAPI<MarketAsset[]>(`/api/market/assets${query ? `?${query}` : ''}`)
}

/**
 * Fetch single asset details
 */
export async function fetchAssetDetails(ticker: string): Promise<MarketAsset> {
  return fetchAPI<MarketAsset>(`/api/market/assets/${ticker}`)
}

// ==================== Prediction API ====================

import type { AssetState } from '@/types'

/**
 * Fetch AI prediction for a ticker
 */
export async function fetchPrediction(ticker: string): Promise<AssetState> {
  return fetchAPI<AssetState>(`/api/predict/${ticker}`)
}

/**
 * Get available tickers with predictions
 */
export async function fetchAvailableTickers(): Promise<string[]> {
  return fetchAPI<string[]>('/api/predict/tickers')
}

// ==================== Portfolio API ====================

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
 * Fetch user's portfolio
 */
export async function fetchPortfolio(): Promise<PortfolioSummary> {
  return fetchAPI<PortfolioSummary>('/api/portfolio')
}

/**
 * Add holding to portfolio
 */
export async function addHolding(holding: {
  ticker: string
  quantity: number
  avgPrice: number
}): Promise<PortfolioHolding> {
  return fetchAPI<PortfolioHolding>('/api/portfolio/holdings', {
    method: 'POST',
    body: JSON.stringify(holding),
  })
}

// ==================== Health Check ====================

export interface HealthStatus {
  status: string
  services: {
    backend: string
    aiCore: string
    database: string
  }
}

/**
 * Check API health status
 */
export async function checkHealth(): Promise<HealthStatus> {
  return fetchAPI<HealthStatus>('/api/health')
}
