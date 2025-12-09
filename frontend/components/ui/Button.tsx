import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  isLoading?: boolean
}

/**
 * Button Component - Customizable button with variants and sizes
 * 
 * @param variant - Visual style of the button
 * @param size - Size of the button
 * @param children - Button content
 * @param isLoading - Show loading state
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  isLoading = false,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'gradient-primary text-white hover:shadow-lg hover:scale-105 active:scale-100',
    secondary: 'bg-dark-100 text-dark-900 hover:bg-dark-200 border border-dark-300',
    success: 'gradient-success text-white hover:shadow-lg hover:scale-105',
    danger: 'gradient-danger text-white hover:shadow-lg hover:scale-105',
    ghost: 'text-dark-700 hover:bg-dark-100',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  )
}
