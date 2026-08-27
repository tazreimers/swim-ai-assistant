# @swim/ai

FastAPI AI service for the Swim AI coaching platform.

## Purpose

Standalone AI microservice providing workout generation, coaching recommendations, and analysis using large language models and domain-specific algorithms.

The `/insights` endpoint accepts normalized completed-session results and
returns structured session, coach, and athlete insights. Set `AI_MODE=mock`
for local development without an OpenAI key. Production deployments should
keep `OPENAI_API_KEY` server-side and use `AI_MODE=openai`.

## Tech Stack

- **Framework**: FastAPI
- **Server**: Uvicorn
- **Language**: Python 3.11+
- **ML/AI**: LangChain, OpenAI API (future)
- **API Integration**: httpx, aiohttp

## Getting Started

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py

# Or with uvicorn directly
uvicorn main:app --reload --port 8000
```

API runs on `http://localhost:8000` in development.

## Structure

- `main.py` - FastAPI app entry point
- `app/` - Application modules
  - `routers/` - API route handlers
  - `models/` - Pydantic models
  - `services/` - Business logic
  - `schemas/` - Request/response schemas
- `tests/` - Test suite

## Key Features (MVP)

- Health check endpoint
- Workout generation placeholder
- AI chat interface placeholder
- Session recommendations placeholder
- Integration with NestJS API

## Environment Variables

```bash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini
AI_MODE=mock
AI_SERVICE_TOKEN=
FRONTEND_URL=http://localhost:3000
LOG_LEVEL=info
ENVIRONMENT=development
API_URL=http://localhost:3001
```

## Development

### Run with auto-reload

```bash
uvicorn main:app --reload
```

### Interactive API docs

```
http://localhost:8000/docs (Swagger UI)
http://localhost:8000/redoc (ReDoc)
```

### Testing

```bash
# Run tests
pytest

# Run with coverage
pytest --cov=app

# Watch mode
pytest-watch
```

## API Endpoints

Core endpoints for AI functionality:

- `GET /health` - Service health check
- `GET /` - Service info
- `POST /workouts/generate` - Generate workout (placeholder)
- `POST /chat` - AI coaching chat (placeholder)
- `POST /sessions/recommend` - Get session recommendations (placeholder)

## Deployment

Containerized with Docker for consistent deployment:

```bash
docker build -t swim-ai:latest .
docker run -p 8000:8000 swim-ai:latest
```

Deploy as an independent managed container. Configure the environment
variables in `docs/production-operations.md`; do not put credentials in the
image or repository.

## Dependencies

See `requirements.txt` for full list. Key packages:

- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `httpx` / `aiohttp` - HTTP clients for API integration

## Notes

- All endpoints will be protected by API key or JWT in production
- AI features are placeholder stubs for Phase 3 implementation
- Integration tests with NestJS API coming in Phase 2
