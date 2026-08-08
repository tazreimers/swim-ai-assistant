# Docker Setup

## Objective
Create production-ready Docker configuration for local development and deployment across all services.

## Scope (MVP Infrastructure)
- Multi-stage Dockerfile for Next.js frontend with optimized build
- Dockerfile for NestJS API with Node environment
- Dockerfile for FastAPI AI service with Python environment
- docker-compose.yml for local development orchestration
- Docker networking between services
- Environment configuration for local vs production

## Deliverables
- `apps/web/Dockerfile` - Next.js with multi-stage build (builder → runner)
- `apps/api/Dockerfile` - NestJS production-optimized Node image
- `apps/ai/Dockerfile` - Python 3.11+ FastAPI image
- `docker-compose.yml` in root with all services defined
- `.dockerignore` files in each app
- Environment templates (.env.example files)
- Network configuration so services can communicate

## Success Criteria
- `docker-compose up` starts all services locally
- Services can communicate with each other via container hostnames
- `localhost:3000` serves Next.js frontend
- `localhost:3001` serves NestJS API
- `localhost:8000` serves FastAPI service
- All services gracefully handle Docker SIGTERM
