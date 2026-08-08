# Monorepo Setup

## Objective
Create a production-ready monorepo structure using Turborepo that organizes frontend, API, AI service, and shared packages.

## Scope (MVP Infrastructure)
- Use Turborepo with pnpm workspaces
- Establish 4 core packages: `@swim/web` (Next.js), `@swim/api` (NestJS), `@swim/ai` (FastAPI), `@swim/shared`
- Configure TypeScript for web and api packages
- Set up root-level scripts for dev, build, and test
- Ensure isolated node_modules with pnpm

## Deliverables
- Root package.json with workspaces and shared dependencies
- turbo.json configuration with build cache
- Separate directories: `apps/web`, `apps/api`, `apps/ai`, `packages/shared`
- README in each package explaining its purpose
- .gitignore configured for monorepo
- pnpm-workspace.yaml configured

## Success Criteria
- `pnpm install` installs all workspaces
- `pnpm run dev` starts all dev servers concurrently
- `pnpm run build` builds all packages
- Cross-package imports work (e.g., `@swim/shared` types in web and api)
