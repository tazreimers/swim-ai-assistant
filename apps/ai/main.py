"""
Swim AI - FastAPI AI Service
Provides AI-powered workout generation and coaching features.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging

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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
