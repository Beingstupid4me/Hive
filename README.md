# 🐝 Hive - AI-Powered Portfolio SaaS

An intelligent financial platform that focuses on what **will** happen, not just what has happened. Powered by MS-DAN probabilistic forecasting and Fin-R1 LLM reasoning.

![Architecture](https://img.shields.io/badge/Architecture-Tri--Service-blue)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2014-black)
![Backend](https://img.shields.io/badge/Backend-Express.js-green)
![AI Core](https://img.shields.io/badge/AI%20Core-FastAPI-teal)

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           USER BROWSER                                   │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     SERVICE A: FRONTEND                                  │
│                     Next.js 14 (Port 3001)                              │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────────────────────┐    │
│  │Marketplace│  │Portfolio│  │Predictions│  │ Confidence Cone Charts │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────────────────────┘    │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ REST API
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     SERVICE B: BACKEND ORCHESTRATOR                      │
│                     Express.js (Port 3002)                              │
│  ┌───────────┐  ┌──────────────┐  ┌────────────────┐  ┌─────────────┐  │
│  │Market Data│  │Portfolio Mgmt│  │Prediction Proxy│  │Yahoo Finance│  │
│  └───────────┘  └──────────────┘  └────────┬───────┘  └─────────────┘  │
└─────────────────────────────────────────────┼───────────────────────────┘
                                              │ REST API
                                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                     SERVICE C: AI CORE                                   │
│                     FastAPI (Port 8000)                                 │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────┐ │
│  │  MS-DAN Simulator        │  │  Fin-R1 Simulator                    │ │
│  │  (Probabilistic Forecast)│  │  (Signal + Reasoning Generation)    │ │
│  └──────────────────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

## 🎯 The Three Pillars

### Pillar 1: Marketplace (Objective Reality)
- Real-time market data for stocks, crypto, and indices
- Price, volume, and market cap information
- Searchable asset database

### Pillar 2: Portfolio (User Reality)  
- Portfolio tracking with P&L analysis
- Sector allocation visualization
- Holdings management

### Pillar 3: AI Predictions (Future Reality)
- **Confidence Cones**: Probabilistic 5-day forecasts (5th/50th/95th percentiles)
- **AI Reasoning**: Natural language explanation of predictions
- **Trading Signals**: BUY/SELL/HOLD with confidence scores

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.10+
- npm or yarn

### 1. Start AI Core (Service C)

```bash
cd AI-backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
# or: source venv/bin/activate  # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Start server
python main.py
```

Server runs on http://localhost:8000

### 2. Start Backend (Service B)

```bash
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

Server runs on http://localhost:3002

### 3. Start Frontend (Service A)

```bash
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

Server runs on http://localhost:3001

### 4. Open the App

Navigate to http://localhost:3001 in your browser.

## 📁 Project Structure

```
Hive/
├── frontend/                 # Service A - Next.js Frontend
│   ├── app/                  # App router pages
│   │   ├── page.tsx          # Home dashboard
│   │   ├── marketplace/      # Market data view
│   │   ├── portfolio/        # User portfolio
│   │   └── predictions/      # AI predictions
│   ├── components/           # React components
│   │   ├── ui/               # Base UI components
│   │   ├── charts/           # Chart components
│   │   ├── features/         # Feature components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and services
│   │   ├── api.ts            # API client
│   │   ├── dataService.ts    # Data abstraction layer
│   │   └── mockData.ts       # Mock data for development
│   └── types/                # TypeScript definitions
│
├── backend/                  # Service B - Express Backend
│   ├── src/
│   │   ├── server.ts         # Express entry point
│   │   └── routes/
│   │       ├── health.ts     # Health check
│   │       ├── market.ts     # Market data API
│   │       ├── portfolio.ts  # Portfolio API
│   │       └── predict.ts    # Prediction proxy
│   └── package.json
│
├── AI-backend/               # Service C - FastAPI AI Core
│   ├── main.py               # FastAPI entry point
│   ├── app/
│   │   ├── schemas.py        # Pydantic models
│   │   ├── models/
│   │   │   ├── ms_dan.py     # MS-DAN simulator
│   │   │   └── fin_r1.py     # Fin-R1 simulator
│   │   └── routes/
│   │       ├── health.py     # Health endpoint
│   │       └── predict.py    # Prediction endpoints
│   └── requirements.txt
│
└── Roadmap.md                # Product specification
```

## 🔌 API Endpoints

### Backend (Port 3002)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/market/assets` | All market assets |
| GET | `/api/market/assets/:ticker` | Single asset |
| GET | `/api/portfolio` | User portfolio |
| POST | `/api/portfolio/holdings` | Add holding |
| GET | `/api/predict/:ticker` | AI prediction |

### AI Core (Port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/predict/tickers` | Supported tickers |
| GET | `/predict/{ticker}` | Generate prediction |
| POST | `/predict/batch` | Batch predictions |

## 🧪 Development Modes

### Full Stack (All Services)
Start all three services for complete functionality with real AI predictions.

### Backend Only (No AI Core)
The backend automatically generates simulated predictions when AI Core is unavailable.

### Frontend Only (Mock Data)
Set `NEXT_PUBLIC_USE_MOCK_DATA=true` in frontend to use client-side mock data without any backend.

## 📊 Supported Assets

| Ticker | Name | Type | Volatility |
|--------|------|------|------------|
| AAPL | Apple Inc. | Stock | 25% |
| MSFT | Microsoft Corp. | Stock | 22% |
| GOOGL | Alphabet Inc. | Stock | 28% |
| TSLA | Tesla Inc. | Stock | 55% |
| NVDA | NVIDIA Corp. | Stock | 45% |
| AMZN | Amazon.com Inc. | Stock | 30% |
| META | Meta Platforms | Stock | 35% |
| JPM | JPMorgan Chase | Stock | 20% |
| BTC | Bitcoin | Crypto | 70% |
| ETH | Ethereum | Crypto | 80% |

## ✅ Current Status

- ✅ Complete frontend application with Three Pillars
- ✅ Confidence Cone visualization
- ✅ AI Reasoning component
- ✅ Node.js backend orchestrator
- ✅ Python AI Core with MS-DAN simulator
- ✅ Python AI Core with Fin-R1 simulator
- ✅ Yahoo Finance integration
- ✅ Mock data fallback system

## 🛣️ Roadmap

- [ ] PostgreSQL SSM integration
- [ ] Real-time WebSocket updates
- [ ] User authentication
- [ ] Production deployment
- [ ] Real MS-DAN model integration
- [ ] Real Fin-R1 LLM integration

## 📝 License

MIT License

---

**Built with ❤️ for the future of finance**
