# Plan 13: Production Foundation and Release Verification

## AI implementation prompt

Make the implemented MVP safely deployable for a pilot club before adding new
product features. Use Vercel for the Next.js app, Supabase for Auth,
PostgreSQL, and private Storage, and deploy NestJS and FastAPI as independent
managed containers. Do not change product behaviour in this plan.

## Objective

Prove that the existing authenticated coach-to-athlete workflow works in a
real hosted environment and can be observed, recovered, and rolled back.

## Prerequisites

- Plans 01–12 are implemented.
- A Supabase project, Vercel project, managed container host, and GitHub
  repository environments are available.
- This plan owns environment configuration; later plans must not introduce a
  second database, identity provider, or object store.

## Required configuration

- Vercel hosts only `apps/web`; it receives `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_URL`.
- Supabase owns Auth, PostgreSQL, and all private Storage buckets. Service-role
  credentials are server-only and must never appear in browser variables.
- The API container receives `DATABASE_URL`, Supabase server credentials,
  `AI_SERVICE_URL`, `AI_SERVICE_TOKEN`, allowed web origin, and log level.
- The AI container receives `OPENAI_API_KEY`, `AI_MODE`, `AI_SERVICE_TOKEN`,
  and log level. The API authenticates every API-to-AI request with the token.
- Set production CORS to the deployed web origin only. Development origins are
  configured separately, never appended to production by default.
- Keep `GET /health` endpoints unauthenticated and free of private data. They
  must return a non-2xx response when a required dependency is unavailable.

## Implementation sequence

1. Document each environment variable, its owner, whether it is browser-safe,
   and where it is configured. Remove obsolete Clerk and Railway assumptions.
2. Configure private Supabase Storage buckets and policies for existing session
   photos; verify API-issued paths and signed reads work in production.
3. Configure deploy workflows: web deployment after build; API and AI image
   build, deploy, health check, then web release. A failed health check stops
   the release.
4. Run `prisma migrate deploy` against the target database before API startup.
   Seed only non-production environments. Never run reset or development
   migrations in production.
5. Add structured logs with timestamp, service, request ID, route, status,
   duration, and safe error code. Do not log bearer tokens, Supabase keys,
   email bodies, report inputs, or uploaded content.
6. Configure database backups, restore instructions, uptime checks, error
   alerts, and a documented rollback to the prior web deployment/container
   image.

## CI and verification

Required pull-request checks: shared package build, web/API type-check and
lint, web/API/AI tests, Prisma validation, and production builds. Required
release checks: container image build, migration validation, deployed health
checks, and an authenticated smoke test.

The smoke test uses disposable test accounts to: sign in as a coach, create a
club/squad/session, publish it, sign in as an athlete, save a rep time, and
read the result. It must clean up only its uniquely named test data.

## Acceptance criteria

- All three services are hosted and independently healthy.
- The complete MVP flow succeeds using production configuration.
- A failed deployment is detectable and can be rolled back without data loss.
- Secrets stay server-side and logs do not contain sensitive data.
- A database restore procedure has been tested in a non-production environment.

## Tests

- Environment validation tests for missing required variables.
- Authenticated production-like smoke test.
- API-to-AI invalid-token test.
- Storage policy tests for authorized, cross-club, and expired signed URLs.
- Deployment failure and rollback checklist rehearsal.

## Out of scope

New product modules, billing, multi-region hosting, automatic scaling policy,
and a new monitoring vendor beyond the existing hosting capabilities.
