'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ConfidenceConeChart } from '@/components/charts/ConfidenceConeChart'
import { AIReasoning } from '@/components/features/AIReasoning'
import { SignalBadge } from '@/components/ui/Badge'
import { Search, Sparkles, Loader2 } from 'lucide-react'
import type { AssetState } from '@/types'
import { getPrediction, getAvailableTickers } from '@/lib/dataService'

export default function PredictionsPage() {
  const [selectedTicker, setSelectedTicker] = useState('AAPL')
  const [prediction, setPrediction] = useState<AssetState | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableTickers, setAvailableTickers] = useState<string[]>([])

  // Load available tickers on mount
  useEffect(() => {
    getAvailableTickers().then(setAvailableTickers)
  }, [])

  // Fetch prediction function
  const fetchPrediction = useCallback(async (ticker: string) => {
    setIsLoading(true)
    setError(null)
    
    try {
      const data = await getPrediction(ticker)
      setPrediction(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prediction')
      setPrediction(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Load initial prediction
  useEffect(() => {
    fetchPrediction('AAPL')
  }, [fetchPrediction])

  const handleSearch = () => {
    if (selectedTicker.trim()) {
      fetchPrediction(selectedTicker.trim())
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2 flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-primary-600" />
            AI Predictions
          </h1>
          <p className="text-dark-600">
            Probabilistic forecasts powered by MS-DAN and Fin-R1 models
          </p>
        </div>
        
        {/* Search Section */}
        <Card glass>
          <CardContent>
            <div className="flex gap-3">
              <Input
                placeholder="Enter ticker (e.g., AAPL, TSLA, BTC)..."
                value={selectedTicker}
                onChange={(e) => setSelectedTicker(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                icon={<Search className="w-5 h-5" />}
              />
              <Button variant="primary" onClick={handleSearch} disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Sparkles className="w-5 h-5" />
                )}
                {isLoading ? 'Loading...' : 'Get Prediction'}
              </Button>
            </div>
            {availableTickers.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="text-sm text-dark-500">Quick select:</span>
                {availableTickers.slice(0, 6).map((ticker) => (
                  <button
                    key={ticker}
                    onClick={() => {
                      setSelectedTicker(ticker)
                      fetchPrediction(ticker)
                    }}
                    className="px-2 py-1 text-xs font-medium bg-dark-100 hover:bg-dark-200 
                             text-dark-700 rounded transition-colors"
                  >
                    {ticker}
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="border-danger-200 bg-danger-50">
            <CardContent>
              <p className="text-danger-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading && !prediction && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        )}
        
        {prediction && (
          <>
            {/* Key Insights Bar */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card hover>
                <CardContent className="text-center py-4">
                  <p className="text-sm text-dark-600 mb-1">Signal</p>
                  <div className="flex justify-center">
                    <SignalBadge signal={prediction.agent_inference.signal} />
                  </div>
                </CardContent>
              </Card>
              
              <Card hover>
                <CardContent className="text-center py-4">
                  <p className="text-sm text-dark-600 mb-1">Confidence</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {(prediction.agent_inference.confidence * 100).toFixed(0)}%
                  </p>
                </CardContent>
              </Card>
              
              <Card hover>
                <CardContent className="text-center py-4">
                  <p className="text-sm text-dark-600 mb-1">Volatility Regime</p>
                  <p className="text-2xl font-bold text-dark-900 capitalize">
                    {prediction.market_context.volatility_regime}
                  </p>
                </CardContent>
              </Card>
              
              <Card hover>
                <CardContent className="text-center py-4">
                  <p className="text-sm text-dark-600 mb-1">Model Version</p>
                  <p className="text-lg font-bold text-dark-900">
                    {prediction.model_metadata.model_version}
                  </p>
                </CardContent>
              </Card>
            </div>
            
            {/* Confidence Cone Chart */}
            <ConfidenceConeChart
              ticker={prediction.ticker}
              currentPrice={prediction.current_price}
              forecast={prediction.forecast}
            />
            
            {/* AI Reasoning */}
            <AIReasoning
              ticker={prediction.ticker}
              inference={prediction.agent_inference}
            />
            
            {/* Additional Context */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-600">Volume</span>
                      <span className="font-medium text-dark-900">
                        {(prediction.market_context.volume / 1000000).toFixed(1)}M
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">Order Book Imbalance</span>
                      <span className="font-medium text-dark-900">
                        {(prediction.market_context.order_book_imbalance * 100).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">Spread</span>
                      <span className="font-medium text-dark-900">
                        ${prediction.market_context.spread.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">Forecast Volatility</span>
                      <span className="font-medium text-dark-900">
                        {(prediction.forecast.forecast_volatility * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Risk Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-dark-600">Stop Loss</span>
                      <span className="font-medium text-danger-600">
                        ${prediction.risk_context.stop_loss.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">Take Profit</span>
                      <span className="font-medium text-success-600">
                        ${prediction.risk_context.take_profit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-dark-600">Max Position Allowed</span>
                      <span className="font-medium text-dark-900">
                        {(prediction.risk_context.max_position_allowed * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="pt-3 border-t border-dark-200">
                      <h5 className="text-sm font-semibold text-dark-900 mb-2">Upcoming Events</h5>
                      <div className="space-y-1">
                        {prediction.events.upcoming_events.map((event, index) => (
                          <div key={index} className="text-sm text-dark-700">
                            • {event}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
