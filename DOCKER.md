# Docker Setup Guide

This guide explains the Docker configuration for local development and production deployment.

## Overview

The Swim AI project uses Docker for containerizing all three services:
- **Web** (Next.js frontend) - Port 3000
- **API** (NestJS backend) - Port 3001
- **AI** (FastAPI service) - Port 8000
- **PostgreSQL** (Database) - Port 5432

All services run on a shared Docker network and can communicate via service hostnames.

## Prerequisites

- Docker 20.10+ with Compose V2
- Docker Desktop (Mac/Windows) or Docker + Docker Compose (Linux)
- At least 4GB RAM available for Docker
- Clerk credentials (API keys from clerk.com)

## Quick Start

### 1. Set Up Environment

```bash
# Copy environment template
cp .env.docker.example .env.docker.local

# Edit with your settings
nano .env.docker.local

# Required: Add Clerk keys
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...
```

### 2. Build Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build api
docker-compose build web
docker-compose build ai
```

### 3. Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Specific service logs
docker-compose logs -f api
docker-compose logs -f web
docker-compose logs -f ai
```

### 4. Access Services

- **Frontend**: http://localhost:3000
- **API**: http://localhost:3001
- **AI Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432

### 5. Stop Services

```bash
# Stop all services (keep volumes)
docker-compose down

# Stop and remove volumes
docker-compose down -v

# Restart services
docker-compose restart
```

## Development Workflow

### Hot Reloading

All services are configured with volume mounts for development:

```bash
# Volumes allow code changes to reflect immediately
docker-compose up -d

# Edit files, changes reflect in running containers
# Frontend reloads automatically (Next.js hot reload)
# Backend reloads automatically (NestJS watch mode)
# AI reloads automatically (Uvicorn --reload)
```

### Database Management

```bash
# Run migrations inside container
docker-compose exec api npm run db:migrate

# Seed database
docker-compose exec api npm run db:seed

# Open Prisma Studio
docker-compose exec api npm run prisma studio

# Access PostgreSQL CLI
docker-compose exec postgres psql -U swimuser -d swim_db
```

### Running Commands

```bash
# Execute command in running container
docker-compose exec <service> <command>

# Examples:
docker-compose exec api npm run lint
docker-compose exec web npm run type-check
docker-compose exec ai pip install requests
```

## File Structure

```
swim-ai-assistant/
├── docker-compose.yml           # Main orchestration file
├── .dockerignore                # Files to ignore in builds
├── .env.docker.example          # Docker environment template
├── .env.docker.local            # Local Docker config (⚠️ git ignored)
├── apps/
│   ├── web/
│   │   └── Dockerfile           # Next.js multi-stage build
│   │   └── .dockerignore
│   ├── api/
│   │   └── Dockerfile           # NestJS production build
│   │   └── .dockerignore
│   └── ai/
│       └── Dockerfile           # FastAPI Python image
│       └── .dockerignore
└── packages/
    └── shared/                  # Copied into builds
```

## Dockerfile Details

### Web (Next.js)

- **Multi-stage build**: Builder stage → Runtime stage
- **Optimizations**: Node Alpine image, no development dependencies
- **Health check**: Monitors port 3000
- **User**: Runs as unprivileged `nextjs` user
- **Volumes**: Hot reload for src/ and public/

### API (NestJS)

- **Multi-stage build**: Builder stage → Runtime stage
- **Optimizations**: Node Alpine image, compiled output only
- **Health check**: Monitors port 3001
- **User**: Runs as unprivileged `nestjs` user
- **Volumes**: Hot reload for src/, watch mode enabled

### AI (FastAPI)

- **Base image**: Python 3.11 slim
- **Optimizations**: Minimal dependencies, pip caching
- **Health check**: Monitors port 8000
- **User**: Runs as unprivileged `fastapi` user
- **Volumes**: Full app directory for development

## Networking

All services connect via `swim-network` (bridge network):

