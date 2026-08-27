# Deployment

Deployment automation is defined in `.github/workflows`. The repository-side
environment check is:

```bash
npm run verify:environment
```

For the release sequence, environment ownership, rollback, backups, restore,
and manual console actions, see
[docs/production-operations.md](docs/production-operations.md).

## Workflows

- `test.yml` checks formatting, lint, type-check, tests, Prisma validation, and
  production web/API builds on pull requests and default-branch pushes.
- `build.yml` builds all service images and publishes immutable SHA tags to
  GHCR for non-pull-request builds.
- `deploy.yml` is manually dispatched for `staging` or `production`. It
  validates Prisma, runs `prisma migrate deploy`, deploys API and AI, requires
  both health checks, then deploys and checks web.

The release workflow uses generic, environment-scoped deploy hooks and health
URLs. No provider credentials are committed. Configure branch protection and
production approvals in GitHub as a manual owner action.
