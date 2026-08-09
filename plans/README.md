# Swim AI - MVP Infrastructure Plans

These are detailed, AI-friendly prompts for implementing the foundation phase of the Swim AI platform. Each plan is focused, actionable, and suitable for delegating to AI assistants.

## Phase 1: Foundation (Week 1-2)

### 1. [Monorepo Setup](./01-monorepo-setup.md)
Create the foundational monorepo structure using Turborepo. This enables all subsequent development.
- **Priority**: CRITICAL (blocks all other work)
- **Estimated time**: 2-3 hours
- **Dependencies**: None

### 2. [Docker Setup](./02-docker-setup.md)
Configure Docker for all services to enable consistent local and production environments.
- **Priority**: CRITICAL
- **Estimated time**: 3-4 hours
- **Dependencies**: Monorepo Setup

### 3. [Authentication Setup](./04-authentication-setup.md)
Implement Clerk authentication across frontend and backend for secure user access.
- **Priority**: CRITICAL
- **Estimated time**: 4-5 hours
- **Dependencies**: Monorepo Setup, Docker Setup

### 4. [Database Setup](./05-database-setup.md)
Set up PostgreSQL with Prisma ORM and MVP schema for data persistence.
- **Priority**: CRITICAL
- **Estimated time**: 4-5 hours
- **Dependencies**: Monorepo Setup, Docker Setup

### 5. [Shared Packages](./06-shared-packages.md)
Create shared TypeScript packages for types and utilities across frontend and backend.
- **Priority**: HIGH
- **Estimated time**: 2-3 hours
- **Dependencies**: Monorepo Setup

### 6. [CI/CD Pipeline](./03-ci-cd-pipeline.md)
Automate testing, building, and deployment with GitHub Actions.
- **Priority**: HIGH
- **Estimated time**: 3-4 hours
- **Dependencies**: Monorepo Setup, Docker Setup, Database Setup, Authentication Setup

### 7. [External Environment and Release Setup](./07-external-environment-setup.md)
Complete the GitHub, PostgreSQL, Railway, Vercel, and Clerk configuration needed
to verify the infrastructure plans in real environments.
- **Priority**: CRITICAL for release
- **Estimated time**: 2-4 hours, depending on account setup
- **Dependencies**: Database Setup, Authentication Setup, CI/CD Pipeline

## Phase 2: MVP Product Features

### 8. [Frontend Design System and Supabase Authentication](./08-frontend-design-system-auth.md)
Migrate the frontend from Clerk/Tailwind to Supabase Auth and MUI, with a
professional pastel blue/green design system and role-aware application shell.
- **Priority**: CRITICAL
- **Estimated time**: 5-7 hours
- **Dependencies**: Plans 01, 04, 05, 06, and external Supabase setup

### 9. [Clubs, Users, Invitations, and Squads](./09-clubs-squads.md)
Implement club membership, invitations, role permissions, and squad
management for coaches and athletes.
- **Priority**: CRITICAL
- **Estimated time**: 6-8 hours
- **Dependencies**: Plan 08

### 10. [Training Sessions and Athlete Logging](./10-sessions-and-athlete-logging.md)
Implement coach session authoring, whiteboard uploads, publishing, and fast
athlete rep-time logging.
- **Priority**: CRITICAL
- **Estimated time**: 8-10 hours
- **Dependencies**: Plan 09

### 11. [Results, Progress Tracking, and Dashboards](./11-progress-and-dashboards.md)
Implement performance calculations, session history, progress graphs,
attendance, and role-specific dashboards.
- **Priority**: HIGH
- **Estimated time**: 6-8 hours
- **Dependencies**: Plan 10

### 12. [AI Insights and MVP Validation](./12-ai-insights-and-mvp-validation.md)
Implement structured session, athlete, and coach insights plus reliability,
observability, and pilot validation.
- **Priority**: CRITICAL
- **Estimated time**: 8-12 hours
- **Dependencies**: Plans 10 and 11, OpenAI and Supabase external setup

## How to Use These Plans

1. Read a plan thoroughly to understand the scope and success criteria
2. Use the plan as a prompt for AI or as guidance for manual implementation
3. Verify deliverables match the success criteria before moving to the next plan
4. Plans are ordered by dependency - work top to bottom
5. Each plan assumes completion of its dependencies

## Implementation Order

```
Monorepo Setup (01)
    ├─→ Docker Setup (02)
    ├─→ Shared Packages (05)
    └─→ Authentication Setup (03)
             └─→ Database Setup (04)
                  └─→ CI/CD Pipeline (06)
                       └─→ External Environment and Release Setup (07)
                            └─→ Frontend Design System and Supabase Authentication (08)
                                 └─→ Clubs, Users, Invitations, and Squads (09)
                                      └─→ Training Sessions and Athlete Logging (10)
                                           └─→ Results, Progress Tracking, and Dashboards (11)
                                                └─→ AI Insights and MVP Validation (12)
```

**Estimated Foundation Time**: 20-28 hours including external configuration

**Estimated MVP Feature Time**: 33-45 hours excluding pilot operations

## Next Steps After Phase 1

Once these infrastructure plans are complete:
1. Next phase focuses on core coaching features (athletes, teams, workouts)
2. Build API endpoints using the authenticated, typed, dockerized infrastructure
3. Build frontend UI using Next.js + React + MUI
4. Use CI/CD pipeline to safely deploy changes
