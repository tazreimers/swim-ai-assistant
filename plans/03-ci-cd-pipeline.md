# CI/CD Pipeline

## Objective
Establish automated testing, building, and deployment pipeline using GitHub Actions for all environments.

## Scope (MVP Infrastructure)
- GitHub Actions workflows for push to main/develop
- Linting and type checking on all PRs
- Docker image build and push to registry (for API and AI)
- Automated tests run on pull requests
- Deployment triggers to staging and production
- Environment variable management via GitHub Secrets
- Build caching for faster CI runs

## Deliverables
- `.github/workflows/test.yml` - Lint, type-check, and unit tests
- `.github/workflows/build.yml` - Docker image builds
- `.github/workflows/deploy.yml` - Release hooks for managed containers and Vercel
- Deployment configuration files for staging and production
- GitHub Secrets configured (DATABASE_URL, API_KEYS, etc.)
- Branch protection rules on main (require passing checks)

## Success Criteria
- PR triggers automated test suite
- All linting and type errors caught before merge
- Docker images tagged with commit SHA and pushed to registry
- Merging to main automatically deploys to staging
- Manual approval step for production deployment
- CI pipeline completes in under 15 minutes
