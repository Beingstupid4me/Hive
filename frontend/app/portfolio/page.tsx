'use client'

import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { StatCard } from '@/components/ui/StatCard'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Wallet, TrendingUp, PieChart, DollarSign, Loader2 } from 'lucide-react'
import { formatCurrency, formatPercentage, getValueColor } from '@/lib/utils'
import { PieChart as RechartsPie, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { getPortfolio, type PortfolioSummary } from '@/lib/dataService'

const COLORS = ['#0ea5e9', '#22c55e', '#a855f7', '#f59e0b', '#ef4444']

export default function PortfolioPage() {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const data = await getPortfolio()
        setPortfolio(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio')
      } finally {
        setIsLoading(false)
      }
    }
    loadPortfolio()
  }, [])

  // Calculate sector allocation
  const sectorAllocation = portfolio?.holdings.reduce((acc, holding) => {
    const existing = acc.find(item => item.name === holding.sector)
    if (existing) {
      existing.value += holding.totalValue
    } else {
      acc.push({ name: holding.sector, value: holding.totalValue })
    }
    return acc
  }, [] as { name: string; value: number }[]) || []
  
  return (
    <Layout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-dark-900 mb-2">Portfolio</h1>
          <p className="text-dark-600">
            Track your holdings, performance, and exposure
          </p>
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

        {!isLoading && !error && portfolio && (
          <>
            {/* Portfolio Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                label="Total Value"
                value={formatCurrency(portfolio.totalValue)}
                icon={<Wallet className="w-6 h-6 text-primary-600" />}
              />
              <StatCard
                label="Total P&L"
                value={formatCurrency(portfolio.totalProfitLoss)}
                change={portfolio.totalProfitLossPercent}
                icon={<TrendingUp className="w-6 h-6 text-success-600" />}
              />
              <StatCard
                label="Cash Balance"
                value={formatCurrency(portfolio.cashBalance)}
                icon={<DollarSign className="w-6 h-6 text-primary-600" />}
              />
              <StatCard
                label="Holdings"
                value={portfolio.holdings.length.toString()}
                icon={<PieChart className="w-6 h-6 text-primary-600" />}
              />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Holdings Table */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Holdings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-dark-200">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-dark-700">Asset</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Quantity</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Avg Price</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Current</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">Total Value</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-dark-700">P&L</th>
                          </tr>
                        </thead>
                        <tbody>
                          {portfolio.holdings.map((holding) => (
                            <tr
                              key={holding.ticker}
                              className="border-b border-dark-100 hover:bg-dark-50 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <div>
                                  <div className="font-semibold text-dark-900">{holding.ticker}</div>
                                  <div className="text-sm text-dark-600">{holding.name}</div>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-right text-dark-700">
                                {holding.quantity}
                              </td>
                              <td className="py-3 px-4 text-right text-dark-700">
                                {formatCurrency(holding.avgPrice)}
                              </td>
                              <td className="py-3 px-4 text-right font-medium text-dark-900">
                                {formatCurrency(holding.currentPrice)}
                              </td>
                              <td className="py-3 px-4 text-right font-semibold text-dark-900">
                                {formatCurrency(holding.totalValue)}
                              </td>
                              <td className={`py-3 px-4 text-right font-medium ${getValueColor(holding.profitLoss)}`}>
                                <div>
                                  {formatCurrency(holding.profitLoss)}
                                </div>
                                <div className="text-xs">
                                  {formatPercentage(holding.profitLossPercent)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sector Allocation */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Sector Allocation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPie>
                        <Pie
                          data={sectorAllocation}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {sectorAllocation.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </RechartsPie>
                    </ResponsiveContainer>
                    
                    <div className="mt-4 space-y-2">
                      {sectorAllocation.map((sector, index) => (
                        <div key={sector.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-dark-700">{sector.name}</span>
                          </div>
                          <span className="font-medium text-dark-900">
                            {formatCurrency(sector.value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  )
}
