# Deployment

The CI/CD workflows live in `.github/workflows`.

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

Configure Clerk, database, and service secrets in the Railway and Vercel
environment settings rather than committing them to the repository.

Enable branch protection on `main` and require the `Test / Lint, type-check,
and test` check before merging. Add required reviewers to the `production`
GitHub environment to enable the manual approval gate.
