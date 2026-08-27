# Database Setup

## Objective
Set up PostgreSQL database with Prisma ORM, migrations, and seeding for MVP schema.

## Scope (MVP Infrastructure)
- Supabase PostgreSQL for production
- Local PostgreSQL via Docker for development
- Prisma schema for foundational entities (User, Coach, Athlete, Team, Workout, Session)
- Prisma migrations system
- Database connection pooling for production
- Seed data for development and testing
- TypeScript types generated from schema
- Database backups strategy

## Deliverables
- `prisma/schema.prisma` with MVP entities
- Docker Compose service for PostgreSQL in local dev
- `.env` template with DATABASE_URL
- Initial migration with core tables
- Prisma client setup in NestJS
- Seed script for development data
- Database connection service in NestJS
- TypeScript types exported from Prisma
- Backup and restore documentation for Supabase PostgreSQL

## Success Criteria
- `pnpm run db:migrate` runs migrations successfully
- `pnpm run db:seed` populates dev database with sample data
- Prisma client available in NestJS services
- Database schema reflects all MVP entities
- Type safety for all database queries
- Connection pooling configured for production
- Local dev can reset database easily
