# @swim/web

Next.js frontend application for the Swim AI coaching platform.

## Purpose

Web-first MVP providing coaches with a UI to manage athletes, teams, workouts, and training sessions. Uses React 18, Tailwind CSS, and Clerk for authentication.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **Auth**: Clerk
- **Types**: TypeScript 5+
- **Shared**: @swim/shared types and utilities

## Getting Started

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Type checking
pnpm type-check

# Linting
pnpm lint
```

Visit `http://localhost:3000` in development mode.

## Structure

- `app/` - Next.js App Router pages and components
- `components/` - Reusable React components
- `lib/` - Utilities and helpers
- `public/` - Static assets

## Key Features (MVP)

- User authentication via Clerk
- Dashboard shell
- Responsive mobile-first design
- Integration with @swim/api backend

## Environment Variables

See `.env.example` in the root for required environment variables.

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development

- Hot module reloading during development
- TypeScript strict mode enabled
- Linting with ESLint (Next.js preset)

## Building

```bash
pnpm build
```

Production-optimized build output goes to `.next/`.

## Deployment

Ready for deployment to Vercel (recommended) or any Node.js hosting.

- Environment variables configured via platform dashboard
- Automatic deployments on git push to main branch
