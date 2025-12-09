'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { TrendingUp, Brain, Wallet, Sparkles, ArrowRight, BarChart3 } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-success-50">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center shadow-xl">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-dark-900 mb-4">
            Welcome to <span className="text-primary-600">Hive</span>
          </h1>
          <p className="text-xl text-dark-600 max-w-2xl mx-auto mb-8">
            AI-Powered Portfolio Intelligence. Visualize the future of your investments with 
            probabilistic predictions and confidence analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/marketplace">
              <Button variant="primary" size="lg">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/predictions">
              <Button variant="secondary" size="lg">
                View AI Predictions
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Three Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Link href="/marketplace">
            <Card hover glass className="h-full cursor-pointer group">
              <div className="p-8 text-center">
                <div className="w-16 h-16 gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-3">Marketplace</h3>
                <p className="text-dark-600">
                  Real-time market data for stocks, crypto, and indices. Your window to global markets.
                </p>
              </div>
            </Card>
          </Link>
          
          <Link href="/portfolio">
            <Card hover glass className="h-full cursor-pointer group">
              <div className="p-8 text-center">
                <div className="w-16 h-16 gradient-success rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Wallet className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-3">Portfolio</h3>
                <p className="text-dark-600">
                  Track your holdings, monitor performance, and visualize your exposure across sectors.
                </p>
              </div>
            </Card>
          </Link>
          
          <Link href="/predictions">
            <Card hover glass className="h-full cursor-pointer group">
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-dark-900 mb-3">AI Predictions</h3>
                <p className="text-dark-600">
                  Probabilistic forecasts with confidence cones. See what the future might hold.
                </p>
              </div>
            </Card>
          </Link>
        </div>
        
        {/* Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 animate-slide-up">
          <h2 className="text-3xl font-bold text-dark-900 mb-8 text-center">
            Powered by Advanced AI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-primary-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-900 mb-2">MS-DAN Model</h3>
                <p className="text-dark-600">
                  Statistical prediction engine generating probabilistic forecasts with confidence intervals.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-success-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-900 mb-2">Fin-R1 Agent</h3>
                <p className="text-dark-600">
                  AI reasoning engine that explains predictions and provides actionable insights.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-900 mb-2">Confidence Cones</h3>
                <p className="text-dark-600">
                  Visualize bull, base, and bear scenarios with 5th, 50th, and 95th percentile projections.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-dark-900 mb-2">Real-time Data</h3>
                <p className="text-dark-600">
                  Live market feeds and instant updates to keep your insights fresh and accurate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
