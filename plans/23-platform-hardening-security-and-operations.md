# Plan 23: Platform Hardening, Security, and Operations

## AI implementation prompt

Harden the completed pilot-release features before launch. Prefer shared guards,
validation, policies, and observability over route-by-route patches. Do not add
unneeded frameworks or a second identity/logging system.

## Objective

Confirm that authorized data stays private, ordinary failures are visible and
recoverable, and operators can detect, diagnose, and safely respond to issues.

## Security and privacy work

- Audit every API route for authentication, club membership, scoped athlete
  access grant, ownership, and object-level authorization. Add a route matrix
  to this plan’s implementation record.
- Apply rate limits to signed uploads, CSV validation/confirm, AI reports,
  streaming chat, workout drafting, and feedback. Limits are per authenticated
  user and route family; return `429` with `Retry-After` and a friendly UI
  message.
- Add immutable `AuditEvent` records for membership/grant changes, import
  confirmation, profile visibility change, AI draft application, session
  publication, and deletion request. Store actor, club, resource type/ID,
  action, safe metadata, request ID, and timestamp—never raw private content.
- Define and implement data export/deletion requests, AI conversation retention,
  raw-media retention, and the 30-day soft-delete recovery window. Deletions
  must remove or revoke associated private-storage objects.

## Reliability and observability

- Propagate a request ID from web → API → AI; include it in structured logs and
  safe client-facing errors.
- Record route latency, status, AI model/cost/latency, import totals, upload
  failure class, and background cleanup success. Never record credentials or
  raw AI prompts containing athlete data.
- Configure service uptime/error alerts, database connection alert, elevated
  `5xx` alert, failed-migration alert, storage upload failure alert, and AI
  error/cost threshold alerts.
- Document incident severity, alert owner, first-response target, data restore,
  secret rotation, and deployment rollback steps.

## Accessibility and performance

- Review every new route at 320px, tablet, and desktop sizes; keyboard-only and
  screen-reader flows are required for forms, dialogs, chat, imports, charts,
  player annotations, and navigation.
- Require labelled controls, managed focus after dialog/open/error changes,
  text/table alternatives for charts/media, and status meaning beyond colour.
- Review indexes and query plans for roster, calendar, profile timeline,
  import, chat-history, and decision-workspace queries. Bound every list/range
  endpoint and add cursor pagination for growing datasets.

## Acceptance criteria

- The route matrix has an authorization regression test for every sensitive
  resource and cross-club access is impossible in tests.
- Operators can trace a user-visible error to an API/AI request ID without
  accessing sensitive content.
- Critical alerts, backup restore, secret rotation, and rollback are rehearsed
  in a non-production environment.
- Release features meet the documented accessibility checklist.

## Tests

- Authorization matrix, rate-limit, audit-event, retention, and delete/revoke
  tests.
- Request-ID propagation, safe-log redaction, alert simulation, and restore
  rehearsal tests/checklists.
- Responsive/keyboard/screen-reader regression suite and representative query
  performance checks.

## Out of scope

Formal clinical certification, payment compliance, a data warehouse, global
multi-region disaster recovery, or a new observability vendor when the selected
hosting providers already supply the required capability.
