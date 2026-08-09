# Agent Instructions & Progress

This document provides guidance for AI agents working on the Swim AI project, including current progress and next steps.

## 📋 Quick Status

**Project**: Swim AI - AI-First Swimming Coaching Platform
**Repository**: tazreimers/swim-ai-assistant
**Current Phase**: Phase 1 - Foundation (3/6 Plans Complete)
**Last Updated**: August 9, 2026 @ 10:10 AM

### Quick Stats
- ✅ Plans Completed: 3/6 (Monorepo, Docker, Authentication)
- ✅ Commits Made: 2
- ✅ Files Created: 50+
- ✅ Dependencies Installed: 932 npm + 24 python
- 📊 Estimated Phase 1 Progress: ~50%

---

## 🎯 For Agents Taking Over

### Start Here
1. Read [README.md](./README.md) - Project overview
2. Read [plans/README.md](./plans/README.md) - Plan structure
3. Read [plans/PROGRESS.md](./plans/PROGRESS.md) - Detailed progress
4. Check this file for current context

### Project Structure
```
swim-ai-assistant/
├── apps/web/        # Next.js frontend (bootstrapped)
├── apps/api/        # NestJS backend (bootstrapped)
├── apps/ai/         # FastAPI service (bootstrapped)
├── packages/shared/ # Shared types & utils (ready)
└── plans/           # Implementation guides
```

### Tech Stack
- **Frontend**: Next.js 14, React 18, Tailwind CSS, Clerk auth
- **Backend**: NestJS 10, Prisma ORM, PostgreSQL
- **AI Service**: FastAPI, Python 3.11, Uvicorn
- **DevOps**: Docker, Docker Compose, Turborepo

### Environment
- **Working Directory**: `/Users/tarrantreimers/Documents/GitHub/swim-ai-assistant`
- **Package Manager**: npm (with pnpm available)
- **Node Version**: 18+
- **Python Version**: 3.11+
- **Docker**: Configured (docker-compose.yml ready)

---

## ✅ Completed Work

### Phase 0: Planning (✅ COMPLETE)
- Development plan created
- 6 implementation plans written
- Tech stack decided
- Architecture planned

**Evidence**: `Swim_AI_Development_Plan.md`, `plans/*.md`

### Phase 1, Plan 1: Monorepo Setup (✅ COMPLETE)
- Turborepo configured
- 3 apps + 1 shared package created
- All TypeScript configs set up
- Workspaces properly linked

**Commit**: `ed455ba` - "Bootstrap monorepo infrastructure - Plan 1 complete"

### Phase 1, Plan 2: Docker Setup (✅ COMPLETE)
- Dockerfiles for all 3 services created
- docker-compose.yml with full orchestration
- Documentation (DOCKER.md, DOCKER-QUICKSTART.md)
- Health checks and hot reloading configured

**Commit**: `3c30819` - "Implement Docker setup - Plan 2 complete"

### Bootstrap: Dependencies Installed (✅ COMPLETE)
- All npm packages installed (932 total)
- Python venv created with 24 packages
- Type checking validated on all TypeScript packages
- BOOTSTRAP.md guide created

**Verification**: Type checking passes ✓, imports working ✓

**Evidence**: 
- `BOOTSTRAP.md` - Setup guide
- `package-lock.json` files in each app
- `apps/ai/venv/` exists and functional

### Phase 1, Plan 3: Authentication Setup (✅ COMPLETE)
- ClerkProvider and public sign-in/sign-up pages in Next.js
- Clerk route middleware protects authenticated pages
- Dashboard displays authenticated Clerk user data
- Dashboard sign-out clears the session and routes to sign-in
- NestJS verifies Clerk bearer JWTs with `@clerk/backend`
- Protected `GET /user/me` endpoint exposes authenticated user context
- Public health endpoints are available for service checks

**Verification**: API and web TypeScript checks pass ✓

---

## ⏳ Next Priority (Plan 4)

### Plan 4: Database Setup

