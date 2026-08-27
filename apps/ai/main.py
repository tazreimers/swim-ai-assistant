"""
Swim AI - FastAPI AI Service
Provides AI-powered workout generation and coaching features.
"""

from datetime import datetime, timezone
import json
import logging
import os
from uuid import uuid4

from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

from app.insights import InsightRequest, InsightResponse, generate_insights

logging.basicConfig(level=os.getenv("LOG_LEVEL", "INFO").upper(), format="%(message)s")
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Swim AI API",
    description="AI service for workout generation and coaching insights",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def request_logging(request: Request, call_next):
    request_id = request.headers.get("x-request-id") or str(uuid4())
    started_at = datetime.now(timezone.utc)
    try:
        response = await call_next(request)
        error_code = (
            f"HTTP_{response.status_code // 100}XX"
            if response.status_code >= 400
            else None
        )
    except Exception:
        logger.error(
            _safe_log(
                request_id=request_id,
                route=request.url.path,
                status=500,
                duration_ms=_duration_ms(started_at),
                error_code="UNHANDLED_ERROR",
            )
        )
        raise

    response.headers["x-request-id"] = request_id
    logger.info(
        _safe_log(
            request_id=request_id,
            route=request.url.path,
            status=response.status_code,
            duration_ms=_duration_ms(started_at),
            error_code=error_code,
        )
    )
    return response


def _duration_ms(started_at: datetime) -> int:
    return round((datetime.now(timezone.utc) - started_at).total_seconds() * 1000)


def _safe_log(
    *,
    request_id: str,
    route: str,
    status: int,
    duration_ms: int,
    error_code: str | None,
) -> str:
    return json.dumps(
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "service": "ai",
            "request_id": request_id,
            "route": route,
            "status": status,
            "duration_ms": duration_ms,
            "error_code": error_code,
        }
    )


def _configuration_error() -> str | None:
    if os.getenv("ENVIRONMENT", "development") == "production" and not os.getenv(
        "AI_SERVICE_TOKEN"
    ):
        return "AI_SERVICE_TOKEN is not configured"
    if os.getenv("AI_MODE", "openai") != "mock" and not os.getenv("OPENAI_API_KEY"):
        return "OPENAI_API_KEY is not configured"
    return None


@app.get("/health")
async def health_check():
    """Return service readiness without exposing configuration or user data."""
    if _configuration_error():
        raise HTTPException(status_code=503, detail="AI service is not configured")
    return {"status": "ok", "service": "swim-ai-api"}


@app.get("/")
async def root():
    """Service information endpoint."""
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
    if service_token and authorization != "Bearer " + service_token:
        raise HTTPException(status_code=401, detail="Invalid service token")
    try:
        return await generate_insights(request)
    except Exception as error:
        logger.error(
            _safe_log(
                request_id="internal",
                route="/insights",
                status=503,
                duration_ms=0,
                error_code="AI_PROVIDER_UNAVAILABLE",
            )
        )
        raise HTTPException(status_code=503, detail="Insight provider unavailable") from error


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
