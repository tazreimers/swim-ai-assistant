# Database Setup

The MVP uses PostgreSQL with Prisma in `apps/api`.

## Local development

Start PostgreSQL through Docker Compose:

```bash
docker compose up -d postgres
```

The default host connection is:

```text
postgresql://swimuser:swimpass@localhost:5432/swim_db
```

Apply migrations and load development data:

```bash
npm run db:migrate
npm run db:seed
```

For a disposable local reset:

```bash
npm run db:reset
```

The API loads `apps/api/.env` when started directly. Docker Compose supplies
`DATABASE_URL` to the API container from the root `.env` file. Local
development intentionally uses `localhost:5432`; hosted database setup is
deferred until Docker is available.

## Prisma workflow

Create a migration after changing `apps/api/prisma/schema.prisma`:

```bash
cd apps/api
npx prisma migrate dev --name describe_change
npx prisma generate
```

Deploy committed migrations in CI or production:

```bash
npm run db:migrate
```

Prisma Client is exposed through the global `PrismaService` in
`apps/api/src/prisma`.

## Production database operations

Supabase owns the hosted PostgreSQL database. Keep `DATABASE_URL` server-only.
Production releases run `prisma migrate deploy` after image validation; never
run `prisma migrate reset`, `prisma migrate dev`, or seed commands in
production. Backup retention and the tested restore procedure are documented
in [docs/production-operations.md](docs/production-operations.md).