**Location**: `plans/05-database-setup.md`

**Objective**: Implement PostgreSQL and Prisma database infrastructure

**Scope**:
- PostgreSQL and Prisma configuration
- Initial schema and migrations
- Database seed data
- API database integration

**Estimated Duration**: 4-5 hours

**Pre-requisites**:
- ✓ Monorepo setup complete
- ✓ Docker configured (optional but recommended)
- ✓ Dependencies installed

**Step-by-Step**:
1. Define the Prisma schema
2. Configure database environment variables
3. Create and apply the initial migration
4. Add seed data and database service wiring
5. Test database connectivity
6. Document in project

**Success Criteria**:
- API connects to PostgreSQL
- Initial migrations apply successfully
- Seed data can be loaded repeatably
- Database access is available through NestJS
- Environment configuration is documented

**Deliverables Expected**:
- Prisma schema and migration
- Database module and service
- Seed script
- Environment configuration
- Documentation

---

## 🔄 Remaining Plans (Phase 1)

### Plan 4: Database Setup
**Status**: 🚧 In Progress
**Duration**: 4-5 hours
**Focus**: PostgreSQL, Prisma ORM, migrations, seeding

**Completed so far**:
- Prisma schema and initial migration generated
- NestJS Prisma service/module wired
- Repeatable seed script added
- Database documentation added

**Blocked validation**: Docker/PostgreSQL is not currently running, so migration deployment and seeding still need to be run.

### Plan 5: Shared Packages (May overlap with others)
**Status**: ⏳ Pending
**Duration**: 2-3 hours
**Focus**: Finalize shared exports and utilities

### Plan 6: CI/CD Pipeline
**Status**: ⏳ Pending
**Duration**: 3-4 hours
**Focus**: GitHub Actions, automated testing, deployment

**Estimated Completion**: By end of Phase 1 (estimated 18-24 hours total)

---

## 📂 Key Files for Agents

### Configuration Files
- `package.json` (root) - Monorepo config with scripts
- `turbo.json` - Build pipeline configuration
- `tsconfig.base.json` - Shared TypeScript config
- `docker-compose.yml` - Service orchestration
- `.env.example` - Environment variables template
- `.env.docker.example` - Docker environment template

### Documentation
- `README.md` - Project overview and quick start
- `BOOTSTRAP.md` - Bootstrap guide with troubleshooting
- `DOCKER.md` - Comprehensive Docker guide
- `DOCKER-QUICKSTART.md` - Docker quick start (3 steps)
- `plans/README.md` - Plans overview
- `plans/PROGRESS.md` - Detailed progress tracking
- `agents.md` - This file

### Implementation Plans
- `plans/01-monorepo-setup.md` - ✅ Complete
- `plans/02-docker-setup.md` - ✅ Complete
- `plans/04-authentication-setup.md` - ✅ Complete
- `plans/05-database-setup.md` - ⏳ Future
- `plans/06-shared-packages.md` - ⏳ Future
- `plans/03-ci-cd-pipeline.md` - ⏳ Future

### Source Code Structure
- `apps/web/src/` - Next.js frontend code
- `apps/api/src/` - NestJS backend code
- `apps/ai/app/` - FastAPI service code
- `packages/shared/src/` - Shared types, schemas, utils

---

## 🚀 How to Continue

### To Work on Plan 4 (Database)

```bash
# 1. Read the plan document
cat plans/05-database-setup.md

# 2. Update progress when starting
# Edit plans/PROGRESS.md - mark the database plan as "In Progress"

# 3. Implement the database setup
# Follow the deliverables in the plan

# 4. Test the implementation
npm run type-check
npm run lint
cd apps/web && npm run build
cd apps/api && npm run build

# 5. Commit your work
git add -A
git commit -m "Implement database setup

- Prisma and PostgreSQL integration
- What you implemented
- What works

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 6. Update progress file
# Edit plans/PROGRESS.md - mark the database plan as "Complete"
```

### To Update Progress

