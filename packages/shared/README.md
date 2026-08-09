# @swim/shared

Shared TypeScript types, validation schemas, constants, and utilities for the Swim AI platform.

## Purpose

This package provides type-safe, reusable code that works across both the Next.js frontend (`@swim/web`) and NestJS backend (`@swim/api`).

## Structure

- **types/** - Core domain types (User, Coach, Athlete, Team, Workout, Session)
- **schemas/** - Zod validation schemas for runtime validation
- **constants/** - Shared enums and configuration constants
- **utils/** - Helper functions (date formatting, calculations, etc.)

## Usage

### Import types
```typescript
import { User, Coach, Athlete } from '@swim/shared/types';
```

### Use validation schemas
```typescript
import { userSchema, coachSchema } from '@swim/shared/schemas';

const user = userSchema.parse(data);
```

### Use constants
```typescript
import { SWIM_STROKES, POOL_SIZES } from '@swim/shared/constants';
```

### Use utilities
```typescript
import { formatDate, calculateTotalDistance } from '@swim/shared/utils';
```

The package exposes both ESM and CommonJS builds:

- `@swim/shared` - all public exports
- `@swim/shared/types` - type declarations
- `@swim/shared/schemas` - Zod schemas
- `@swim/shared/constants` - domain constants
- `@swim/shared/utils` - pure utility functions

## Adding New Exports

1. Create your type/schema/constant in the appropriate directory
2. Re-export from `src/index.ts`
3. Update this README with usage examples
4. Run `npm run build` to generate ESM, CommonJS, and declaration output

## Dependencies

- **zod** - Runtime type validation
- **typescript** - Type definitions and compilation

## Build

```bash
pnpm build      # Compile TypeScript to dist/
pnpm type-check # Check types without emitting files
pnpm clean      # Remove dist/ directory
```
