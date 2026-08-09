# Deployment

The CI/CD workflows live in `.github/workflows`.

Run the repository-side prerequisite check with:

```bash
npm run verify:environment
```

This checks local environment-file names, workflow presence, and Docker daemon
availability without printing secret values. It cannot verify hosted account
settings or GitHub repository permissions.

## Workflow behavior

- `test.yml` runs on pull requests and pushes to `main` or `develop`.
- `build.yml` builds all three service images, publishes non-PR builds to GHCR,
  tags images with the commit SHA, and uses GitHub Actions layer caching.
- `deploy.yml` is manually dispatched with either `staging` or `production`.
  GitHub environment protection rules can require approval for production.

## Required GitHub configuration

Configure these repository or environment secrets before using deployment:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `RAILWAY_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `VERCEL_TOKEN`

Railway and Vercel deployment configuration is retained for later use but is
not required for current local development. Configure hosted secrets in their
environment settings rather than committing them to the repository.

Enable branch protection on `main` and require the `Test / Lint, type-check,
and test` check before merging. Add required reviewers to the `production`
GitHub environment to enable the manual approval gate.

## Deferred external setup

These actions require account or repository-owner access and are intentionally
deferred while development uses Docker locally:

- Start Docker Desktop and run the local PostgreSQL migration and seed commands.
- Create GitHub environments, secrets, package permissions, and branch rules.
- Create Railway services, add production variables, configure backups, and
  verify deployments.
- Create the Vercel project, domains, variables, and preview deployment.
- Configure Clerk domains, redirect URLs, and production credentials.
