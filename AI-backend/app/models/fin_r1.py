"""
Fin-R1 Reasoning Simulator
Simulates the Fin-R1 LLM-based reasoning engine for generating
natural language trading signal explanations.

In production, this would interface with an actual LLM (e.g., GPT-4, Claude).
"""

import numpy as np
from typing import List, Tuple, Literal
from datetime import datetime

SignalType = Literal["BUY", "SELL", "HOLD"]


class FinR1Simulator:
    """
    Fin-R1 Reasoning Engine Simulator
    
    Generates trading signals and natural language reasoning
    based on market context and forecasts.
    """
    
    def __init__(self):
        # Signal generation thresholds
        self.buy_threshold = 0.02  # 2% expected return
        self.sell_threshold = -0.02  # -2% expected loss
        
        # Reasoning templates
        self.buy_templates = [
            "MS-DAN analysis for {ticker} indicates strong upward momentum with {conf}% confidence. "
            "Technical indicators show bullish divergence, with RSI trending up from oversold territory. "
            "The model's ensemble agreement is high at {ensemble}%, and macro conditions remain supportive. "
            "Key catalysts include {catalysts}.",
            
            "{ticker} shows a compelling bullish setup with {conf}% model confidence. "
            "Price action suggests accumulation phase completion, with volume confirming the move. "
            "The 5-day forecast projects {upside}% upside to the median estimate. "
            "Risk/reward ratio favors long positions given current stop levels.",
            
            "Quantitative signals for {ticker} are firmly bullish. MS-DAN projects continued strength "
            "with tight confidence bands indicating high conviction. Macro factors including "
            "{macro_factors} support the constructive outlook. Entry at current levels offers "
            "favorable positioning ahead of {event}."
        ]
        
        self.sell_templates = [
            "The model predicts near-term weakness for {ticker} with {conf}% confidence. "
            "Technical analysis shows bearish patterns forming, with potential resistance at current levels. "
            "Order flow data indicates institutional distribution. Consider reducing exposure ahead of {event}.",
            
            "{ticker} faces headwinds based on MS-DAN analysis. The model flags {conf}% probability "
            "of price decline over the forecast horizon. Volume patterns suggest selling pressure, "
            "and macro factors including {macro_factors} add to the cautious outlook.",
            
            "Quantitative models signal caution on {ticker}. The forecast cone skews negatively with "
            "{downside}% downside to the 5th percentile. Technical indicators confirm the weakening "
            "momentum, and sector rotation appears unfavorable. Risk management suggests position reduction."
        ]
        
        self.hold_templates = [
            "{ticker} shows mixed signals in the current environment. While long-term fundamentals "
            "remain intact, short-term volatility is expected with {vol}% forecast volatility. "
            "The model suggests maintaining current positions without adding new exposure. "
            "Key upcoming events: {event}.",
            
            "MS-DAN analysis for {ticker} is inconclusive at {conf}% confidence. "
            "The forecast cone is wide, reflecting uncertainty in near-term direction. "
            "Current market microstructure shows balanced order flow. "
            "Recommend holding existing positions and awaiting clearer signals.",
            
            "Neutral stance on {ticker} based on conflicting indicators. Price is trading within "
            "the expected range with no strong directional bias. Macro environment is stable, "
            "and technical indicators are mixed. Continue monitoring for breakout signals."
        ]
        
        # Macro factors pool
        self.macro_factors_pool = [
            "Inflation: Low",
            "Inflation: Moderate",
            "Inflation: Elevated",
            "Interest Rates: Accommodative",
            "Interest Rates: Restrictive",
            "USD Strength: Weak",
            "USD Strength: Strong",
            "GDP Growth: Positive",
            "Consumer Sentiment: Strong",
            "Consumer Sentiment: Weak",
            "Tech Sector: Bullish",
            "Tech Sector: Bearish",
            "Energy Sector: Bullish",
            "Financial Sector: Stable",
            "Credit Spreads: Tight",
            "VIX: Low",
            "VIX: Elevated",
            "Earnings Season: Positive",
            "Fed Policy: Dovish",
            "Fed Policy: Hawkish",
            "Market Sentiment: Risk-On",
            "Market Sentiment: Risk-Off",
        ]
        
        # Events pool
        self.events_pool = [
            "Earnings announcement",
            "Fed rate decision",
            "Options expiration",
            "Ex-dividend date",
            "Product launch",
            "Investor day",
            "Industry conference",
            "Regulatory filing deadline",
            "Economic data release",
            "Central bank meeting"
        ]
    
    def generate_signal(
        self, 
        ticker: str,
        current_price: float,
        q50_forecast: List[float]
    ) -> Tuple[SignalType, float]:
        """
        Generate trading signal based on forecast.
        
        Returns:
            signal: BUY, SELL, or HOLD
            confidence: 0-1 confidence score
        """
        # Calculate expected return
        if not q50_forecast:
            return "HOLD", 0.5
        
        expected_return = (q50_forecast[-1] - current_price) / current_price
        
        # Add some randomness to make it more realistic
        noise = np.random.normal(0, 0.01)
        expected_return += noise
        
        # Determine signal
        if expected_return > self.buy_threshold:
            signal = "BUY"
            base_conf = 0.7 + (expected_return - self.buy_threshold) * 5
        elif expected_return < self.sell_threshold:
            signal = "SELL"
            base_conf = 0.7 + abs(expected_return - self.sell_threshold) * 5
        else:
            signal = "HOLD"
            base_conf = 0.6 + np.random.uniform(0, 0.2)
        
        # Clamp confidence
        confidence = min(0.95, max(0.5, base_conf))
        
        return signal, round(confidence, 2)
    
    def generate_confidence_breakdown(self, base_confidence: float) -> dict:
        """Generate detailed confidence breakdown"""
        # Add variance around base confidence
        model_conf = min(1.0, base_confidence + np.random.uniform(-0.1, 0.15))
        macro_conf = min(1.0, base_confidence + np.random.uniform(-0.15, 0.1))
        tech_conf = min(1.0, base_confidence + np.random.uniform(-0.12, 0.12))
        ensemble = min(1.0, base_confidence + np.random.uniform(-0.05, 0.1))
        
        return {
            "model_confidence": round(model_conf, 2),
            "macro_confidence": round(macro_conf, 2),
            "technical_confidence": round(tech_conf, 2),
            "ensemble_agreement": round(ensemble, 2)
        }
    
    def generate_reasoning(
        self,
        ticker: str,
        signal: SignalType,
        confidence: float,
        forecast_vol: float,
        q5: List[float],
        q50: List[float],
        q95: List[float],
        current_price: float
    ) -> str:
        """Generate natural language reasoning for the signal"""
        
        # Calculate metrics for templates
        conf_pct = int(confidence * 100)
        ensemble_pct = int(np.random.uniform(0.75, 0.95) * 100)
        vol_pct = round(forecast_vol * 100, 1)
        
        if q50:
            upside = round((q95[-1] - current_price) / current_price * 100, 1)
            downside = round((q5[-1] - current_price) / current_price * 100, 1)
        else:
            upside = 5.0
            downside = -3.0
        
        # Select macro factors
        macro_factors = ", ".join(np.random.choice(self.macro_factors_pool, 3, replace=False))
        
        # Select event
        event = np.random.choice(self.events_pool)
        
        # Select and format template
        if signal == "BUY":
            template = np.random.choice(self.buy_templates)
            catalysts = "upcoming earnings and sector momentum"
        elif signal == "SELL":
            template = np.random.choice(self.sell_templates)
            catalysts = "technical breakdown and macro headwinds"
        else:
            template = np.random.choice(self.hold_templates)
            catalysts = "mixed signals and range-bound action"
        
        reasoning = template.format(
            ticker=ticker,
            conf=conf_pct,
            ensemble=ensemble_pct,
            vol=vol_pct,
            upside=upside,
            downside=abs(downside),
            macro_factors=macro_factors,
            event=event,
            catalysts=catalysts
        )
        
        return reasoning
    
    def select_macro_factors(self, signal: SignalType) -> List[str]:
        """Select relevant macro factors based on signal"""
        # Bias selection based on signal
        if signal == "BUY":
            positive_factors = [f for f in self.macro_factors_pool if 
                              any(x in f for x in ["Low", "Positive", "Bullish", "Strong", "Dovish", "Risk-On"])]
            selected = np.random.choice(positive_factors, min(3, len(positive_factors)), replace=False)
        elif signal == "SELL":
            negative_factors = [f for f in self.macro_factors_pool if 
                              any(x in f for x in ["High", "Elevated", "Bearish", "Weak", "Hawkish", "Risk-Off"])]
            selected = np.random.choice(negative_factors, min(3, len(negative_factors)), replace=False)
        else:
            selected = np.random.choice(self.macro_factors_pool, 4, replace=False)
        
        return list(selected)
    
    def generate_events(self, ticker: str) -> List[str]:
        """Generate upcoming events list"""
        num_events = np.random.randint(1, 4)
        base_events = list(np.random.choice(self.events_pool, num_events, replace=False))
        
        # Add ticker-specific event
        days = np.random.randint(3, 30)
        base_events.insert(0, f"{ticker} earnings in {days} days")
        
        return base_events[:3]


# Global simulator instance
fin_r1_simulator = FinR1Simulator()
