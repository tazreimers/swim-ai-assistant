# @swim/api

NestJS REST API backend for the Swim AI coaching platform.

## Purpose

RESTful API that handles authentication, data management, and business logic for the Swim AI platform. Integrates with PostgreSQL via Prisma ORM and verifies Supabase Auth tokens.

## Tech Stack

- **Framework**: NestJS 10+
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: Supabase Auth token verification
- **Validation**: class-validator
- **Types**: TypeScript 5+
- **Shared**: @swim/shared types and schemas

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up database
pnpm db:migrate
pnpm db:seed

# Run development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
```

API runs on `http://localhost:3001` in development.

## Structure

- `src/modules/` - Feature modules (auth, coaches, athletes, teams, etc.)
- `src/common/` - Guards, filters, decorators, and middleware
- `src/prisma/` - Database schema and migrations
- `test/` - Integration tests

## Key Features (MVP)

- User authentication via Supabase Auth
- JWT token verification on protected routes
- Club creation, invitations, and membership permissions
- Squad creation and athlete membership management
- CRUD operations for core entities
- Database migrations and seeding
- Error handling and validation
- OpenAPI/Swagger documentation

## Environment Variables

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/swim_db
SUPABASE_URL=
SUPABASE_ANON_KEY=
NODE_ENV=development
PORT=3001
```

## Database

### Migrations

```bash
# Create new migration
pnpm prisma migrate dev --name add_feature

# Deploy migrations
pnpm db:migrate

# Seed data
pnpm db:seed
```

### Prisma Studio

```bash
pnpm prisma studio
```

Opens browser UI to view and edit database data.

## API Endpoints

Core endpoints are protected by Supabase Auth JWT authentication:

- `POST /auth/user` - Get current user
- `POST /clubs` - Create a club
- `GET /clubs` - List the current user's clubs
- `POST /clubs/:clubId/invitations` - Create a coach or athlete invitation
- `POST /invitations/:token/accept` - Accept a club invitation
- `POST /clubs/:clubId/squads` - Create a squad
- `POST /squads/:squadId/members` - Add a club athlete to a squad
- `GET /athletes` - List athletes
- `POST /athletes` - Create athlete
- `GET /teams` - List teams
- `POST /teams` - Create team
- `GET /workouts` - List workouts
- `POST /workouts` - Create workout

## Development

- Hot reload with `--watch` flag
- Class-based architecture with dependency injection
- Centralized error handling
- Structured logging

## Building

```bash
pnpm build
```

Compiled output goes to `dist/`. Ready for deployment to Railway or similar Node.js hosting.

## Testing

```bash
pnpm test
pnpm test:watch
pnpm test:cov
```

Uses Jest for unit and integration testing.
