# Hive Backend - Node.js Orchestrator Service (Service B)

The backend orchestrator service for the Hive AI Portfolio SaaS. This service acts as the central hub, coordinating between the frontend and the AI Core service.

## Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │ ──▶ │   Backend   │ ──▶ │   AI Core   │
│   (Next.js) │     │  (Express)  │     │  (FastAPI)  │
│   Port 3001 │     │  Port 3002  │     │  Port 8000  │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │Yahoo Finance│
                    │    API      │
                    └─────────────┘
```

## Features

- **Market Data**: Real-time quotes from Yahoo Finance
- **Portfolio Management**: Track holdings, P&L, sector allocation
- **AI Predictions**: Orchestrates calls to Python AI Core
- **Fallback Simulation**: Generates simulated predictions when AI Core is unavailable

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## API Endpoints

### Health
- `GET /api/health` - Service health status

### Market Data
- `GET /api/market/assets` - All market assets
- `GET /api/market/assets/:ticker` - Single asset details
- `GET /api/market/quote/:ticker` - Detailed quote

### Portfolio
- `GET /api/portfolio` - Portfolio summary
- `GET /api/portfolio/holdings` - Holdings list
- `POST /api/portfolio/holdings` - Add holding
- `DELETE /api/portfolio/holdings/:ticker` - Remove holding

### Predictions
- `GET /api/predict/tickers` - Available tickers
- `GET /api/predict/:ticker` - AI prediction for ticker
- `POST /api/predict/batch` - Batch predictions

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3002 | Server port |
| NODE_ENV | development | Environment |
| AI_CORE_URL | http://localhost:8000 | AI Core service URL |
| CORS_ORIGIN | http://localhost:3001 | Allowed CORS origin |

## Project Structure

```
backend/
├── src/
│   ├── server.ts          # Express app entry point
│   └── routes/
│       ├── health.ts      # Health check endpoint
│       ├── market.ts      # Market data routes
│       ├── portfolio.ts   # Portfolio management
│       └── predict.ts     # AI prediction orchestration
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

## API Contract

The prediction endpoint returns an `Asset_State` object matching this schema:

```typescript
interface Asset_State {
  ticker: string
  date: string
  current_price: number
  market_context: {
    volume: number
    volatility_regime: 'low' | 'medium' | 'high'
    order_book_imbalance: number
    spread: number
  }
  forecast: {
    dates: string[]
    quantile_5: number[]
    quantile_50: number[]
    quantile_95: number[]
    forecast_volatility: number
  }
  model_metadata: {
    model_version: string
    model_timestamp: string
    data_freshness_sec: number
    drift_score: number
  }
  agent_inference: {
    signal: 'BUY' | 'SELL' | 'HOLD'
    confidence: number
    confidence_breakdown: {
      model_confidence: number
      macro_confidence: number
      technical_confidence: number
      ensemble_agreement: number
    }
    reasoning: string
    macro_factors_considered: string[]
  }
  risk_context: {
    current_position: 'long' | 'short' | 'flat'
    position_size: number
    max_position_allowed: number
    stop_loss: number
    take_profit: number
    risk_limit_hit: boolean
  }
  events: {
    upcoming_events: string[]
    news_sentiment_score: number
    news_sentiment_trend: 'rising' | 'falling' | 'stable'
  }
}
```

## Future Enhancements

- [ ] PostgreSQL SSM (Structured State Map) integration
- [ ] WebSocket for real-time updates
- [ ] User authentication
- [ ] Rate limiting
- [ ] Caching with Redis
