"""
Health check endpoint
"""

from fastapi import APIRouter
from datetime import datetime
import os

from app.schemas import HealthResponse

router = APIRouter()


@router.get("", response_model=HealthResponse)
async def health_check():
    """
    Health check endpoint
    Returns service status and metadata
    """
    return HealthResponse(
        status="healthy",
        service="Hive AI Core",
        version="1.0.0",
        model_version=os.getenv("MODEL_VERSION", "ms-dan-v3.1"),
        timestamp=datetime.now().isoformat()
    )