- **Frontend** (`web:3000`) - Can reach API and AI
- **API** (`api:3001`) - Can reach Database and AI
- **AI** (`ai:8000`) - Can reach API
- **Database** (`postgres:5432`) - Accessible to API

Service-to-service communication uses hostnames:
```bash
# From frontend to API
http://api:3001

# From API to database
postgresql://swimuser:swimpass@postgres:5432/swim_db

# From AI to API
http://api:3001
```

## Common Tasks

### View Container Status

```bash
docker-compose ps
```

### View Container Logs

```bash
# All services
docker-compose logs

# Follow output
docker-compose logs -f

# Specific service
docker-compose logs -f api

# Last 50 lines
docker-compose logs --tail=50 web
```

### Rebuild After Dependency Changes

```bash
# Rebuild and restart
docker-compose up -d --build api

# Or full rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Access Container Shell

```bash
# Node services
docker-compose exec api sh
docker-compose exec web sh

# Python service
docker-compose exec ai bash

# Database
docker-compose exec postgres psql -U swimuser -d swim_db
```

### Check Service Health

```bash
# Get health status
docker-compose ps

# Manual health check
docker-compose exec api curl http://localhost:3001/health
docker-compose exec web curl http://localhost:3000
docker-compose exec ai curl http://localhost:8000/health
```

## Production Deployment

For production deployment:

1. Use `docker-compose.prod.yml` (separate file for prod)
2. Set `NODE_ENV=production` and `ENVIRONMENT=production`
3. Remove volume mounts (immutable images)
4. Use external PostgreSQL (managed database)
5. Configure proper networking and load balancing
6. Set up logging and monitoring
7. Use Docker registry for image distribution

### Build Production Image

```bash
docker build -f apps/api/Dockerfile -t swim-api:1.0.0 .
docker build -f apps/web/Dockerfile -t swim-web:1.0.0 .
docker build -f apps/ai/Dockerfile -t swim-ai:1.0.0 .
```

## Troubleshooting

### Port Already in Use

```bash
# Find what's using the port
lsof -i :3000
lsof -i :3001
lsof -i :8000
lsof -i :5432

# Stop conflicting service or use different port
docker-compose down
```

### Build Fails

```bash
# Clean build (no cache)
docker-compose build --no-cache

# Check build logs
docker-compose build api 2>&1 | tail -50
```

### Container Exits Immediately

```bash
# Check logs
docker-compose logs api

# Common issues:
# - Port already in use
# - Missing environment variables
# - Database not ready
# - Wrong database credentials
```

### Database Connection Error

```bash
# Verify database is running and healthy
docker-compose ps postgres

# Check database logs
docker-compose logs postgres

# Test connection from API
docker-compose exec api psql $DATABASE_URL
```

### Hot Reload Not Working

```bash
# Verify volumes are mounted
docker-compose ps -a | grep -E "api|web"

# Check volume mounts
docker inspect swim-api | grep -A 10 "Mounts"

# Restart with fresh volumes
docker-compose down -v
docker-compose up -d
```

### Out of Disk Space

```bash
# Remove unused Docker resources
docker system prune -a

# Remove volumes
docker volume prune

# Check usage
docker system df
```

## Performance Tips

1. **Use `.dockerignore`** - Reduces build context size
2. **Multi-stage builds** - Smaller production images
3. **Alpine images** - Smaller base images
4. **Layer caching** - Copy package files before source
5. **Health checks** - Ensures containers are ready

## Security Notes

- All services run as non-root users
- Use environment variables for secrets (not hardcoded)
- Health checks monitor container health
- Don't mount sensitive files in volumes
- Use `.dockerignore` to exclude secrets and logs

## Next Steps

- Set up CI/CD with Docker image pushing
- Configure production docker-compose file
- Set up container registry (Docker Hub, ECR, etc.)
- Implement logging aggregation
- Set up health monitoring and alerts
