# Plan 18: Competition History, PBs, Benchmarks, and CSV Import

## AI implementation prompt

Implement an auditable competition-results workflow beginning with one
validated CSV format. Store individual results as the source of truth;
personal bests and charts are deterministic read models, not editable values.

## Objective

Let a coach import genuine competition results, see personal-best progression,
and compare athlete benchmarks without a timing-system integration.

## Data model

- Add `Competition`: club, name, start/end date, location optional, creator,
  and timestamps.
- Add `RaceResult`: club, athlete user, competition optional, event date,
  event name, stroke, distance metres, course type (`SCM`, `LCM`, `SCY`),
  time milliseconds, placing optional, notes optional, import job optional,
  source row key, timestamps. Unique `(clubId, sourceRowKey)` makes confirmed
  re-imports idempotent.
- Add `BenchmarkDefinition`: club, name, stroke, distance metres, course type
  optional, target milliseconds optional, active flag, creator.
- Add `AthleteBenchmarkResult`: benchmark, athlete user, date, time
  milliseconds, source session/result optional, notes, author. Reject a result
  whose linked source does not match the benchmark's stroke/distance/course.
- Add `ImportJob`: club, type `RACE_RESULTS_CSV`, storage path, input hash,
  status (`UPLOADED`, `VALIDATED`, `CONFIRMED`, `FAILED`), totals, creator,
  timestamps.
- Add `ImportRowError`: import job, one-based row number, column optional,
  code, message, raw values redacted to safe fields.

## CSV contract

Provide one downloadable template with required columns: `athlete_email`,
`event_date`, `event_name`, `stroke`, `distance_meters`, `course_type`, and
`time`. Optional columns: `competition_name`, `placing`, `notes`.

- Dates are `YYYY-MM-DD`; course type is SCM, LCM, or SCY.
- Time accepts `SS.s`, `M:SS.s`, or `H:MM:SS.s`, and is stored in milliseconds.
- Match athletes by normalized lower-case email within the importing club.
- Reject unknown athletes, invalid values, non-positive times, duplicated CSV
  source rows, and rows exceeding length limits. Invalid rows are never
  partially persisted.

## API surface

- `POST /clubs/:clubId/race-result-imports` creates a private signed upload.
- `POST /race-result-imports/:importId/validate` parses and returns preview,
  valid/invalid counts, unmatched athletes, and row errors.
- `POST /race-result-imports/:importId/confirm` writes only valid preview rows
  exactly once; repeat calls return the confirmed job result.
- `GET /athletes/:athleteId/races?from=&to=&cursor=`
- `GET /athletes/:athleteId/personal-bests`
- `GET/POST/PATCH /benchmarks` and `POST /benchmarks/:benchmarkId/results`.

Only owners/coaches import and manage benchmarks. Athletes read only their own
races/PBs/benchmark outcomes; support access follows the profile grant scope
only if a later requirement explicitly adds it.

## Calculations and frontend

- A PB is the lowest valid `timeMs` for exactly matching stroke, distance, and
  course type. Results with no valid comparable prior are labelled “first
  result,” not improvement.
- Build `/coach/imports/race-results`, `/coach/competitions`, and athlete race
  and PB sections on the plan-14 profile. The wizard is upload → validate →
  correct/re-upload or exclude invalid rows → confirm → saved summary.
- Show source import, event date, and course type beside every PB. Charts have
  an accessible table alternative and no cross-course comparison by default.

## Acceptance criteria

- A mixed-validity file shows exact row errors before confirmation.
- Confirming a valid preview is atomic and re-confirming creates no duplicates.
- PBs correctly distinguish SCM, LCM, and SCY results.
- A coach can trace each imported result to its import job and source row.

## Tests

- Time parser, CSV header, value, duplicate, athlete-match, and idempotency
  tests.
- Transaction rollback and import authorization tests.
- PB/course compatibility and benchmark source-matching tests.
- Import-wizard keyboard, error-summary, and mobile tests.

## Out of scope

Timing-system APIs, manual race entry, public rankings, automatic race
predictions, wearable imports, and result deletion outside an audited future
correction workflow.
