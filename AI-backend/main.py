"""
Hive AI Core - FastAPI Server
Python service for AI predictions (Service C)

This service implements:
- MS-DAN Simulator: Probabilistic forecasting with confidence cones
- Fin-R1 Simulator: LLM-based reasoning engine for trade signals
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from app.routes import health, predict
from app.models.base_prices import load_base_prices

# Load environment variables
load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan manager"""
    # Startup
    print("🚀 Starting Hive AI Core Service...")
    load_base_prices()
    print("✅ Base prices loaded")
    yield
    # Shutdown
    print("👋 Shutting down AI Core Service...")

app = FastAPI(
    title="Hive AI Core",
    description="AI prediction service for portfolio management using MS-DAN and Fin-R1 simulators",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001", "http://localhost:3002"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(predict.router, prefix="/predict", tags=["Predictions"])

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Hive AI Core",
        "version": "1.0.0",
        "description": "AI prediction service with MS-DAN and Fin-R1 simulators",
        "endpoints": {
            "health": "/health",
            "predict": "/predict/{ticker}",
            "batch": "/predict/batch"
        }
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    debug = os.getenv("DEBUG", "true").lower() == "true"
    
    uvicorn.run("main:app", host=host, port=port, reload=debug)
