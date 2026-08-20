# Swim AI Development Plans

These implementation-ready plans take Swim AI from its completed code MVP to a
hosted pilot-club operating system. Each plan is a self-contained handoff for a
developer or coding agent: it specifies the objective, scope, data/API/UI
contracts, authorization, tests, acceptance criteria, and exclusions.

## Implementation rules

- Reuse the existing Next.js App Router, React, MUI, Supabase, NestJS, Prisma,
  PostgreSQL, FastAPI, and shared package before adding dependencies.
- Keep UI components and typed API clients local to the feature. Do not add
  Tailwind, shadcn, Redux, or a global state framework for these plans.
- Validate untrusted requests with shared schemas at service boundaries. The
  API, not the browser, enforces authentication and authorization.
- Use private Supabase Storage, scoped upload paths, signed reads, MIME/size
  checks, and explicit retention for all uploads.
- AI can summarize and draft only. A human must explicitly approve every data
  mutation, and AI must not provide clinical advice.

## Completed MVP baseline (plans 01–12)

| Plan | Status | Summary |
|---|---|---|
| 01 | Complete | Turborepo monorepo foundation. |
| 02 | Complete | Docker development environment. |
| 03 | Complete | CI/CD configuration. |
| 04 | Superseded | Clerk authentication; replaced by plan 08. |
| 05 | Implemented | Prisma/PostgreSQL schema, migration, seed, and database service. |
| 06 | Complete | Shared TypeScript package. |
| 07 | Deferred | External environment/release setup; superseded in practice by plan 13. |
| 08 | Complete | MUI, Supabase Auth, application shell. |
| 09 | Complete | Clubs, memberships, invitations, and squads. |
| 10 | Complete | Sessions, publishing, whiteboard upload, athlete logging. |
| 11 | Complete | Results, dashboards, and progress metrics. |
| 12 | Implemented | Structured AI reports and MVP validation support. |

## Pilot production release (plans 13–24)

### Release foundation

1. [13. Production Foundation and Release Verification](./13-production-foundation-and-release-verification.md) — deploy and verify the existing MVP first. **Release blocker.**
2. [14. AthleteOS360 Profiles and Scoped Support Access](./14-athleteos360-profiles-and-support-access.md) — club athlete profiles, goals, observations, and secure support access.
3. [15. Calendar, Season Planning, and Workout Templates](./15-calendar-season-planning-and-workout-templates.md) — reusable planning built on existing sessions.
4. [16. Pool-Deck Operations, Attendance, and Announcements](./16-pool-deck-operations-attendance-and-announcements.md) — daily club workflow.
5. [17. Wellness, Readiness, and Support-Staff Hub](./17-wellness-readiness-and-support-staff-hub.md) — non-clinical wellbeing and collaboration.
6. [18. Competition History, PBs, Benchmarks, and CSV Import](./18-competition-history-pbs-benchmarks-and-csv-import.md) — audited performance-history foundation.

### AI and performance workflow

7. [19. Grounded Swim AI Coach Assistant](./19-grounded-swim-ai-coach-assistant.md) — persistent, cited, permission-aware chat.
8. [20. AI Workout Drafting and Fast Capture](./20-ai-workout-drafting-and-fast-capture.md) — approved drafts from chat, voice, and whiteboards.
9. [21. Unified Performance and Decision Workspace](./21-unified-performance-and-decision-workspace.md) — deterministic cross-feature views and cited AI explanations.
10. [22. Media and Race-Review Foundation](./22-media-and-race-review-foundation.md) — secure manual race-video review.

### Launch

11. [23. Platform Hardening, Security, and Operations](./23-platform-hardening-security-and-operations.md) — security, accessibility, observability, and recovery.
12. [24. Pilot Launch and Production Acceptance](./24-pilot-launch-and-production-acceptance.md) — release gates, role scripts, metrics, and support.

## After the pilot

13. [25. Evidence-Led Next-Release Planning](./25-evidence-led-next-release-planning.md) — create future plans from measured pilot evidence rather than assumptions.

## Dependency order

```text
01–12 MVP baseline
  └─ 13 Production verification
       └─ 14 Athlete profile and access grants
            ├─ 15 Planning and templates
            ├─ 16 Attendance and announcements
            ├─ 17 Wellness and support notes
            └─ 18 Competition import and benchmarks
                 └─ 19 Grounded assistant
                      └─ 20 AI workout drafts
                           └─ 21 Decision workspace
                                └─ 22 Race review foundation
                                     └─ 23 Hardening and operations
                                          └─ 24 Pilot launch
                                               └─ 25 Evidence-led planning
```

Plans 15–18 may run in parallel after plan 14 when separate developers own
their database migrations and coordinate before merge. Plans 19–22 start only
after the data/features they cite are available. Plan 23 reviews all release
features, and plan 24 begins only after plan 23 passes.
