# Plan 24: Pilot Launch and Production Acceptance

## AI implementation prompt

Launch the completed product to a pilot club only after operational, security,
and role-based acceptance checks pass. This plan does not add product features;
it converts implemented features into a repeatable launch and support process.

## Objective

Allow one pilot club to complete a full operating week without developer help
for ordinary workflow, while giving operators clear success metrics and
rollback/support procedures.

## Pilot roles and onboarding

- Platform operator configures production, deploys, monitors, and handles
  incidents. This is not a normal club-facing role.
- Club owner creates the club and memberships; coach plans and runs training;
  athlete logs sessions/wellness; support user operates only with a grant.
- Create an onboarding checklist for each role using disposable demo accounts
  first, then pilot accounts. Do not seed real athlete data without club
  approval and documented consent.
- Provide one concise in-product or Markdown quick-start per role covering the
  exact release workflows and where to get support.

## Release gates

Do not begin pilot onboarding until all are true:

- Plan 13 hosted smoke test, database migration, backup/restore, and rollback
  checks pass.
- Plans 14–22 acceptance criteria and critical automated tests pass.
- Plan 23 authorization matrix, accessibility review, alerts, retention, and
  incident procedure pass.
- Production has no development credentials, public private-storage bucket,
  open CORS origin, or mock AI mode unless explicitly selected for a demo.
- Known limitations are published: non-clinical wellness, CSV-only competition
  import, manual video annotation, no direct messages, and coach approval for
  every AI draft.

## Manual acceptance scripts

Run and record the result of each script with actor, environment, timestamp,
request ID for failures, and evidence link:

1. Owner creates a club, invites coach/athlete/support user, creates a squad,
   and grants support access to exactly one athlete.
2. Coach completes profile/goals, creates a training block/template/session,
   adds an individual modification, publishes, records attendance, and posts a
   squad announcement.
3. Athlete reads the modified session, logs results, completes wellness, reads
   announcement, and verifies personal data only.
4. Coach imports a mixed-validity CSV, resolves errors, confirms valid rows,
   views PB/benchmark changes, and drills into the decision workspace.
5. Coach asks a grounded AI question, verifies citations, creates an AI workout
   draft, edits it, creates a DRAFT session, and publishes only after review.
6. Coach uploads/annotates/compares a race video; unrelated club member and
   ungranted support user are denied access.
7. Operator exercises a failed AI/upload/import response, verifies a safe UI
   error and traceable request ID, then performs a documented rollback drill.

## Pilot metrics and cadence

- Measure weekly active coaches/athletes, sessions published, result logging
  completion, attendance capture, wellness completion, CSV validation/confirm
  success, AI draft application, AI usefulness/actionability feedback, AI
  latency/cost, upload failures, API error rate, and weekly club retention.
- Review metrics and feedback weekly with the club. Record feature requests,
  bugs, workarounds, and whether each problem blocks normal club operation.
- Define launch success: one club completes two consecutive operating weeks;
  no unresolved critical security/data-loss incident; 80% of assigned athletes
  log at least one session; and coaches rate at least half of AI responses
  helpful or actionable.

## Operations and support

- Define severity: critical (privacy/data loss/outage), high (core workflow
  blocked), normal (workaround exists), and request (not a defect).
- Critical: acknowledge within one hour, pause risky deployments, preserve safe
  logs, notify club owner, and follow restore/rollback runbook. High: triage
  within one business day. Record all outcomes for plan 25.
- Publish release notes, known limitations, support route, maintenance window,
  and rollback owner before inviting real users.

## Acceptance criteria

- Every acceptance script passes using hosted production-like services.
- The pilot club completes its first operating week without ordinary-workflow
  developer intervention.
- Metrics, feedback, incidents, and unresolved issues are captured in a form
  usable by plan 25.
- A failure can be traced, contained, and communicated through the runbook.

## Out of scope

Scaling beyond the pilot cohort, marketing, billing, multi-sport expansion,
feature work requested during pilot, or changing success criteria mid-pilot.
