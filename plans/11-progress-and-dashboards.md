# Plan 11: Results, Progress Tracking, and Dashboards

## AI implementation prompt

Implement the result calculations and role-specific dashboards for the MVP.
Use the shared package for calculation contracts where possible, and make the
API return stable, authorization-filtered data for accessible charts and
tables.

## Objective

Give athletes understandable personal progress and coaches actionable
session-level performance visibility without building a full analytics
platform.

## Required calculations

For completed rep results, calculate:

- Average time.
- Best time.
- Worst time.
- Difference between consecutive reps.
- Change against the athlete's previous comparable result.
- Session completion and attendance counts.

Define how missing reps, skipped reps, invalid times, stroke/distance
comparability, and timezone boundaries are handled. Keep raw results immutable
where possible and calculate summaries deterministically.

## API surface

- `GET /athletes/me/progress`
- `GET /athletes/me/sessions`
- `GET /sessions/:sessionId/results`
- `GET /sessions/:sessionId/summary`
- `GET /coach/dashboard`
- `GET /squads/:squadId/progress`

Support date range, squad, stroke, distance, and pagination filters with
bounded defaults. Add indexes for session date, squad, athlete, and result
lookups. Avoid returning other athletes' private details to athletes.

## Frontend routes and components

- `/athlete/progress`
- `/athlete/history`
- `/coach/dashboard`
- `/coach/sessions/[sessionId]/results`
- `MetricCard`, `ProgressChart`, `SessionHistoryTable`,
  `RepPerformanceTable`, `AttendanceCard`, `AthleteRankingTable`, and
  filter controls.

Use MUI data display and charting conventions consistent with the theme. Charts
must have a text/table alternative, labeled axes, useful tooltips, and
color-independent meaning.

## Dashboard behavior

Athletes see today's status, recent sessions, trend lines, best/average times,
and concise personal progress. Coaches see attendance, average performance,
most improved swimmer, largest improvement, and pace drop-off once sufficient
data exists. Clearly distinguish unavailable metrics from zero values.

## Security and performance

- Scope every query to club/squad membership.
- Never expose a private athlete metric to another athlete.
- Use server-side aggregation for large result sets.
- Bound date ranges and page sizes.
- Cache only data whose authorization scope is safe.

## Acceptance criteria

- Calculations match documented examples for complete and incomplete sets.
- Athletes can view personal progress and session history.
- Coaches can view authorized squad results and attendance.
- Empty, loading, error, and insufficient-data states are understandable.
- Progress screens work on desktop and mobile and remain accessible.

## Tests

- Unit tests for every calculation and edge case.
- API authorization, filtering, pagination, and aggregation tests.
- Fixture-based regression tests for dashboard metrics.
- Frontend chart/table accessibility and responsive tests.
- Query/index review for representative squad sizes.

## Out of scope

- Race prediction, advanced biomechanics, wearable data, video analysis,
  longitudinal research analytics, and public leaderboards.

