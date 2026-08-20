# Plan 14: AthleteOS360 Profiles and Scoped Support Access

## AI implementation prompt

Create a club-scoped athlete profile that connects existing Swim AI records
without duplicating them. Add one non-clinical `SUPPORT` role and explicit
per-athlete grants. API authorization is authoritative; the UI must never
reveal data solely because a navigation item is visible.

## Objective

Give coaches one place to understand an athlete while safely enabling approved
support staff to contribute restricted, non-clinical observations.

## Data model

- Add `SUPPORT` to `ClubRole`.
- Add `AthleteProfile` keyed by `userId`; it stores preferred name, pronouns,
  date of birth only if the club requires it, primary strokes, distance focus,
  and profile-completion timestamp. It must not duplicate email or club role.
- Add `AthleteGoal`: athlete, author, title, optional target date, status
  (`ACTIVE`, `COMPLETED`, `ARCHIVED`), and timestamps.
- Add `AthleteObservation`: athlete, author, category, text, visibility
  (`COACHES_ONLY`, `ATHLETE_VISIBLE`), created/updated timestamps.
- Add `AthleteAccessGrant`: athlete, support user, granted-by user, scope
  (`PROFILE`, `WELLNESS`, `SUPPORT_NOTES`), granted/revoked timestamps. Enforce
  one active grant per athlete/support user/scope with a partial uniqueness
  rule or an application transaction that prevents duplicates.
- New records use the athlete's club membership. Do not use legacy `Coach`,
  `Team`, or `Athlete.coachId` relations for new authorization decisions.

## Authorization rules

- Owners/coaches can read and edit all club athletes, goals, observations, and
  grants.
- Athletes can read their own profile, goals, and `ATHLETE_VISIBLE`
  observations; they edit only their permitted profile fields and goals.
- Support users can read only athletes with an active matching grant. They may
  create support notes only when granted `SUPPORT_NOTES`.
- Grant revocation takes effect immediately for reads and writes.
- No role may access another club's athlete, including by guessed UUID.

## API surface

- `GET/PATCH /athletes/:athleteId/profile`
- `GET/POST/PATCH /athletes/:athleteId/goals`
- `GET/POST/PATCH /athletes/:athleteId/observations`
- `GET/POST/DELETE /athletes/:athleteId/access-grants`
- `GET /athletes/me/profile`
- `GET /support/athletes`

Use shared DTO schemas. PATCH requests accept only explicitly allowed fields;
reject unknown fields and blank required text. Paginate observations newest
first with a bounded page size.

## Frontend

- Coach routes: `/coach/athletes`, `/coach/athletes/[athleteId]`, and
  `/coach/athletes/[athleteId]/access`.
- Athlete route: `/athlete/profile`.
- Support route: `/support/athletes` and `/support/athletes/[athleteId]`.
- The profile page is a summary plus tabs/sections for goals, observations,
  sessions, results, AI reports, and later wellness/race data. Linked sections
  display existing records rather than copying them into the profile table.
- Use MUI forms, labelled controls, inline validation, empty states, skeletons,
  and clear revoked/forbidden messages. The profile remains usable at 320px.

## Implementation sequence

1. Add Prisma models/enums, migration, indexes, and seed examples.
2. Add shared schemas/types, then NestJS profile and access-grant module.
3. Centralize the `requireAthleteAccess` authorization helper; all later plans
   reuse it rather than adding role checks in controllers.
4. Build typed web API helpers and the coach/athlete/support pages.
5. Link existing session/result/AI report summaries into the profile read model.

## Acceptance criteria

- A coach can create goals and observations for a club athlete.
- An athlete sees only their own permitted profile data.
- A support user gains and loses access immediately with a grant change.
- Profile links expose existing training/results/AI records without copying or
  losing their source ownership.

## Tests

- Migration, unique-grant, visibility, pagination, and validation tests.
- Cross-club, athlete-to-athlete, support-without-grant, and revoked-grant API
  authorization tests.
- Responsive and keyboard tests for profile editing and access-grant dialogs.

## Out of scope

Medical records, emergency contact details, named specialist roles, document
uploads, parent access, and changing historical session ownership.
