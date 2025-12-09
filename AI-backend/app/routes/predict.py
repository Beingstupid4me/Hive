"""
Prediction endpoints
Orchestrates MS-DAN and Fin-R1 models to generate Asset_State predictions
"""

from fastapi import APIRouter, HTTPException
from datetime import datetime
from typing import List
import numpy as np

from app.schemas import (
    AssetState, 
    MarketContext, 
    Forecast, 
    ModelMetadata,
    AgentInference,
    ConfidenceBreakdown,
    RiskContext,
    Events,
    BatchPredictionRequest,
    BatchPredictionResponse
)
from app.models.base_prices import get_base_price, get_supported_tickers, is_ticker_supported
from app.models.ms_dan import ms_dan_simulator
from app.models.fin_r1 import fin_r1_simulator

router = APIRouter()


def generate_market_context(ticker: str, vol_regime: str) -> MarketContext:
    """Generate market microstructure context"""
    return MarketContext(
        volume=int(np.random.uniform(10_000_000, 100_000_000)),
        volatility_regime=vol_regime,
        order_book_imbalance=round(np.random.uniform(-0.3, 0.3), 3),
        spread=round(np.random.uniform(0.01, 0.1), 3)
    )


def generate_risk_context(ticker: str, current_price: float, signal: str) -> RiskContext:
    """Generate risk management context"""
    # Position based on signal
    if signal == "BUY":
        position = np.random.choice(["long", "flat"], p=[0.6, 0.4])
    elif signal == "SELL":
        position = np.random.choice(["short", "flat"], p=[0.3, 0.7])
    else:
        position = "flat"
    
    position_size = int(np.random.uniform(0, 100)) if position != "flat" else 0
    
    return RiskContext(
        current_position=position,
        position_size=position_size,
        max_position_allowed=round(np.random.uniform(0.1, 0.2), 2),
        stop_loss=round(current_price * 0.95, 2),
        take_profit=round(current_price * 1.08, 2),
        risk_limit_hit=np.random.random() < 0.05  # 5% chance
    )


def generate_events(ticker: str) -> Events:
    """Generate events context"""
    upcoming = fin_r1_simulator.generate_events(ticker)
    sentiment = round(np.random.uniform(-0.3, 0.8), 2)
    trend = np.random.choice(["rising", "falling", "stable"], p=[0.4, 0.3, 0.3])
    
    return Events(
        upcoming_events=upcoming,
        news_sentiment_score=sentiment,
        news_sentiment_trend=trend
    )


@router.get("/tickers", response_model=List[str])
async def get_available_tickers():
    """Get list of tickers with available predictions"""
    return get_supported_tickers()


@router.get("/{ticker}", response_model=AssetState)
async def get_prediction(ticker: str):
    """
    Generate AI prediction for a specific ticker
    
    This endpoint orchestrates:
    1. MS-DAN for probabilistic price forecasting
    2. Fin-R1 for signal generation and reasoning
    """
    ticker = ticker.upper()
    
    if not is_ticker_supported(ticker):
        raise HTTPException(
            status_code=400,
            detail={
                "error": "Invalid ticker",
                "message": f"Ticker {ticker} is not supported",
                "available_tickers": get_supported_tickers()
            }
        )
    
    # Get current price
    current_price = get_base_price(ticker)
    
    # Add small random variation to simulate real-time price
    price_variation = current_price * np.random.uniform(-0.005, 0.005)
    current_price = round(current_price + price_variation, 2)
    
    # Generate MS-DAN forecast
    dates, q5, q50, q95, forecast_vol = ms_dan_simulator.generate_forecast(ticker, current_price)
    vol_regime = ms_dan_simulator.get_volatility_regime(ticker)
    
    # Generate Fin-R1 signal and reasoning
    signal, confidence = fin_r1_simulator.generate_signal(ticker, current_price, q50)
    conf_breakdown = fin_r1_simulator.generate_confidence_breakdown(confidence)
    reasoning = fin_r1_simulator.generate_reasoning(
        ticker, signal, confidence, forecast_vol, q5, q50, q95, current_price
    )
    macro_factors = fin_r1_simulator.select_macro_factors(signal)
    
    # Build response
    return AssetState(
        ticker=ticker,
        date=datetime.now().strftime("%Y-%m-%d"),
        current_price=current_price,
        market_context=generate_market_context(ticker, vol_regime),
        forecast=Forecast(
            dates=dates,
            quantile_5=q5,
            quantile_50=q50,
            quantile_95=q95,
            forecast_volatility=forecast_vol
        ),
        model_metadata=ModelMetadata(**ms_dan_simulator.get_model_metadata()),
        agent_inference=AgentInference(
            signal=signal,
            confidence=confidence,
            confidence_breakdown=ConfidenceBreakdown(**conf_breakdown),
            reasoning=reasoning,
            macro_factors_considered=macro_factors
        ),
        risk_context=generate_risk_context(ticker, current_price, signal),
        events=generate_events(ticker)
    )


@router.post("/batch", response_model=BatchPredictionResponse)
async def get_batch_predictions(request: BatchPredictionRequest):
    """
    Generate predictions for multiple tickers
    """
    predictions = []
    
    for ticker in request.tickers:
        ticker = ticker.upper()
        if is_ticker_supported(ticker):
            try:
                prediction = await get_prediction(ticker)
                predictions.append(prediction)
            except Exception as e:
                print(f"Error generating prediction for {ticker}: {e}")
                continue
    
    return BatchPredictionResponse(predictions=predictions)