```bash
# Edit the progress file
nano plans/PROGRESS.md

# Make these updates:
# 1. Change status of completed plan to ✅ Complete
# 2. Add start/end dates
# 3. Document what was implemented
# 4. Update overall progress percentage
# 5. Commit changes

git add plans/PROGRESS.md agents.md
git commit -m "Update progress tracking for Plan X"
```

### Commands You'll Need

```bash
# Navigate to project
cd /Users/tarrantreimers/Documents/GitHub/swim-ai-assistant

# Install/update dependencies
npm install
cd apps/web && npm install
cd ../api && npm install

# Type checking
npm run type-check

# Linting
npm run lint

# Building
npm run build

# View git log
git log --oneline

# Commit work
git add -A
git commit -m "message"
```

---

## 📊 Progress Tracking Template

When you complete a plan, update `plans/PROGRESS.md` with this template:

```markdown
### Phase X, Plan Y: [Plan Name]
**Status**: ✅ COMPLETE | **Started**: [Date] | **Completed**: [Date] | **Duration**: [Hours]

#### Objective
[Copy from plan document]

#### What Was Implemented
[List what you did]

#### Deliverables Completed
- ✅ Item 1
- ✅ Item 2

#### Success Criteria Met
- ✅ Criteria 1
- ✅ Criteria 2

#### Files Created/Modified
- File 1
- File 2

#### Commits
```
Hash: abc1234
Message: "Commit message"
Changes: X files, Y insertions(+)
```

#### Notes
[Any additional notes]
```

---

## ⚠️ Important Notes for Agents

### Code Quality
- **Type Safety**: All TypeScript must have `strict: true` enabled
- **Linting**: All code must pass ESLint
- **Testing**: Add tests for new features (where applicable)
- **Documentation**: Keep README files up-to-date

### Git Practices
- **Commits**: Small, focused commits with clear messages
- **Branch**: Work on main or feature branches as needed
- **Co-author**: Include Copilot co-author in commits
- **Messages**: Format: "Do X: description with context"

### Environment
- **Local Dev**: Use `.env.local` with your settings
- **Docker**: Use `.env.docker.local` for Docker Compose
- **Production**: Will need separate config (Phase 2+)

### Testing
- Type check: `npm run type-check`
- Lint: `npm run lint`
- Build: `npm run build`
- Docker build: `docker-compose build` (requires Docker)

### Getting Help
- Check `README.md` and individual app READMEs
- Check `plans/PROGRESS.md` for what's been done
- Check git history: `git log --oneline`
- Check documentation files (DOCKER.md, BOOTSTRAP.md, etc.)

---

## 🎯 Current Blockers

**None identified** ✅

Plan 3 authentication infrastructure is complete. Clerk account keys are still required in local environment files to run the interactive sign-in flow.

---

## 📞 Quick Reference

### Useful Commands
```bash
# Check status
git status
git log --oneline -10

# Type check all packages
npm run type-check

# Lint all packages  
npm run lint

# Build all packages
npm run build

# Run specific app in dev
cd apps/web && npm run dev
cd apps/api && npm run dev

# Docker commands
docker-compose build
docker-compose up -d
docker-compose logs -f
```

### File Locations
- Project root: `/Users/tarrantreimers/Documents/GitHub/swim-ai-assistant`
- Plans directory: `./plans/`
- Progress tracking: `./plans/PROGRESS.md` ← **UPDATE THIS**
- Agent info: `./agents.md` ← **THIS FILE**

### Important URLs/Ports
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- AI Service: http://localhost:8000
- Database: localhost:5432
- Prisma Studio: http://localhost:5555 (when running)

---

## 📝 Last Update

**Date**: August 8, 2026 @ 12:16 PM
**By**: Initial Setup + Plans 1, 2 & 3 + Bootstrap
**Next**: Plan 4 - Database Setup
**Status**: Ready to proceed ✅

---

**For questions or updates, refer to plans/PROGRESS.md or the individual plan documents.**
