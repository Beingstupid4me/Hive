"""
Base price data for supported assets
"""

from typing import Dict

# Base prices for simulation
_BASE_PRICES: Dict[str, float] = {}


def load_base_prices():
    """Load base prices for supported tickers"""
    global _BASE_PRICES
    _BASE_PRICES = {
        "AAPL": 185.50,
        "MSFT": 425.50,
        "GOOGL": 142.80,
        "TSLA": 178.25,
        "NVDA": 945.00,
        "AMZN": 182.50,
        "META": 485.00,
        "JPM": 198.75,
        "BTC": 67500.00,
        "ETH": 3450.00,
    }


def get_base_price(ticker: str) -> float:
    """Get base price for a ticker"""
    return _BASE_PRICES.get(ticker.upper(), 100.0)


def get_supported_tickers() -> list:
    """Get list of supported tickers"""
    return list(_BASE_PRICES.keys())


def is_ticker_supported(ticker: str) -> bool:
    """Check if ticker is supported"""
    return ticker.upper() in _BASE_PRICES
