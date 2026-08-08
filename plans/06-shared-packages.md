# Shared Packages

## Objective
Create shared TypeScript packages for types, utilities, and constants used across frontend and backend.

## Scope (MVP Infrastructure)
- `@swim/shared` package with TypeScript-only exports
- Shared type definitions (User, Coach, Athlete, Team, Workout, Session)
- Shared API response/error types
- Common validation schemas (Zod)
- Environment constants
- Utility functions (date formatting, calculations)
- No external dependencies beyond types and validation

## Deliverables
- `packages/shared/src/types/` - Core domain types
- `packages/shared/src/schemas/` - Zod validation schemas
- `packages/shared/src/constants/` - Shared enums and constants
- `packages/shared/src/utils/` - Helper functions
- TypeScript configuration (tsconfig.json)
- ESM and CommonJS build outputs
- README documenting exports
- Package exports in package.json

## Success Criteria
- Frontend and API can import types from `@swim/shared`
- Validation schemas work in both environments
- No circular dependencies
- Tree-shakeable exports (only imported code bundled)
- Types remain up-to-date with schema changes
- Easy to extend with new entities
- Zero runtime dependencies
