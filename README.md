https://tazreimers.atlassian.net?continue=https%3A%2F%2Ftazreimers.atlassian.net%2Fwelcome%2Fsoftware&atlOrigin=eyJpIjoiZDY5YTkwNWRmNTgzNDY2MDljYjEwODJkZGVhZDk4ZDgiLCJwIjoiaiJ9

https://docs.google.com/spreadsheets/d/1WiUeMio2kRwZIJYxVYxwU1Hi0xdoxgf88UVEm2h6oVQ/edit?gid=697327#gid=697327

https://supabase.com/dashboard/project/ctkiohnrxwrjfeamikul

# Swim AI - AI-First Swimming Coaching Platform

Build an AI-powered platform that helps swimming coaches plan, manage, analyze, and improve athlete performance.

## 🎯 Vision

- **Coaches** manage athletes and teams
- **Coaches** build and assign training sessions
- **AI** generates intelligent workout recommendations
- **Calendar** drives weekly planning
- **Platform** supports multiple clubs

## 📦 Monorepo Structure

```
swim-ai-assistant/
├── apps/
│   ├── web/              # Next.js frontend
│   ├── api/              # NestJS backend
│   └── ai/               # FastAPI AI service
├── packages/
│   └── shared/           # Shared types, schemas, utilities
├── docs/                 # Documentation
├── plans/                # Development plans
└── apps/api/prisma/      # Database schema, migrations, and seed
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Python 3.11+
- PostgreSQL 14+
- Docker (for local development)

### Installation

```bash
# Clone repository
git clone <repo-url>
cd swim-ai-assistant

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Development

```bash
# Start all services (web, api, ai)
pnpm dev

# Individual service startup
pnpm --filter @swim/web dev
pnpm --filter @swim/api dev
pnpm --filter @swim/ai dev
```

**Services:**
- Frontend: http://localhost:3000
- API: http://localhost:3001
- AI: http://localhost:8000

### Database

```bash
# Create and seed database
pnpm db:migrate
pnpm db:seed

# View database with Prisma Studio
pnpm prisma studio
```

## 📚 Project Organization

### Apps

- **@swim/web** - Next.js frontend with Supabase Auth and MUI
- **@swim/api** - NestJS REST API with Prisma ORM, PostgreSQL, and Supabase token verification
- **@swim/ai** - FastAPI microservice for AI-powered workout generation and coaching

### Packages

- **@swim/shared** - Shared TypeScript types, Zod schemas, constants, and utilities

## 🔨 Development Commands

| Command | Purpose |
|---------|---------|
| `pnpm dev` | Start all services in development mode |
| `pnpm build` | Build all packages for production |
| `pnpm test` | Run all test suites |
| `pnpm lint` | Lint all packages |
| `pnpm type-check` | Type check all packages |
| `pnpm clean` | Remove all build artifacts and node_modules |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:seed` | Seed database with sample data |

## 🗂️ Directory Guide

Each app and package has a detailed README:

- [`apps/web/README.md`](./apps/web/README.md) - Frontend guide
- [`apps/api/README.md`](./apps/api/README.md) - Backend guide
- [`apps/ai/README.md`](./apps/ai/README.md) - AI service guide
- [`packages/shared/README.md`](./packages/shared/README.md) - Shared package guide

## 🔐 Environment Configuration

Copy `.env.example` to the relevant local environment files and configure:

```env
# Database
DATABASE_URL=<local-postgres-connection-string>

# Authentication (Supabase)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
AI_SERVICE_URL=http://localhost:8000
AI_MODE=mock
```

## 🐳 Docker

Run all services with Docker Compose:

```bash
docker-compose up
```

## 📋 Development Plans

Plans 1–12 cover infrastructure, Supabase/MUI authentication, clubs,
sessions, athlete logging, analytics, and AI insights. Current status is in
[`plans/PROGRESS.md`](./plans/PROGRESS.md).

## 🔄 Git Workflow

1. Create feature branch: `git checkout -b feature/feature-name`
2. Make changes and commit: `git commit -am "Description"`
3. Push to remote: `git push origin feature/feature-name`
4. Create Pull Request on GitHub
5. After merge, pull main: `git checkout main && git pull origin main`

## 📚 Tech Stack

### Frontend
- **React 18** - UI library
- **Next.js 14** - Framework (App Router)
- **MUI** - Component library and styling
- **TypeScript** - Type safety
- **Supabase Auth** - Authentication

### Backend
- **NestJS 10** - Framework
- **Prisma** - ORM
- **PostgreSQL** - Database
- **TypeScript** - Type safety
- **Supabase Auth** - Token verification

### AI
- **FastAPI** - Web framework
- **Python 3.11+** - Language
- **Pydantic** - Data validation
- **LangChain** - LLM integration (Phase 3)

### DevOps
- **Docker** - Containerization
- **Turbo** - Monorepo build system
- **pnpm** - Package manager
- **GitHub Actions** - CI/CD

## 📖 Documentation

- [Development Plan](./Swim_AI_Development_Plan.md) - High-level roadmap
- [Plans Directory](./plans/) - Detailed implementation guides
- [Docs Directory](./docs/) - Architecture and design docs

## 🆘 Troubleshooting

### Dependencies not installing
```bash
pnpm clean
pnpm install
```

### Database issues
```bash
# Reset database
pnpm db:migrate:reset
pnpm db:seed
```

### Port already in use
Change ports in `.env.local` or kill processes:
```bash
# Find and kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 🤝 Contributing

1. Follow the development workflow above
2. Write tests for new features
3. Keep commits small and focused
4. Update documentation as needed
5. Pass all linting and type checks before pushing

## 📝 License

Private repository

## 📞 Support

For issues and questions:
- Check existing documentation in `/docs` and `/plans`
- Review app-specific READMEs
- Open an issue with clear description and reproduction steps
