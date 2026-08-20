# Plan 15: Calendar, Season Planning, and Workout Templates

## AI implementation prompt

Extend the current session workflow with reusable coach planning. Keep the
existing `Session` and its draft/published/completed lifecycle authoritative;
templates and calendar events must create or schedule sessions, not bypass
their validation or publishing rules.

## Objective

Let coaches plan weeks and seasons, reuse workouts, and prescribe controlled
individual modifications without affecting the squad's base session.

## Data model

- Add `TrainingBlock`: club, squad, title, objective, start/end date, optional
  target competition, display colour, archive state, and creator.
- Add `WorkoutTemplate` and ordered `WorkoutTemplateSet`: club, title,
  session type, notes, main-set fields, version, archive state, creator.
- Add `SessionAthleteModification`: session, athlete user, main-set position,
  optional replacement stroke/distance/repetitions/send-off/notes, author,
  and timestamps. Enforce one modification per session/athlete/set position.
- Templates are copied into sessions when scheduled. Editing a template
  increments its version and never changes an already-created session.
- Validate `startDate <= endDate`; only one active colour value is stored as a
  theme token name, not arbitrary CSS.

## API surface

- `GET /clubs/:clubId/calendar?from=YYYY-MM-DD&to=YYYY-MM-DD&squadId=`
- `POST/PATCH/DELETE /training-blocks/:blockId`
- `GET/POST/PATCH/DELETE /workout-templates`
- `POST /workout-templates/:templateId/schedule`
- `GET/PUT/DELETE /sessions/:sessionId/athletes/:athleteId/modifications`

Calendar ranges are inclusive, limited to 93 days, and return blocks plus
non-archived sessions in stable date/time/id order. Template scheduling creates
one DRAFT session using existing session DTO validation. Coaches/owners act
within their club; athletes only receive resolved session data through existing
athlete session reads.

## Frontend

- `/coach/calendar` provides month, week, and agenda views with the same query
  data; the agenda is the accessible text alternative.
- `/coach/templates` lists, creates, edits, archives, and schedules templates.
- Add a “Save as template” action to the existing draft session editor.
- Add an athlete-modification editor from a session detail page. Show base and
  resolved fields side by side; warn before replacing a value.
- Use native date inputs or existing MUI controls, never add a calendar library
  solely for display. Provide loading, no-sessions, invalid-range, and API-error
  states.

## Implementation sequence

1. Add schema, migration, DTOs, and reusable date-range validation.
2. Build template service first, then schedule-from-template using the existing
   session service instead of duplicate session creation logic.
3. Add a resolved-session read helper used by athlete session endpoints.
4. Implement typed web clients, calendar, template, and modification screens.
5. Add server-side range/filter indexes and query tests.

## Acceptance criteria

- A coach creates a two-week block and schedules a session from a template.
- Updating a template leaves prior scheduled sessions unchanged.
- An athlete sees their approved modified prescription, while other athletes
  see the base session.
- No modification can change a published session for an unauthorized athlete.

## Tests

- Template version/copy, range limits, resolved-session, and uniqueness tests.
- Coach/athlete/cross-club modification authorization tests.
- Calendar keyboard navigation, agenda fallback, mobile layout, and validation
  tests.

## Out of scope

Drag-and-drop scheduling, recurring rules, automatic periodization, meet
management, or AI-generated templates; AI drafting is plan 20.
