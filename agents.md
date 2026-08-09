# Agent Instructions

This repository is Swim AI, an AI-first swimming coaching platform.

## Repository context

- `apps/web`: Next.js 14 frontend with Clerk authentication
- `apps/api`: NestJS API with Clerk JWT verification and Prisma
- `apps/ai`: FastAPI AI service
- `packages/shared`: shared TypeScript types, Zod schemas, constants, and utilities
- `plans`: implementation plans and progress tracking

## Development conventions

- Use npm-compatible workspace commands unless a task explicitly requires pnpm.
- Keep TypeScript strict and preserve the existing package boundaries.
- Reuse `@swim/shared` for domain types, validation, constants, and utilities.
- Keep secrets in ignored `.env` files; never commit credentials.
- Use Prisma migrations for database schema changes.
- Run targeted type-checks, builds, and tests for changed packages before completing work.
- Make focused changes and do not rewrite unrelated user changes.

## Progress tracking

`plans/PROGRESS.md` is the single source of truth for implementation status, completed work, blockers, and next steps. Read it before starting a task and update it when a plan materially changes.
