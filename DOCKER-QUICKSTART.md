# Docker Quick Start Guide

Get the Swim AI platform running with Docker in 3 steps.

## Prerequisites

- Docker Desktop (Mac/Windows) or Docker + Docker Compose (Linux)
- Clerk account and API keys (clerk.com)

## Step 1: Configure Environment

```bash
# Create Docker environment file
cp .env.docker.example .env.docker.local

# Edit and add your Clerk keys
nano .env.docker.local
```

Required environment variables:
```env
DB_USER=swimuser
DB_PASSWORD=swimpass
DB_NAME=swim_db
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

## Step 2: Build Images

```bash
# Build all services (first time only)
docker-compose build

# This builds:
# - swim-web (Next.js frontend)
# - swim-api (NestJS backend)
# - swim-ai (FastAPI service)
# - Uses PostgreSQL 15 from Docker Hub
```

## Step 3: Start Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

## Access Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | Web UI |
| API | http://localhost:3001 | REST API |
| API Docs | http://localhost:3001/api/docs | Swagger UI |
| AI Service | http://localhost:8000 | AI endpoints |
| AI Docs | http://localhost:8000/docs | FastAPI Swagger |
| Database | localhost:5432 | PostgreSQL |

## Common Commands

```bash
# View status of all services
docker-compose ps

# View logs
docker-compose logs -f api          # API logs
docker-compose logs -f web          # Frontend logs
docker-compose logs -f ai           # AI logs
docker-compose logs -f postgres     # Database logs

# Stop all services (keeps data)
docker-compose down

# Stop and remove data
docker-compose down -v

# Restart a service
docker-compose restart api

# Execute command in container
docker-compose exec api npm run db:migrate
docker-compose exec api npm run db:seed

# Access container shell
docker-compose exec api sh
docker-compose exec postgres psql -U swimuser -d swim_db
```

## Development Workflow

All services support hot reloading:

```bash
# 1. Start services
docker-compose up -d

# 2. Edit code in your editor
nano apps/web/src/pages/index.tsx

# 3. Changes automatically reload in containers
# Frontend: Next.js hot reload (instant)
# Backend: NestJS watch mode (few seconds)
# AI: Uvicorn reload (few seconds)

# 4. View changes at http://localhost:3000
```

## Setup Database

```bash
# Run migrations
docker-compose exec api npm run db:migrate

# Seed sample data
docker-compose exec api npm run db:seed

# Open Prisma Studio (visual database editor)
docker-compose exec api npm run prisma studio
# Opens at http://localhost:5555
```

## Troubleshooting

**Ports already in use?**
```bash
# Kill existing process
lsof -i :3000 | grep -oE '^\S+\s+[0-9]+' | awk '{print $2}' | xargs kill -9

# Or use different ports
# Edit docker-compose.yml ports section
```

**Services won't start?**
```bash
# Check logs for errors
docker-compose logs postgres
docker-compose logs api
docker-compose logs web

# Rebuild without cache
docker-compose build --no-cache
docker-compose up -d
```

**Database connection error?**
```bash
# Verify PostgreSQL is running
docker-compose ps postgres

# Check if database exists
docker-compose exec postgres psql -U swimuser -l

# Recreate database
docker-compose down -v
docker-compose up -d postgres
docker-compose exec api npm run db:migrate
```

**Out of disk space?**
```bash
# Clean up Docker
docker system prune -a
docker volume prune
```

## Next Steps

1. ✅ Configure .env.docker.local
2. ✅ Run `docker-compose build`
3. ✅ Run `docker-compose up -d`
4. ✅ Access services at localhost:3000, etc.
5. → Run database migrations: `docker-compose exec api npm run db:migrate`
6. → Seed sample data: `docker-compose exec api npm run db:seed`
7. → Check Plan 3: Authentication Setup

## More Information

- Full Docker guide: [DOCKER.md](./DOCKER.md)
- Development plans: [plans/README.md](./plans/README.md)
- Project overview: [README.md](./README.md)
