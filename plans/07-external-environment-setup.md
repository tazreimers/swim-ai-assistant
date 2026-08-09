# External Environment and Release Setup

> **Deferred:** Current development uses Docker and local PostgreSQL. Do not
> configure Railway or Vercel yet. Resume this plan when a Docker-capable
> environment and hosted deployment credentials are available.

## Objective

Complete the repository configuration and external service setup required to
verify the database and CI/CD plans in real environments.

## Scope

- Configure GitHub Actions permissions, secrets, environments, and protection
- Configure GHCR image publishing
- Start and verify the local PostgreSQL environment
- Apply Prisma migrations and seed data
- Configure Railway PostgreSQL, API, and AI services
- Configure Vercel for the Next.js application
- Configure Clerk keys in each environment
- Run end-to-end release verification

## Prerequisites

- Access to the GitHub repository settings
- A Clerk application with development and production keys
- A Railway account and project
- A Vercel account and project
- Docker installed and running locally
- The repository checked out on the deployment branch

## Step 1: Configure local PostgreSQL

1. Copy the environment template to the local environment file.
2. Confirm `DATABASE_URL` points to the Docker PostgreSQL service.
3. Run the repository-side prerequisite check:

   ```bash
   npm run verify:environment
   ```

4. Start PostgreSQL:

   ```bash
   docker compose up -d postgres
   ```

5. Apply migrations and seed development data:

   ```bash
   npm run db:migrate
   npm run db:seed
   ```

6. Verify the data with Prisma Studio:

   ```bash
   cd apps/api
   npx prisma studio
   ```

7. Record the migration and seed commands as passing in
   `plans/PROGRESS.md`.

## Step 2: Configure GitHub Actions

1. In repository **Settings > Actions > General**, allow the repository
   workflows to run and allow `GITHUB_TOKEN` to write packages.
2. Create the `staging` and `production` GitHub environments.
3. Add required reviewers to the `production` environment.
4. Add these secrets to the appropriate environment:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `RAILWAY_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
   - `VERCEL_TOKEN`

5. Configure branch protection for `main`:

   - Require pull requests before merging.
   - Require the `Test / Lint, type-check, and test` status check.
   - Require branches to be up to date.
   - Block force pushes and branch deletion.

6. Open a test pull request and verify that `test.yml` runs.
7. Push to a non-production branch and verify `build.yml` builds images without
   publishing them.
8. Push to `main` and verify images are published to GHCR with the commit SHA.

## Step 3: Configure Railway (deferred)

1. Create a Railway project with PostgreSQL, API, and AI services.
2. Configure the API service to use `apps/api/Dockerfile`.
3. Configure the AI service to use `apps/ai/Dockerfile`.
4. Set API environment variables:

   - `DATABASE_URL` from the Railway PostgreSQL service
   - `CLERK_SECRET_KEY`
   - `NODE_ENV=production`
   - `PORT=3001`

5. Set AI environment variables:

   - `API_URL` pointing to the Railway API service
   - `ENVIRONMENT=production`

6. Configure health checks for `/health` on the API and AI services.
7. Deploy the initial version and verify service logs.
8. Run `prisma migrate deploy` against the Railway database before enabling
   production traffic.
9. Configure Railway backups and test a restore into a non-production database.

## Step 4: Configure Vercel (deferred)

1. Create or link a Vercel project to `apps/web`.
2. Configure the build command as `npm run build`.
3. Configure the output and install settings for the Next.js application.
4. Set environment variables:

   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_API_URL` pointing to the Railway API
   - `NODE_ENV=production`

5. Configure preview and production domains.
6. Deploy a preview and verify sign-in, sign-up, dashboard routing, and logout.

## Step 5: Configure Clerk production settings (deferred)

1. Configure the development instance for local and preview environments.
2. Configure the production instance for production.
3. Enable email/password and any selected social sign-in providers.
4. Add approved domains and redirect URLs for local, preview, and production.
5. Confirm the API receives valid bearer tokens from the web application.
6. Keep Clerk secret keys only in local ignored files and hosted environment
   settings.

## Step 6: Release verification (deferred)

Verify all of the following:

- A pull request runs lint, type-checking, and tests.
- A push builds all service images.
- Images are tagged with the commit SHA in GHCR.
- Local migrations apply successfully.
- Local seed data is repeatable.
- Railway API responds at `/health`.
- Railway AI service responds at `/health`.
- Vercel can sign users in and route them to `/dashboard`.
- Authenticated API requests succeed at `/user/me`.
- Production deployment requires environment approval.
- No credentials appear in Git history, workflow logs, or build artifacts.

## Completion criteria

Mark this plan complete only after the external settings and release checks
above have been performed and documented in `plans/PROGRESS.md`.
