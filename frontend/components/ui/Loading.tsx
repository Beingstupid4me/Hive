import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

/**
 * LoadingSpinner Component - Animated loading indicator
 */
export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }
  
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          'rounded-full border-primary-200 border-t-primary-600 animate-spin',
          sizes[size],
          className
        )}
      />
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  count?: number
}

/**
 * LoadingSkeleton - Placeholder for loading content
 */
export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-dark-200 rounded',
            className
          )}
        />
      ))}
    </>
  )
}
