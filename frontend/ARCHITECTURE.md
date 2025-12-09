# Hive Frontend - Architecture & Sitemap

## Visual Sitemap

```
┌─────────────────────────────────────────────────────────────┐
│                         Home Page (/)                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Hero Section                                        │   │
│  │  • Welcome message                                   │   │
│  │  • CTA buttons                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Pillar 1    │  │  Pillar 2    │  │  Pillar 3    │     │
│  │  Marketplace │  │  Portfolio   │  │  Predictions │     │
│  │  [Card]      │  │  [Card]      │  │  [Card]      │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Features Section                                    │   │
│  │  • MS-DAN Model                                      │   │
│  │  • Fin-R1 Agent                                      │   │
│  │  • Confidence Cones                                  │   │
│  │  • Real-time Data                                    │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                │             │             │
                ▼             ▼             ▼
┌───────────────────┐ ┌───────────────┐ ┌──────────────────┐
│   Marketplace     │ │   Portfolio   │ │   Predictions    │
│  (/marketplace)   │ │  (/portfolio) │ │ (/predictions)   │
├───────────────────┤ ├───────────────┤ ├──────────────────┤
│ • Search Bar      │ │ • Stats Cards │ │ • Search Input   │
│ • Stats Cards (4) │ │ • Holdings    │ │ • Signal Badge   │
│ • Assets Table    │ │   Table       │ │ • Confidence     │
│   - Stocks        │ │ • Sector Pie  │ │   Cone Chart     │
│   - Crypto        │ │   Chart       │ │ • AI Reasoning   │
│   - Indices       │ │ • P&L Metrics │ │   Panel          │
│ • Filters         │ │               │ │ • Risk Context   │
└───────────────────┘ └───────────────┘ └──────────────────┘
```

---

## Component Hierarchy

```
App (root)
└── Layout
    ├── Navigation
    │   ├── Logo
    │   ├── Desktop Nav Links
    │   │   ├── Marketplace Link
    │   │   ├── Portfolio Link
    │   │   └── Predictions Link
    │   ├── Action Icons
    │   │   ├── Search Button
    │   │   ├── Notifications Button
    │   │   └── Settings Button
    │   └── Mobile Menu (hamburger)
    │
    └── Page Content
        │
        ├── Home Page
        │   ├── Hero Section
        │   ├── Pillar Cards (3)
        │   │   ├── Card (Marketplace)
        │   │   ├── Card (Portfolio)
        │   │   └── Card (Predictions)
        │   └── Features Grid
        │       └── Feature Items (4)
        │
        ├── Marketplace Page
        │   ├── Header
        │   ├── StatCard Grid (4)
        │   │   ├── Total Assets
        │   │   ├── Gainers
        │   │   ├── Losers
        │   │   └── Avg Change
        │   ├── Search Card
        │   │   └── Input (with icon)
        │   └── Assets Table Card
        │       └── Data Table
        │
        ├── Portfolio Page
        │   ├── Header
        │   ├── StatCard Grid (4)
        │   │   ├── Total Value
        │   │   ├── Total P&L
        │   │   ├── Cash Balance
        │   │   └── Holdings Count
        │   └── Content Grid
        │       ├── Holdings Table Card
        │       └── Sector Chart Card
        │           └── Pie Chart
        │
        └── Predictions Page
            ├── Header
            ├── Search Card
            │   ├── Input (ticker)
            │   └── Button (Get Prediction)
            ├── Insights Grid (4)
            │   ├── Signal Card
            │   ├── Confidence Card
            │   ├── Volatility Card
            │   └── Model Version Card
            ├── ConfidenceConeChart
            │   ├── Area Chart
            │   └── Summary Cards (3)
            ├── AIReasoning
            │   ├── Signal Badge
            │   ├── Reasoning Text
            │   ├── Confidence Breakdown
            │   └── Macro Factors
            └── Context Grid (2)
                ├── Market Context Card
                └── Risk Management Card
```

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User Interface                        │
│                   (React Components)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Props & State
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                  Page Components                         │
│    • Home.tsx                                           │
│    • Marketplace.tsx                                     │
│    • Portfolio.tsx                                       │
│    • Predictions.tsx                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ Data Requests
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 API Service Layer                        │
│                  (lib/api.ts)                           │
│    • fetchPrediction()                                  │
│    • fetchMarketAssets()                                │
│    • fetchPortfolio()                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     │ HTTP/WebSocket
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Backend Services (Future)                   │
│                                                          │
│    Service B (Node.js) ──────► Service C (Python)      │
│    • API Gateway                • MS-DAN Model         │
│    • User Management            • Fin-R1 Agent         │
│    • Data Aggregation                                   │
└─────────────────────────────────────────────────────────┘
```

---

## State Management

```
┌─────────────────────────────────────────────────────────┐
│                    Client State                          │
│                   (React Hooks)                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Component Level State (useState)                       │
│  ├── selectedTicker                                      │
│  ├── searchQuery                                         │
│  ├── loading                                             │
│  ├── error                                               │
│  └── data                                                │
│                                                          │
│  Effects (useEffect)                                     │
│  ├── Fetch data on mount                                │
│  ├── Streaming text animation                           │
│  └── WebSocket connections (future)                     │
│                                                          │
│  Future: Global State (Context/Redux)                   │
│  ├── User authentication                                │
│  ├── Theme preferences                                  │
│  └── App-wide settings                                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Styling Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Tailwind CSS                            │
│                 (Utility Classes)                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Global Styles (app/globals.css)                        │
│  ├── @tailwind base                                     │
│  ├── @tailwind components                               │
│  ├── @tailwind utilities                                │
│  └── Custom utilities                                   │
│      ├── .glass-effect                                  │
│      ├── .card-hover                                    │
│      ├── .gradient-primary                              │
│      └── .gradient-success                              │
│                                                          │
│  Theme Configuration (tailwind.config.ts)               │
│  ├── Colors                                             │
│  │   ├── primary (blue)                                 │
│  │   ├── success (green)                                │
│  │   ├── danger (red)                                   │
│  │   └── dark (gray scale)                              │
│  ├── Animations                                         │
│  │   ├── fade-in                                        │
│  │   ├── slide-up                                       │
│  │   └── pulse-slow                                     │
│  └── Breakpoints                                        │
│      ├── sm: 640px                                      │
│      ├── md: 768px                                      │
│      └── lg: 1024px                                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## File Organization Pattern

