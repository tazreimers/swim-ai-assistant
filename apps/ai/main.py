"""
Swim AI - FastAPI AI Service
Provides AI-powered workout generation and coaching features.
"""

from fastapi import FastAPI, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import logging
import os
from app.insights import InsightRequest, InsightResponse, generate_insights

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI app
app = FastAPI(
    title="Swim AI API",
    description="AI service for workout generation and coaching insights",
    version="0.1.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "service": "swim-ai-api"}


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "Swim AI API",
        "version": "0.1.0",
        "description": "AI service for swimming coaching",
    }


@app.post("/insights", response_model=InsightResponse)
async def create_insights(
    request: InsightRequest,
    authorization: str | None = Header(default=None),
):
    """Generate schema-shaped session and athlete coaching insights."""
    service_token = os.getenv("AI_SERVICE_TOKEN")
    if service_token and authorization != f"Bearer {service_token}":
        raise HTTPException(status_code=401, detail="Invalid service token")
    try:
        return await generate_insights(request)
    except Exception as error:
        logger.exception("Insight generation failed")
        raise HTTPException(status_code=503, detail="Insight provider unavailable") from error


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
