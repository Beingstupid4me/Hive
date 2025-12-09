"""
MS-DAN Simulator
Simulates the MS-DAN (Multi-Scale Diffusion Attention Network) model
for probabilistic price forecasting with confidence cones.

In production, this would be replaced with the actual MS-DAN model.
"""

import numpy as np
from datetime import datetime, timedelta
from typing import Tuple, List
import os

from app.models.base_prices import get_base_price


class MSDanSimulator:
    """
    MS-DAN Price Forecasting Simulator
    
    Generates probabilistic forecasts using a random walk model with
    drift and volatility parameters calibrated per asset class.
    """
    
    def __init__(self):
        self.model_version = os.getenv("MODEL_VERSION", "ms-dan-v3.1")
        self.forecast_horizon = int(os.getenv("FORECAST_HORIZON_DAYS", 5))
        
        # Asset-specific volatility parameters (annualized)
        self.volatility_params = {
            "AAPL": 0.25,
            "MSFT": 0.22,
            "GOOGL": 0.28,
            "TSLA": 0.55,
            "NVDA": 0.45,
            "AMZN": 0.30,
            "META": 0.35,
            "JPM": 0.20,
            "BTC": 0.70,
            "ETH": 0.80,
        }
        
        # Drift parameters (daily expected return)
        self.drift_params = {
            "AAPL": 0.0005,
            "MSFT": 0.0004,
            "GOOGL": 0.0003,
            "TSLA": 0.0002,
            "NVDA": 0.0006,
            "AMZN": 0.0003,
            "META": 0.0004,
            "JPM": 0.0002,
            "BTC": 0.0008,
            "ETH": 0.0007,
        }
    
    def get_volatility(self, ticker: str) -> float:
        """Get annualized volatility for ticker"""
        return self.volatility_params.get(ticker.upper(), 0.30)
    
    def get_drift(self, ticker: str) -> float:
        """Get daily drift for ticker"""
        return self.drift_params.get(ticker.upper(), 0.0003)
    
    def generate_forecast(
        self, 
        ticker: str, 
        current_price: float = None
    ) -> Tuple[List[str], List[float], List[float], List[float], float]:
        """
        Generate probabilistic forecast using Geometric Brownian Motion.
        
        Returns:
            dates: List of forecast dates
            q5: 5th percentile forecast
            q50: 50th percentile (median) forecast
            q95: 95th percentile forecast
            forecast_volatility: Expected volatility
        """
        if current_price is None:
            current_price = get_base_price(ticker)
        
        # Get parameters
        sigma = self.get_volatility(ticker)
        mu = self.get_drift(ticker)
        
        # Convert to daily
        daily_sigma = sigma / np.sqrt(252)
        
        # Generate dates
        today = datetime.now()
        dates = []
        for i in range(1, self.forecast_horizon + 1):
            date = today + timedelta(days=i)
            dates.append(date.strftime("%Y-%m-%d"))
        
        # Generate quantile forecasts using GBM
        q5 = []
        q50 = []
        q95 = []
        
        for t in range(1, self.forecast_horizon + 1):
            # GBM expected value and variance
            sqrt_t = np.sqrt(t)
            
            # Log returns are normally distributed
            log_mean = np.log(current_price) + (mu - 0.5 * daily_sigma**2) * t
            log_std = daily_sigma * sqrt_t
            
            # Calculate quantiles in log space, then transform
            q5_val = np.exp(log_mean + log_std * (-1.645))  # 5th percentile
            q50_val = np.exp(log_mean)  # Median
            q95_val = np.exp(log_mean + log_std * 1.645)  # 95th percentile
            
            q5.append(round(q5_val, 2))
            q50.append(round(q50_val, 2))
            q95.append(round(q95_val, 2))
        
        # Forecast volatility is the expected volatility over the horizon
        forecast_vol = daily_sigma * np.sqrt(self.forecast_horizon)
        
        return dates, q5, q50, q95, round(forecast_vol, 4)
    
    def get_volatility_regime(self, ticker: str) -> str:
        """Determine volatility regime based on asset characteristics"""
        vol = self.get_volatility(ticker)
        
        if vol < 0.25:
            return "low"
        elif vol < 0.45:
            return "medium"
        else:
            return "high"
    
    def get_model_metadata(self) -> dict:
        """Get model metadata"""
        return {
            "model_version": self.model_version,
            "model_timestamp": datetime.now().isoformat(),
            "data_freshness_sec": np.random.randint(5, 60),
            "drift_score": round(np.random.uniform(0.01, 0.15), 3)
        }


# Global simulator instance
ms_dan_simulator = MSDanSimulator()
