import React from 'react'
import { cn, getValueColor, formatPercentage } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  trend?: 'up' | 'down' | 'neutral'
  className?: string
}

/**
 * StatCard Component - Display a statistic with optional trend indicator
 * 
 * @param label - The label for the statistic
 * @param value - The main value to display
 * @param change - Percentage change value
 * @param changeLabel - Custom label for the change
 * @param icon - Optional icon to display
 * @param trend - Trend direction (up/down/neutral)
 */
export function StatCard({
  label,
  value,
  change,
  changeLabel,
  icon,
  trend,
  className,
}: StatCardProps) {
  const getTrendIcon = () => {
    if (change === undefined && !trend) return null
    
    const trendDirection = trend || (change && change > 0 ? 'up' : change && change < 0 ? 'down' : 'neutral')
    
    const iconClass = 'w-4 h-4'
    switch (trendDirection) {
      case 'up':
        return <TrendingUp className={iconClass} />
      case 'down':
        return <TrendingDown className={iconClass} />
      default:
        return <Minus className={iconClass} />
    }
  }
  
  return (
    <div className={cn('bg-white rounded-xl p-6 border border-dark-200 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-dark-500 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold text-dark-900">{value}</p>
          {change !== undefined && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm font-medium', getValueColor(change))}>
              {getTrendIcon()}
              <span>{formatPercentage(change)}</span>
              {changeLabel && <span className="text-dark-500 ml-1">{changeLabel}</span>}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0 p-3 bg-primary-50 rounded-lg">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
