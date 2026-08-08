# Agent Instructions & Progress

This document provides guidance for AI agents working on the Swim AI project, including current progress and next steps.

## 📋 Quick Status

**Project**: Swim AI - AI-First Swimming Coaching Platform
**Repository**: tazreimers/swim-ai-assistant
**Current Phase**: Phase 1 - Foundation (2/6 Plans Complete)
**Last Updated**: August 8, 2026 @ 11:33 AM

### Quick Stats
- ✅ Plans Completed: 2/6 (Monorepo, Docker)
- ✅ Commits Made: 2
- ✅ Files Created: 50+
- ✅ Dependencies Installed: 932 npm + 24 python
- 📊 Estimated Phase 1 Progress: ~33%

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

---

## ⏳ Next Priority (Plan 3)

### Plan 3: Authentication Setup

**Location**: `plans/03-authentication-setup.md`

**Objective**: Implement secure authentication using Clerk across frontend and backend

**Scope**:
- Clerk integration in Next.js app (middleware, hooks, UI components)
- Clerk JWT verification in NestJS API
- Protected API routes using guard middleware
- User context propagation from frontend to backend
- Session management and logout
- Role/permission foundation for future use

**Estimated Duration**: 4-5 hours

**Pre-requisites**:
- ✓ Monorepo setup complete
- ✓ Docker configured (optional but recommended)
- ✓ Dependencies installed
- ⚠️ **REQUIRED**: Clerk account with API keys

**Step-by-Step**:
1. Sign up for Clerk account at clerk.com
2. Create Clerk application and get keys
3. Add keys to .env.local
4. Implement Next.js middleware and components
5. Implement NestJS JWT verification
6. Test authentication flow
7. Document in project

**Success Criteria**:
- User can sign up via Clerk UI
- Logged in users see dashboard
- Unauthenticated users redirect to login
- API verifies JWT on protected endpoints
- User ID available in API context
- Session persists across page reloads

**Deliverables Expected**:
- Clerk integration in @swim/web
- JWT middleware in @swim/api
- Protected example endpoint
- TypeScript types for authenticated requests
- Environment configuration
- Documentation

---

## 🔄 Remaining Plans (Phase 1)

### Plan 4: Database Setup
**Status**: ⏳ Pending
**Duration**: 4-5 hours
**Focus**: PostgreSQL, Prisma ORM, migrations, seeding

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
- `plans/03-authentication-setup.md` - ⏳ Next
- `plans/04-database-setup.md` - ⏳ Future
- `plans/05-shared-packages.md` - ⏳ Future
- `plans/06-ci-cd-pipeline.md` - ⏳ Future

### Source Code Structure
- `apps/web/src/` - Next.js frontend code
- `apps/api/src/` - NestJS backend code
- `apps/ai/app/` - FastAPI service code
- `packages/shared/src/` - Shared types, schemas, utils

---

## 🚀 How to Continue

### To Work on Plan 3 (Authentication)

```bash
# 1. Read the plan document
cat plans/03-authentication-setup.md

# 2. Update progress when starting
# Edit plans/PROGRESS.md - mark Plan 3 as "In Progress"

# 3. Implement authentication
# Follow the deliverables in the plan

# 4. Test the implementation
npm run type-check
npm run lint
cd apps/web && npm run build
cd apps/api && npm run build

# 5. Commit your work
git add -A
git commit -m "Implement Plan 3: Authentication Setup

- Clerk integration details
- What you implemented
- What works

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

# 6. Update progress file
# Edit plans/PROGRESS.md - mark Plan 3 as "Complete"
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

All prerequisites for Plan 3 are in place:
- Monorepo setup complete
- Dependencies installed
- Docker configured
- All type checking passing
- Documentation comprehensive

Proceed to Plan 3: Authentication Setup when ready.

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

**Date**: August 8, 2026 @ 11:33 AM
**By**: Initial Setup + Plans 1 & 2 + Bootstrap
**Next**: Plan 3 - Authentication Setup
**Status**: Ready to proceed ✅

---

**For questions or updates, refer to plans/PROGRESS.md or the individual plan documents.**
