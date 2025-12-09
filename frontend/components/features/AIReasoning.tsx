'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Brain, Zap, TrendingUp, AlertCircle } from 'lucide-react'
import type { AgentInference } from '@/types'

interface AIReasoningProps {
  inference: AgentInference
  ticker: string
  className?: string
}

/**
 * AIReasoning - Displays the AI Agent's reasoning with streaming effect
 * Shows the "Why" behind predictions with confidence breakdown
 */
export function AIReasoning({ inference, ticker, className }: AIReasoningProps) {
  const [displayedText, setDisplayedText] = useState('')
  const [isStreaming, setIsStreaming] = useState(true)
  
  // Simulate streaming effect
  useEffect(() => {
    setDisplayedText('')
    setIsStreaming(true)
    
    const text = inference.reasoning
    let currentIndex = 0
    
    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsStreaming(false)
        clearInterval(interval)
      }
    }, 20) // Adjust speed here
    
    return () => clearInterval(interval)
  }, [inference.reasoning])
  
  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary-600" />
            <CardTitle>AI Analysis: {ticker}</CardTitle>
          </div>
          <Badge variant={
            inference.signal === 'BUY' ? 'success' : 
            inference.signal === 'SELL' ? 'danger' : 
            'warning'
          }>
            {inference.signal} · {(inference.confidence * 100).toFixed(0)}% Confidence
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {/* Reasoning Text with Streaming Effect */}
        <div className="bg-dark-50 rounded-lg p-4 mb-4 min-h-[100px]">
          <p className="text-dark-700 leading-relaxed">
            {displayedText}
            {isStreaming && <span className="animate-pulse">|</span>}
          </p>
        </div>
        
        {/* Confidence Breakdown */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-dark-900 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Confidence Breakdown
          </h4>
          
          <ConfidenceBar
            label="Model Confidence"
            value={inference.confidence_breakdown.model_confidence}
          />
          <ConfidenceBar
            label="Technical Confidence"
            value={inference.confidence_breakdown.technical_confidence}
          />
          <ConfidenceBar
            label="Macro Confidence"
            value={inference.confidence_breakdown.macro_confidence}
          />
          <ConfidenceBar
            label="Ensemble Agreement"
            value={inference.confidence_breakdown.ensemble_agreement}
          />
        </div>
        
        {/* Macro Factors */}
        {inference.macro_factors_considered.length > 0 && (
          <div className="mt-4 pt-4 border-t border-dark-200">
            <h4 className="text-sm font-semibold text-dark-900 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Macro Factors Considered
            </h4>
            <div className="flex flex-wrap gap-2">
              {inference.macro_factors_considered.map((factor, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium"
                >
                  {factor}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ConfidenceBarProps {
  label: string
  value: number
}

function ConfidenceBar({ label, value }: ConfidenceBarProps) {
  const percentage = value * 100
  const color = 
    percentage >= 80 ? 'bg-success-500' :
    percentage >= 60 ? 'bg-primary-500' :
    percentage >= 40 ? 'bg-yellow-500' :
    'bg-danger-500'
  
  return (
    <div>
      <div className="flex justify-between text-xs text-dark-600 mb-1">
        <span>{label}</span>
        <span className="font-medium">{percentage.toFixed(0)}%</span>
      </div>
      <div className="w-full bg-dark-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${color} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
