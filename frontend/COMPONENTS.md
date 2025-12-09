# Component Documentation

## Overview
This document provides detailed information about all components in the Hive frontend application.

## UI Components

### Button Component

**Location**: `components/ui/Button.tsx`

**Purpose**: Versatile button component with multiple variants and sizes.

**Usage**:
```tsx
import { Button } from '@/components/ui/Button'

// Basic usage
<Button>Click me</Button>

// With variants
<Button variant="primary">Primary</Button>
<Button variant="success">Success</Button>
<Button variant="danger">Danger</Button>

// With loading state
<Button isLoading>Loading...</Button>

// Different sizes
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
```

**Props**:
- `variant`: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost'
- `size`: 'sm' | 'md' | 'lg'
- `isLoading`: boolean
- `disabled`: boolean
- Standard HTML button attributes

---

### Card Component

**Location**: `components/ui/Card.tsx`

**Purpose**: Container component for content sections with optional effects.

**Usage**:
```tsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'

<Card hover glass>
  <CardHeader>
    <CardTitle>My Card</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Card content goes here</p>
  </CardContent>
</Card>
```

**Props**:
- `hover`: boolean - Enable hover animation
- `glass`: boolean - Enable glassmorphism effect
- `className`: string - Additional CSS classes

---

### StatCard Component

**Location**: `components/ui/StatCard.tsx`

**Purpose**: Display statistics with optional trend indicators.

**Usage**:
```tsx
import { StatCard } from '@/components/ui/StatCard'
import { DollarSign } from 'lucide-react'

<StatCard
  label="Total Revenue"
  value="$125,450"
  change={12.5}
  changeLabel="vs last month"
  icon={<DollarSign className="w-6 h-6 text-primary-600" />}
/>
```

**Props**:
- `label`: string - The statistic label
- `value`: string | number - The main value
- `change`: number - Percentage change (optional)
- `changeLabel`: string - Custom label for change (optional)
- `icon`: React.ReactNode - Icon to display (optional)
- `trend`: 'up' | 'down' | 'neutral' (optional)

---

### Input Component

**Location**: `components/ui/Input.tsx`

**Purpose**: Styled text input with label and error support.

**Usage**:
```tsx
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'

<Input
  label="Email"
  type="email"
  placeholder="Enter your email"
  icon={<Search />}
  error="Invalid email address"
/>
```

**Props**:
- `label`: string - Input label
- `error`: string - Error message
- `icon`: React.ReactNode - Icon for input
- Standard HTML input attributes

---

### Badge Component

**Location**: `components/ui/Badge.tsx`

**Purpose**: Small label for status indicators.

**Usage**:
```tsx
import { Badge, SignalBadge } from '@/components/ui/Badge'

<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>

// Specialized for trading signals
<SignalBadge signal="BUY" confidence={0.85} />
```

**Props**:
- `variant`: 'default' | 'success' | 'danger' | 'warning' | 'info'
- `children`: React.ReactNode

**SignalBadge Props**:
- `signal`: 'BUY' | 'SELL' | 'HOLD'
- `confidence`: number (0-1)

---

### Loading Components

**Location**: `components/ui/Loading.tsx`

**Purpose**: Loading indicators and skeleton screens.

**Usage**:
```tsx
import { LoadingSpinner, LoadingSkeleton } from '@/components/ui/Loading'

// Spinner
<LoadingSpinner size="lg" />

// Skeleton
<LoadingSkeleton className="h-8 w-full" count={3} />
```

---

## Chart Components

### ConfidenceConeChart

**Location**: `components/charts/ConfidenceConeChart.tsx`

**Purpose**: Visualize AI predictions with confidence intervals (5th, 50th, 95th percentiles).

**Usage**:
```tsx
import { ConfidenceConeChart } from '@/components/charts/ConfidenceConeChart'

<ConfidenceConeChart
  ticker="AAPL"
  currentPrice={185.50}
  forecast={{
    dates: ['2024-05-21', '2024-05-22', '2024-05-23'],
    quantile_5: [184.00, 183.50, 182.00],
    quantile_50: [186.00, 187.00, 188.50],
    quantile_95: [188.00, 190.00, 192.00],
    forecast_volatility: 0.22
  }}
/>
```

**Features**:
- Bear scenario (5th percentile) in red
- Base scenario (50th percentile) in blue
- Bull scenario (95th percentile) in green
- Summary cards showing final predictions

---

### PriceChart

**Location**: `components/charts/PriceChart.tsx`

**Purpose**: Display historical price data.

**Usage**:
```tsx
import { PriceChart } from '@/components/charts/PriceChart'

<PriceChart
  ticker="AAPL"
  data={[
    { date: '2024-01-01', price: 180.00 },
    { date: '2024-01-02', price: 182.50 },
    // ...
  ]}
/>
```

---

## Feature Components

### AIReasoning

**Location**: `components/features/AIReasoning.tsx`

**Purpose**: Display AI agent reasoning with streaming text effect and confidence breakdown.

**Usage**:
```tsx
import { AIReasoning } from '@/components/features/AIReasoning'

<AIReasoning
  ticker="AAPL"
  inference={{
    signal: 'BUY',
    confidence: 0.85,
    confidence_breakdown: {
      model_confidence: 0.90,
      macro_confidence: 0.80,
      technical_confidence: 0.70,
      ensemble_agreement: 0.88
    },
    reasoning: "MS-DAN predicts a steady uptrend...",
    macro_factors_considered: ['Inflation: Low', 'Tech Sector: Bullish']
  }}
/>
```

**Features**:
- Streaming text effect for reasoning
- Confidence breakdown visualization
- Macro factors display
- Signal badge with confidence

---

## Layout Components

### Navigation

**Location**: `components/layout/Navigation.tsx`

**Purpose**: Main application navigation bar.

**Features**:
- Responsive design (desktop + mobile menu)
- Active route highlighting
- Search, notifications, settings icons
- Mobile hamburger menu

---

### Layout

**Location**: `components/layout/Layout.tsx`

**Purpose**: Wrapper component providing consistent layout across pages.

**Usage**:
```tsx
import { Layout } from '@/components/layout/Layout'

export default function MyPage() {
  return (
    <Layout>
      <h1>Page Content</h1>
    </Layout>
  )
}
```

---

## Utility Functions

**Location**: `lib/utils.ts`

### cn()
Merge Tailwind CSS classes intelligently.
```tsx
cn('px-4 py-2', isActive && 'bg-primary-500')
```

### formatCurrency()
Format numbers as currency.
```tsx
formatCurrency(12450.75) // "$12,450.75"
```

### formatPercentage()
Format numbers as percentages.
```tsx
formatPercentage(11.23) // "+11.23%"
```

### formatLargeNumber()
Format large numbers with abbreviations.
```tsx
formatLargeNumber(1250000) // "1.25M"
```

### getValueColor()
Get Tailwind color class based on positive/negative value.
```tsx
getValueColor(12.5) // "text-success-600"
getValueColor(-5.2) // "text-danger-600"
```

---

## TypeScript Types

**Location**: `types/index.ts`

All components are fully typed. Import types as needed:

```tsx
import type { AssetState, PortfolioHolding, MarketAsset } from '@/types'
```

See `types/index.ts` for complete type definitions matching the API contract.
