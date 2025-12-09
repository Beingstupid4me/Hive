"""
Pydantic models for API contracts
These match the Asset_State schema defined in the project Roadmap
"""

from pydantic import BaseModel, Field
from typing import List, Literal
from datetime import datetime


class MarketContext(BaseModel):
    """Market microstructure context"""
    volume: int = Field(description="Trading volume")
    volatility_regime: Literal["low", "medium", "high"] = Field(description="Current volatility regime")
    order_book_imbalance: float = Field(description="Order book imbalance ratio (-1 to 1)")
    spread: float = Field(description="Bid-ask spread")


class Forecast(BaseModel):
    """Probabilistic forecast with quantiles"""
    dates: List[str] = Field(description="Forecast dates")
    quantile_5: List[float] = Field(description="5th percentile price forecast")
    quantile_50: List[float] = Field(description="50th percentile (median) price forecast")
    quantile_95: List[float] = Field(description="95th percentile price forecast")
    forecast_volatility: float = Field(description="Expected volatility")


class ModelMetadata(BaseModel):
    """Metadata about the prediction model"""
    model_version: str = Field(description="Model version identifier")
    model_timestamp: str = Field(description="Prediction timestamp")
    data_freshness_sec: int = Field(description="Age of input data in seconds")
    drift_score: float = Field(description="Model drift detection score")


class ConfidenceBreakdown(BaseModel):
    """Breakdown of confidence components"""
    model_confidence: float = Field(ge=0, le=1, description="Model's internal confidence")
    macro_confidence: float = Field(ge=0, le=1, description="Macro factor confidence")
    technical_confidence: float = Field(ge=0, le=1, description="Technical indicator confidence")
    ensemble_agreement: float = Field(ge=0, le=1, description="Ensemble model agreement")


class AgentInference(BaseModel):
    """AI agent trading inference"""
    signal: Literal["BUY", "SELL", "HOLD"] = Field(description="Trading signal")
    confidence: float = Field(ge=0, le=1, description="Overall confidence")
    confidence_breakdown: ConfidenceBreakdown
    reasoning: str = Field(description="Natural language reasoning (Fin-R1)")
    macro_factors_considered: List[str] = Field(description="Macro factors analyzed")


class RiskContext(BaseModel):
    """Risk management context"""
    current_position: Literal["long", "short", "flat"] = Field(description="Current position")
    position_size: int = Field(description="Position size in units")
    max_position_allowed: float = Field(description="Maximum allowed position as fraction")
    stop_loss: float = Field(description="Stop loss price")
    take_profit: float = Field(description="Take profit price")
    risk_limit_hit: bool = Field(description="Whether risk limit has been hit")


class Events(BaseModel):
    """Market events and news context"""
    upcoming_events: List[str] = Field(description="Upcoming market events")
    news_sentiment_score: float = Field(ge=-1, le=1, description="News sentiment (-1 to 1)")
    news_sentiment_trend: Literal["rising", "falling", "stable"] = Field(description="Sentiment trend")


class AssetState(BaseModel):
    """
    Complete Asset State prediction response
    This is the main API contract between services
    """
    ticker: str = Field(description="Asset ticker symbol")
    date: str = Field(description="Prediction date")
    current_price: float = Field(description="Current market price")
    market_context: MarketContext
    forecast: Forecast
    model_metadata: ModelMetadata
    agent_inference: AgentInference
    risk_context: RiskContext
    events: Events

    class Config:
        json_schema_extra = {
            "example": {
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
                    "dates": ["2024-05-21", "2024-05-22", "2024-05-23"],
                    "quantile_5": [184.00, 183.50, 182.00],
                    "quantile_50": [186.00, 187.00, 188.50],
                    "quantile_95": [188.00, 190.00, 192.00],
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
                    "confidence_breakdown": {
                        "model_confidence": 0.90,
                        "macro_confidence": 0.80,
                        "technical_confidence": 0.70,
                        "ensemble_agreement": 0.88
                    },
                    "reasoning": "MS-DAN predicts upward momentum...",
                    "macro_factors_considered": ["Inflation: Low", "Tech Sector: Bullish"]
                },
                "risk_context": {
                    "current_position": "flat",
                    "position_size": 0,
                    "max_position_allowed": 0.15,
                    "stop_loss": 178.00,
                    "take_profit": 195.00,
                    "risk_limit_hit": False
                },
                "events": {
                    "upcoming_events": ["Earnings in 3 days"],
                    "news_sentiment_score": 0.62,
                    "news_sentiment_trend": "rising"
                }
            }
        }


class BatchPredictionRequest(BaseModel):
    """Request for batch predictions"""
    tickers: List[str] = Field(description="List of ticker symbols")


class BatchPredictionResponse(BaseModel):
    """Response for batch predictions"""
    predictions: List[AssetState]


class HealthResponse(BaseModel):
    """Health check response"""
    status: str
    service: str
    version: str
    model_version: str
    timestamp: str
