# Plan 08: Frontend Design System and Supabase Authentication

## AI implementation prompt

Implement the Swim AI frontend foundation for the MVP. Migrate the existing
Clerk/Tailwind direction to Supabase Auth and make MUI the primary React
component and styling system. Preserve the Next.js App Router and the NestJS
API boundary.

## Objective

Create a polished, accessible application shell that supports coach and
athlete authentication, role-aware navigation, password reset, protected
routes, API session propagation, and a consistent soft pastel blue/green
visual language.

## Scope

- Supabase browser and server auth clients.
- Sign up, sign in, sign out, password reset, and session refresh.
- Auth callback and protected route handling.
- User role/profile bootstrap through the API.
- MUI theme, typography, spacing, surfaces, forms, feedback, navigation, and
  responsive breakpoints.
- Replace Clerk components/imports and stop adding Tailwind/shadcn UI.
- Loading, empty, validation, network-error, and unauthorized states.

## Dependencies

- Plans 01, 04, 05, and 06 infrastructure.
- Supabase project, redirect URLs, auth providers, and environment variables
  configured externally.

## Implementation sequence

1. Add MUI, Emotion, Supabase, and test dependencies using the repository's
   package manager.
2. Create typed Supabase client helpers for browser, server, and middleware
   usage.
3. Replace Clerk provider, middleware, sign-in, sign-up, and dashboard auth
   flows.
4. Add an API client that sends the Supabase access token and normalizes API
   errors.
5. Add the application shell and role-aware navigation.
6. Add the MUI theme and reusable form/feedback/layout primitives.
7. Remove obsolete Clerk/Tailwind usage after all imports and environment
   references are migrated.

## Required routes and components

- `/`, `/sign-in`, `/sign-up`, `/auth/callback`, `/forgot-password`,
  `/reset-password`.
- Protected `/dashboard` with coach and athlete variants.
- `AppShell`, `TopBar`, `SideNav`, `MobileNav`, `RoleGuard`,
  `LoadingState`, `ErrorState`, `EmptyState`, and form field wrappers.

## Theme direction

- Primary colors: calm ocean blue and teal/green.
- Supporting colors: pale blue, mint, seafoam, warm neutral surfaces.
- Use sufficient contrast for text, buttons, focus rings, charts, and status
  indicators.
- Prefer rounded but restrained cards, clear hierarchy, generous spacing, and
  dense data tables only where useful.
- Centralize tokens in the MUI theme; do not scatter hex values through pages.

## API and security requirements

- Never expose the Supabase service-role key to the browser.
- Send access tokens only over configured API URLs.
- Handle expired sessions by refreshing or redirecting to sign-in.
- Treat role and club membership returned by the API as authoritative.
- Do not rely on client-side route hiding for authorization.

## Acceptance criteria

- A user can sign up, sign in, sign out, and complete password reset.
- Authenticated sessions survive reloads and protect application routes.
- Coach and athlete navigation are different and role-appropriate.
- API requests include a valid bearer token.
- The UI is responsive and keyboard accessible.
- No new MVP UI uses Tailwind or shadcn components.
- Auth and theme errors are visible and actionable.

## Tests

- Supabase client/session refresh unit tests.
- Protected-route and role-navigation tests.
- Form validation and password-reset flow tests.
- Visual smoke tests for desktop/mobile shell states.
- Accessibility checks for forms, dialogs, navigation, and focus order.

## Out of scope

- Club/squad domain workflows.
- Session authoring or athlete results.
- Billing, messaging, mobile apps, or social login providers beyond the
  configured MVP requirements.

