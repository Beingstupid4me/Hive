'use client'

import React from 'react'
import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { formatCurrency } from '@/lib/utils'
import type { Forecast } from '@/types'

interface ConfidenceConeChartProps {
  ticker: string
  currentPrice: number
  forecast: Forecast
  className?: string
}

/**
 * ConfidenceConeChart - Visualizes AI prediction with confidence intervals
 * Shows the probabilistic "cone" with 5th, 50th, and 95th percentile predictions
 */
export function ConfidenceConeChart({
  ticker,
  currentPrice,
  forecast,
  className,
}: ConfidenceConeChartProps) {
  // Prepare data for the chart
  const chartData = forecast.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    bear: forecast.quantile_5[index],
    base: forecast.quantile_50[index],
    bull: forecast.quantile_95[index],
  }))
  
  // Add current price as the first data point
  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const fullData = [
    { date: today, bear: currentPrice, base: currentPrice, bull: currentPrice },
    ...chartData,
  ]
  
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI Forecast: {ticker}</CardTitle>
        <p className="text-sm text-dark-500 mt-1">
          Confidence cone showing possible outcomes (5th, 50th, 95th percentile)
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={fullData}>
            <defs>
              <linearGradient id="colorBull" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="colorBear" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis 
              dataKey="date" 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#64748b"
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              }}
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            
            {/* Bull scenario area (above base) */}
            <Area
              type="monotone"
              dataKey="bull"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorBull)"
              name="Bull (95th %)"
            />
            
            {/* Base scenario line */}
            <Line
              type="monotone"
              dataKey="base"
              stroke="#0ea5e9"
              strokeWidth={3}
              dot={{ r: 4 }}
              name="Base (50th %)"
            />
            
            {/* Bear scenario area (below base) */}
            <Area
              type="monotone"
              dataKey="bear"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorBear)"
              name="Bear (5th %)"
            />
          </AreaChart>
        </ResponsiveContainer>
        
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-danger-50 rounded-lg">
            <p className="text-xs text-danger-600 font-medium mb-1">Bear Case</p>
            <p className="text-lg font-bold text-danger-700">
              {formatCurrency(forecast.quantile_5[forecast.quantile_5.length - 1])}
            </p>
          </div>
          <div className="text-center p-3 bg-primary-50 rounded-lg">
            <p className="text-xs text-primary-600 font-medium mb-1">Base Case</p>
            <p className="text-lg font-bold text-primary-700">
              {formatCurrency(forecast.quantile_50[forecast.quantile_50.length - 1])}
            </p>
          </div>
          <div className="text-center p-3 bg-success-50 rounded-lg">
            <p className="text-xs text-success-600 font-medium mb-1">Bull Case</p>
            <p className="text-lg font-bold text-success-700">
              {formatCurrency(forecast.quantile_95[forecast.quantile_95.length - 1])}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
