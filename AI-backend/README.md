# Hive AI Core - Python AI Service (Service C)

AI prediction service for the Hive Portfolio SaaS platform. This service implements simulated versions of:

- **MS-DAN**: Multi-Scale Diffusion Attention Network for probabilistic price forecasting
- **Fin-R1**: LLM-based reasoning engine for generating trading signals and explanations

## Architecture

```
                    ┌─────────────────────────────┐
                    │        AI Core              │
                    │       (FastAPI)             │
                    │       Port 8000             │
                    ├─────────────────────────────┤
                    │                             │
┌─────────────┐     │  ┌───────────┐             │
│   Backend   │ ──▶ │  │  MS-DAN   │  Forecast   │
│  (Express)  │     │  │ Simulator │  Generator  │
│  Port 3002  │     │  └───────────┘             │
└─────────────┘     │                             │
                    │  ┌───────────┐             │
                    │  │  Fin-R1   │  Signal +   │
                    │  │ Simulator │  Reasoning  │
                    │  └───────────┘             │
                    │                             │
                    └─────────────────────────────┘
```

## Quick Start

### Using pip

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
python main.py
```

### Using Poetry

```bash
# Install dependencies
poetry install

# Run server
poetry run python main.py
```

## API Endpoints

### Health Check
- `GET /health` - Service health status

### Predictions
- `GET /predict/tickers` - List of supported tickers
- `GET /predict/{ticker}` - AI prediction for specific ticker
- `POST /predict/batch` - Batch predictions

## Response Format

The prediction endpoint returns an `AssetState` object:

```json
{
  "ticker": "AAPL",
  "date": "2024-05-20",
  "current_price": 185.50,
  "market_context": {
    "volume": 72000000,
    "volatility_regime": "medium",
    "order_book_imbalance": 0.12,
    "spread": 0.03
  },
  "forecast": {
    "dates": ["2024-05-21", "2024-05-22", ...],
    "quantile_5": [184.00, 183.50, ...],
    "quantile_50": [186.00, 187.00, ...],
    "quantile_95": [188.00, 190.00, ...],
    "forecast_volatility": 0.22
  },
  "model_metadata": {
    "model_version": "ms-dan-v3.1",
    "model_timestamp": "2024-05-20T14:30:00Z",
    "data_freshness_sec": 12,
    "drift_score": 0.08
  },
  "agent_inference": {
    "signal": "BUY",
    "confidence": 0.85,
    "confidence_breakdown": {...},
    "reasoning": "Natural language explanation...",
    "macro_factors_considered": [...]
  },
  "risk_context": {...},
  "events": {...}
}
```

## Project Structure

```
AI-backend/
├── main.py                 # FastAPI app entry point
├── requirements.txt        # Python dependencies
├── pyproject.toml          # Poetry config
├── .env                    # Environment variables
├── app/
│   ├── __init__.py
│   ├── schemas.py          # Pydantic models
│   ├── models/
│   │   ├── __init__.py
│   │   ├── base_prices.py  # Base price data
│   │   ├── ms_dan.py       # MS-DAN simulator
│   │   └── fin_r1.py       # Fin-R1 simulator
│   └── routes/
│       ├── __init__.py
│       ├── health.py       # Health endpoint
│       └── predict.py      # Prediction endpoints
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 8000 | Server port |
| HOST | 0.0.0.0 | Server host |
| DEBUG | true | Enable hot reload |
| MODEL_VERSION | ms-dan-v3.1 | Model version string |
| FORECAST_HORIZON_DAYS | 5 | Days to forecast |

## MS-DAN Simulator

The MS-DAN (Multi-Scale Diffusion Attention Network) simulator generates probabilistic price forecasts using Geometric Brownian Motion (GBM):

- **Drift**: Asset-specific expected daily return
- **Volatility**: Asset-specific annualized volatility
- **Quantiles**: 5th, 50th (median), and 95th percentile forecasts
- **Horizon**: Configurable forecast period (default 5 days)

### Volatility Parameters

| Asset | Annualized Volatility |
|-------|----------------------|
| AAPL | 25% |
| MSFT | 22% |
| NVDA | 45% |
| TSLA | 55% |
| BTC | 70% |
| ETH | 80% |

## Fin-R1 Simulator

The Fin-R1 reasoning engine simulates an LLM that generates:

- **Trading Signals**: BUY, SELL, or HOLD
- **Confidence Scores**: Overall and breakdown by factor
- **Natural Language Reasoning**: Explanation of the signal
- **Macro Factor Analysis**: Key factors considered

### Signal Generation Logic

```python
if expected_return > 2%:
    signal = "BUY"
elif expected_return < -2%:
    signal = "SELL"
else:
    signal = "HOLD"
```

## Future Enhancements

- [ ] Integration with actual MS-DAN model
- [ ] LLM integration for Fin-R1 (GPT-4, Claude)
- [ ] Real-time data feeds
- [ ] Model versioning and A/B testing
- [ ] Redis caching for predictions
- [ ] WebSocket streaming for live updates
