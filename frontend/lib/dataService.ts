/**
 * Data Service
 * Abstracts data fetching - uses API when available, falls back to mock data
 */

import * as api from './api'
import * as mockData from './mockData'
import type { AssetState } from '@/types'

// Environment flag - set to true to use mock data during development
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || 
                      process.env.NODE_ENV === 'development'

/**
 * Wrapper that attempts API call and falls back to mock data on error
 */
async function withFallback<T>(
  apiCall: () => Promise<T>,
  mockFallback: () => T,
  logName: string
): Promise<T> {
  if (USE_MOCK_DATA) {
    console.log(`[DataService] Using mock data for: ${logName}`)
    return mockFallback()
  }
  
  try {
    return await apiCall()
  } catch (error) {
    console.warn(`[DataService] API call failed for ${logName}, using mock data:`, error)
    return mockFallback()
  }
}

// ==================== Market Data ====================

export async function getMarketAssets(params?: { type?: string; search?: string }): Promise<api.MarketAsset[]> {
  return withFallback(
    () => api.fetchMarketAssets(params),
    () => {
      let assets = mockData.mockMarketAssets
      if (params?.type && params.type !== 'all') {
        assets = assets.filter(a => a.type === params.type)
      }
      if (params?.search) {
        const search = params.search.toLowerCase()
        assets = assets.filter(a => 
          a.ticker.toLowerCase().includes(search) || 
          a.name.toLowerCase().includes(search)
        )
      }
      return assets
    },
    'getMarketAssets'
  )
}

export async function getAssetDetails(ticker: string): Promise<api.MarketAsset | null> {
  return withFallback(
    () => api.fetchAssetDetails(ticker),
    () => mockData.mockMarketAssets.find(a => a.ticker === ticker) || null,
    `getAssetDetails(${ticker})`
  )
}

// ==================== Predictions ====================

export async function getPrediction(ticker: string): Promise<AssetState> {
  return withFallback(
    () => api.fetchPrediction(ticker),
    () => mockData.generateMockPrediction(ticker),
    `getPrediction(${ticker})`
  )
}

export async function getAvailableTickers(): Promise<string[]> {
  return withFallback(
    () => api.fetchAvailableTickers(),
    () => mockData.availableTickers,
    'getAvailableTickers'
  )
}

// ==================== Portfolio ====================

export async function getPortfolio(): Promise<api.PortfolioSummary> {
  return withFallback(
    () => api.fetchPortfolio(),
    () => mockData.mockPortfolio,
    'getPortfolio'
  )
}

export async function addPortfolioHolding(holding: {
  ticker: string
  quantity: number
  avgPrice: number
}): Promise<api.PortfolioHolding | null> {
  if (USE_MOCK_DATA) {
    // In mock mode, create a mock holding response
    const asset = mockData.mockMarketAssets.find(a => a.ticker === holding.ticker)
    const currentPrice = asset?.price || holding.avgPrice
    return {
      ticker: holding.ticker,
      name: asset?.name || holding.ticker,
      quantity: holding.quantity,
      avgPrice: holding.avgPrice,
      currentPrice,
      totalValue: holding.quantity * currentPrice,
      profitLoss: (currentPrice - holding.avgPrice) * holding.quantity,
      profitLossPercent: ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100,
      sector: asset?.sector || 'Unknown',
    }
  }
  
  try {
    return await api.addHolding(holding)
  } catch (error) {
    console.error('[DataService] Failed to add holding:', error)
    return null
  }
}

// ==================== Health ====================

export async function checkApiHealth(): Promise<api.HealthStatus> {
  return withFallback(
    () => api.checkHealth(),
    () => mockData.mockHealthStatus,
    'checkApiHealth'
  )
}

// ==================== Export Types ====================

export type { MarketAsset, PortfolioSummary, PortfolioHolding, HealthStatus } from './api'
