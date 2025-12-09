'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Search, TrendingUp, TrendingDown, DollarSign, Loader2 } from 'lucide-react'
import { formatCurrency, formatLargeNumber, getValueColor } from '@/lib/utils'
import { getMarketAssets, type MarketAsset } from '@/lib/dataService'

export default function MarketplacePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [marketData, setMarketData] = useState<MarketAsset[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch market data on mount
  useEffect(() => {
    async function loadMarketData() {
      try {
        const data = await getMarketAssets()
        setMarketData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load market data')
      } finally {
        setIsLoading(false)
      }
    }
    loadMarketData()
  }, [])
  
  const filteredAssets = marketData.filter(asset =>
    asset.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  
  // Calculate market summary
  const gainers = marketData.filter(a => a.changePercent > 0).length
  const losers = marketData.filter(a => a.changePercent < 0).length
  const avgChange = marketData.length > 0 
    ? marketData.reduce((acc, a) => acc + a.changePercent, 0) / marketData.length
    : 0

  const handleRowClick = (ticker: string) => {
    router.push(`/predictions?ticker=${ticker}`)
  }
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Marketplace</h1>
          <p className="text-dark-600">
            Real-time market data for stocks, crypto, and indices
          </p>
        </div>
        
        {/* Market Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            label="Total Assets"
            value={marketData.length.toString()}
            icon={<DollarSign className="w-6 h-6 text-primary-600" />}
          />
          <StatCard
            label="Gainers"
            value={gainers.toString()}
            trend="up"
            icon={<TrendingUp className="w-6 h-6 text-success-600" />}
          />
          <StatCard
            label="Losers"
            value={losers.toString()}
            trend="down"
            icon={<TrendingDown className="w-6 h-6 text-danger-600" />}
          />
          <StatCard
            label="Avg Change"
            value={`${avgChange.toFixed(2)}%`}
            change={avgChange}
          />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-12 h-12 text-primary-600 animate-spin" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="border-danger-200 bg-danger-50">
            <CardContent>
              <p className="text-danger-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && (
          <>
            {/* Search Bar */}
            <Card>
              <CardContent>
                <Input
                  placeholder="Search assets (e.g., AAPL, Bitcoin)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </CardContent>
            </Card>
            
            {/* Assets Table */}
            <Card>
              <CardHeader>
                <CardTitle>All Assets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Symbol</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Name</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Price</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Change</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Volume</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Market Cap</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Type</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAssets.map((asset) => (
                        <tr
                          key={asset.ticker}
                          onClick={() => handleRowClick(asset.ticker)}
                          className="border-b border-dark-100 hover:bg-dark-50 transition-colors cursor-pointer"
                        >
                          <td className="py-3 px-4">
                            <span className="font-semibold text-dark-900">{asset.ticker}</span>
                          </td>
                          <td className="py-3 px-4 text-dark-700">{asset.name}</td>
                          <td className="py-3 px-4 text-right font-medium text-dark-900">
                            {formatCurrency(asset.price)}
                          </td>
                          <td className={`py-3 px-4 text-right font-medium ${getValueColor(asset.change)}`}>
                            <div className="flex items-center justify-end gap-1">
                              {asset.changePercent > 0 ? (
                                <TrendingUp className="w-4 h-4" />
                              ) : (
                                <TrendingDown className="w-4 h-4" />
                              )}
                              <span>
                                {asset.change >= 0 ? '+' : ''}
                                {asset.changePercent.toFixed(2)}%
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right text-dark-600">
                            {formatLargeNumber(asset.volume)}
                          </td>
                          <td className="py-3 px-4 text-right text-dark-600">
                            {formatLargeNumber(asset.marketCap)}
                          </td>
                          <td className="py-3 px-4">
                            <Badge variant={asset.type === 'crypto' ? 'warning' : 'info'}>
                              {asset.type}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </Layout>
  )
}
