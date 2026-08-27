# Swim AI Engineering Instructions

Read this file before changing code, configuration, tests, or plans. If a
subdirectory later contains its own `AGENTS.md`, read this file first, then the
more specific file; the more specific instruction wins for that subtree.

## Repository map

- `apps/web` — Next.js App Router frontend using React, MUI, and Supabase.
- `apps/api` — NestJS REST API, Prisma, PostgreSQL, and Supabase token checks.
- `apps/ai` — FastAPI service for typed AI requests and responses.
- `packages/shared` — shared TypeScript schemas, types, constants, and utilities.
- `plans` — implementation-ready product plans and status tracking.

## Before changing code

1. Read the feature's route, API client, API controller/service, Prisma model,
   shared schema, and tests before choosing an implementation.
2. Search the repository for an existing component, helper, type, validation
   rule, or endpoint pattern before adding one.
3. Make the smallest change that solves the stated problem. Do not add a
   dependency, global state store, abstraction, or configuration for a
   hypothetical future need.
4. Keep authorization, validation, and persistence on the server. Browser code
   may improve navigation but never grants access.

## Required structure

- Organize frontend files by feature/domain. Keep a component, its hook, API
  helper, and tests together unless they are genuinely shared by sibling
  features.
- Do not create generic `utils`, `helpers`, `components`, or `types` folders
  for one file. Keep one-use functions in the file that uses them.
- Follow the nearest existing filename/import pattern. Use kebab-case for new
  non-framework files. Next.js route names and dynamic segments follow
  framework conventions.
- Controllers/routes validate and delegate; services own business rules;
  Prisma is accessed through services. Use a transaction for multi-row writes
  that must succeed or fail together.
- Define cross-service request/response contracts in `packages/shared` when
  both TypeScript services consume them. FastAPI must validate its own Pydantic
  boundary and never receive direct database access.

## TypeScript and Python standards

- Do not introduce `any`. Use `unknown` and narrow it, or define a real type.
- Avoid `as`, non-null assertions, and `@ts-ignore`/`@ts-expect-error`. A rare
  exception needs a one-line explanation beside the code.
- Use `===`/`!==`; `value == null` is allowed only when deliberately matching
  both `null` and `undefined`.
- Use braces for every control-flow body. Do not add nested ternaries.
- Prefer `async`/`await` to promise chains. Prefix an intentionally unawaited
  promise with `void` and ensure its error is safely handled.
- Do not leave commented-out code or debug `console.log` statements in changed
  files. Use the service's structured logging/error path instead.
- Python code uses type hints, Pydantic models for external payloads, explicit
  network timeouts, and safe error logging. Never log tokens or raw private
  athlete data.

## Frontend and MUI standards

- Use MUI and the existing theme; do not introduce Tailwind, shadcn, a CSS
  framework, Redux, or another global state library without an approved plan.
- Use semantic MUI palette roles and numeric spacing/radius tokens. Do not add
  hard-coded hex colours or arbitrary pixel spacing unless a nearby comment
  explains an unavoidable visual exception.
- Reuse existing loading, empty, error, form, and API-client patterns. Do not
  use browser `alert`; show actionable inline feedback or MUI feedback.
- Every form control has a programmatic label. Dialogs manage focus. Meaningful
  status is conveyed by text/icon as well as colour. Charts and media have a
  text or table alternative.
- Add a concise comment immediately above each new `useEffect` stating what it
  synchronizes or subscribes to. Prefer derived state and event handlers when
  an effect is unnecessary.
- Keep React components under 500 lines. Split by a coherent local feature,
  not into speculative micro-components.

## API, data, and AI safety

- Validate all untrusted input, use bounded page/range limits, and enforce
  club/athlete object authorization on every read and write.
- Use private storage only. Server-issued upload paths, MIME/size checks, and
  short-lived signed read URLs are mandatory for uploaded content.
- Treat AI output as untrusted: validate structured output, keep credentials
  server-side, state uncertainty, cite supplied facts, and require human
  approval before any mutation. AI does not diagnose medical conditions.
- New schema changes include a Prisma migration, relevant indexes/uniqueness
  constraints, safe migration notes, and a rollback/data-recovery consideration.

## Quality gate

Run the narrowest relevant checks after every change and report anything that
cannot run. Before a pull request, run all checks affected by the change:

```bash
npm run build --prefix packages/shared
npm run type-check --prefix packages/shared
npm run lint --prefix apps/web
npm run type-check --prefix apps/web
npm run lint --prefix apps/api
npm run type-check --prefix apps/api
npm test --prefix apps/api -- --runInBand --passWithNoTests
```

For AI-service changes, run `pytest` from `apps/ai` in its configured Python
environment. For database changes, run Prisma validation and the focused
migration/test path; never reset a shared or production database. Format only
changed files with the repository Prettier configuration before committing.

Do not weaken lint/type-check/test rules, skip CI, commit generated build
artifacts, or use auto-fix across unrelated files to make a check pass. A
necessary rule exception must be local, documented, and covered by a test when
it changes behavior.

## Progress tracking

`plans/PROGRESS.md` is the single source of truth for implementation status,
completed work, blockers, and next steps. Read it before starting a task and
update it when a plan materially changes.
