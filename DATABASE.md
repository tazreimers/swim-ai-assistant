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

## Future hosted database notes

Use Railway's private PostgreSQL connection string as `DATABASE_URL` and keep
it out of source control. Production deploys should run `prisma migrate deploy`
after the application image is built, never `prisma migrate reset`.

Railway provides automated PostgreSQL backups on supported plans. Configure
the retention policy in the Railway project settings and periodically test a
restore into a separate database. For an additional logical backup, run:

```bash
pg_dump "$DATABASE_URL" --format=custom --file=swim-ai-$(date +%Y%m%d).dump
```

Store dump files in private backup storage with restricted access and an
expiration policy.
