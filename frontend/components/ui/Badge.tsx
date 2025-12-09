import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info'
  className?: string
}

/**
 * Badge Component - Small label for status indicators
 * 
 * @param children - Badge content
 * @param variant - Color variant
 */
export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-dark-100 text-dark-800',
    success: 'bg-success-100 text-success-800',
    danger: 'bg-danger-100 text-danger-800',
    warning: 'bg-yellow-100 text-yellow-800',
    info: 'bg-primary-100 text-primary-800',
  }
  
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}

interface SignalBadgeProps {
  signal: 'BUY' | 'SELL' | 'HOLD'
  confidence?: number
}

/**
 * SignalBadge - Specialized badge for trading signals
 */
export function SignalBadge({ signal, confidence }: SignalBadgeProps) {
  const variants = {
    BUY: 'success' as const,
    SELL: 'danger' as const,
    HOLD: 'warning' as const,
  }
  
  return (
    <Badge variant={variants[signal]}>
      {signal}
      {confidence && ` (${(confidence * 100).toFixed(0)}%)`}
    </Badge>
  )
}
