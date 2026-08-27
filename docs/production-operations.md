# Production operations

Plan 13 uses Supabase for Auth, PostgreSQL, and private Storage; Vercel for
`apps/web`; and independently managed containers for `apps/api` and `apps/ai`.
The repository does not contain provider credentials or deploy hooks.

## Environment variables

| Variable                                                                  | Owner  | Browser-safe | Configuration                                 |
| ------------------------------------------------------------------------- | ------ | ------------ | --------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                                                | Web    | Yes          | Vercel and web image build                    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Web    | Yes          | Vercel and web image build                    |
| `NEXT_PUBLIC_API_URL`                                                     | Web    | Yes          | Vercel                                        |
| `DATABASE_URL`                                                            | API    | No           | API container and release migration job       |
| `SUPABASE_URL`                                                            | API    | No           | API container                                 |
| `SUPABASE_ANON_KEY`                                                       | API    | No           | API container                                 |
| `SUPABASE_SERVICE_ROLE_KEY`                                               | API    | No           | API container only; never expose to the web   |
| `SUPABASE_SESSION_PHOTOS_BUCKET`                                          | API    | No           | API container; defaults to `session-photos`   |
| `FRONTEND_URL`                                                            | API/AI | No           | API CORS and AI service configuration         |
| `AI_SERVICE_URL`                                                          | API    | No           | API container                                 |
| `AI_SERVICE_TOKEN`                                                        | API/AI | No           | Both containers; use the same generated value |
| `AI_MODE`                                                                 | AI     | No           | AI container (`mock` only outside production) |
| `OPENAI_API_KEY`                                                          | AI     | No           | AI container when `AI_MODE=openai`            |
| `OPENAI_MODEL`                                                            | AI     | No           | AI container                                  |
| `PORT`                                                                    | API    | No           | API container                                 |
| `LOG_LEVEL`                                                               | API/AI | No           | Container runtime                             |
| `NODE_ENV` / `ENVIRONMENT`                                                | API/AI | No           | Set to `production` for release               |

Production API startup fails when its required configuration is missing.
`GET /health` is unauthenticated and returns only service status; it returns
503 when the API database check fails. The AI health endpoint returns 503 when
production token or OpenAI configuration is missing.

The release workflow also requires environment-scoped GitHub secrets
`API_DEPLOY_HOOK`, `AI_DEPLOY_HOOK`, `WEB_DEPLOY_HOOK`, `API_HEALTH_URL`,
`AI_HEALTH_URL`, and `WEB_HEALTH_URL`. These are operator-owned endpoints, are
never browser-safe, and must be configured manually for each deployment
environment.

## Supabase Storage

Create a private bucket named `session-photos`. Do not enable public access.
The API uses a server-issued path scoped to the session, signed upload URLs,
and one-hour signed read URLs. Configure Storage policies so browser clients
cannot list or read the bucket directly; access is through the authenticated
API only. Verify an authorized club member can upload/read, a different club
cannot read, and an expired URL is rejected.

## Release and migration procedure

1. Merge a change only after the required CI checks pass.
2. Dispatch `.github/workflows/deploy.yml` for the protected `staging` or
   `production` environment.
3. The workflow validates Prisma, publishes immutable SHA-tagged images, runs
   `prisma migrate deploy`, deploys API and AI through configured hooks, and
   waits for both health checks.
4. Web deployment runs only after API and AI health checks succeed, then its
   health check is required.
5. Run the authenticated smoke test with disposable, uniquely named accounts
   and data: coach sign-in, club/squad/session creation and publish, athlete
   sign-in, rep save, and result read. Remove only that test data.

Never run `prisma migrate reset`, `prisma migrate dev`, or seed commands in
production. Seed data is for local and non-production environments only.

## Rollback

Stop the release if any image deployment or health check fails. Redeploy the
previous known-good web deployment and API/AI image tags through the hosting
console or deployment hooks. Do not roll back database migrations by deleting
data; restore the prior application first, then use a reviewed forward
migration or database restore if required. Record the failed SHA, health
response, and recovery time.

## Backups and restore rehearsal

Enable automated Supabase database backups and retention in the project
console. Keep an additional encrypted logical backup in private backup
storage with restricted access and expiration:

```bash
pg_dump "$DATABASE_URL" --format=custom --file="swim-ai-$(date +%Y%m%d).dump"
pg_restore --clean --if-exists --dbname="$RESTORE_DATABASE_URL" swim-ai-YYYYMMDD.dump
```

Restore only into a separate non-production database, run `prisma migrate
deploy`, and verify the authenticated smoke flow before considering the
rehearsal successful. Never restore over production without an approved
incident procedure.

## Manual blockers

Repository automation cannot create or verify Supabase, Vercel, container-host,
GitHub environment, branch-protection, backup-retention, uptime-monitor, alert,
Storage-policy, or redirect settings. An owner must configure those consoles,
populate environment-scoped variables and deploy hooks, require the CI check
on the default branch, and complete the non-production restore and smoke-test
rehearsals.