```
Feature-based Organization:

components/
├── ui/              ← Generic, reusable UI primitives
│   ├── Button       ← Used everywhere
│   ├── Card         ← Container primitive
│   ├── Input        ← Form primitive
│   └── ...
│
├── charts/          ← Data visualization specific
│   ├── ConfidenceConeChart
│   └── PriceChart
│
├── features/        ← Business logic components
│   └── AIReasoning  ← AI-specific feature
│
└── layout/          ← Layout/structure components
    ├── Navigation
    └── Layout

Colocation Pattern:

Each component file contains:
1. Imports
2. TypeScript interfaces
3. Main component
4. Sub-components (if private)
5. Export statements
```

---

## Routing Structure

```
Next.js App Router:

/                       → app/page.tsx
/marketplace            → app/marketplace/page.tsx
/portfolio              → app/portfolio/page.tsx
/predictions            → app/predictions/page.tsx

Future routes:
/auth/login            → app/auth/login/page.tsx
/settings              → app/settings/page.tsx
/asset/[ticker]        → app/asset/[ticker]/page.tsx
```

---

## TypeScript Type System

```
┌─────────────────────────────────────────────────────────┐
│                 types/index.ts                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Core Types (from API Contract)                         │
│  ├── AssetState                                         │
│  │   ├── MarketContext                                  │
│  │   ├── Forecast                                       │
│  │   ├── ModelMetadata                                  │
│  │   ├── AgentInference                                 │
│  │   ├── RiskContext                                    │
│  │   └── Events                                         │
│  │                                                       │
│  ├── PortfolioSummary                                   │
│  │   └── PortfolioHolding[]                             │
│  │                                                       │
│  └── MarketAsset                                        │
│                                                          │
│  Component Prop Types (inline)                          │
│  ├── ButtonProps                                        │
│  ├── CardProps                                          │
│  ├── ChartProps                                         │
│  └── ...                                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## Performance Optimization Strategy

```
Current:
✅ Component-based code splitting (automatic with Next.js)
✅ Optimized animations (CSS + Framer Motion)
✅ Responsive images ready

Future Optimizations:
□ Lazy loading for charts
  const Chart = dynamic(() => import('./Chart'))

□ Memoization for expensive renders
  const MemoChart = React.memo(Chart)

□ Virtual scrolling for long lists
  <VirtualList items={1000+} />

□ Image optimization
  <Image src="..." width={...} height={...} />

□ Route prefetching
  <Link prefetch href="..." />
```

---

## Deployment Pipeline

```
┌──────────────┐
│ Local Dev    │
│ npm run dev  │
└──────┬───────┘
       │
       ▼
┌──────────────┐
│ Git Commit   │
│ git push     │
└──────┬───────┘
       │
       ▼
┌──────────────────────┐
│ CI/CD Pipeline       │
│ • Run tests          │
│ • Type checking      │
│ • Build              │
│ • Deploy             │
└──────┬───────────────┘
       │
       ▼
┌──────────────────────┐
│ Production           │
│ • Vercel/Netlify     │
│ • Custom VPS         │
│ • Docker Container   │
└──────────────────────┘
```

---

## Security Considerations

```
✅ Implemented:
• No sensitive data in client
• Environment variables for config
• HTTPS ready (deployment)
• Input sanitization ready

🔄 To Implement:
• Authentication tokens
• API rate limiting
• CSRF protection
• XSS prevention
• Content Security Policy
```

---

## Accessibility Features

```
✅ Current:
• Semantic HTML elements
• Keyboard navigation
• Focus states on buttons
• Alt text ready for images
• Color contrast compliance

🔄 Future:
• ARIA labels
• Screen reader testing
• Skip to content links
• Focus trap for modals
• Reduced motion support
```

---

This architecture document provides a visual understanding of how all pieces fit together. Use it as a reference when navigating the codebase or explaining the project to others.
