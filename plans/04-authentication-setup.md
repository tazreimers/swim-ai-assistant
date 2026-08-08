# Authentication Setup

## Objective
Implement secure, scalable authentication using Clerk that works across Next.js frontend and NestJS backend.

## Scope (MVP Infrastructure)
- Clerk integration in Next.js app (middleware, hooks, UI components)
- Clerk JWT verification in NestJS API
- Protected API routes using guard middleware
- User context propagation from frontend to backend
- Session management and logout
- Role/permission foundation for future use
- Secure environment variable configuration

## Deliverables
- Clerk account and application setup
- Next.js Clerk integration with middleware
- Clerk sign-in/sign-up components (shadcn/ui compatible)
- NestJS @clerk/backend package integration
- JWT verification guard in NestJS
- API middleware to extract user from JWT
- Protected example endpoint on API
- TypeScript types for authenticated requests
- .env files configured with Clerk keys

## Success Criteria
- User can sign up and log in via Clerk UI
- Authenticated users see dashboard
- Unauthenticated users redirect to sign-in
- API verifies JWT on protected endpoints
- User ID and metadata available in API context
- Session persists across page reloads
- Logout clears session properly
