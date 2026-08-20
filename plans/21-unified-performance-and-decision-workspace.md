# Plan 21: Unified Performance and Decision Workspace

## AI implementation prompt

Create read-only athlete and squad decision views that combine authorized data
from completed plans. Calculate metrics once on the server, show their inputs,
and let AI explain only precomputed facts. Do not create competing analytics
logic in React or add predictive/medical claims.

## Objective

Help a coach move from an alert to its underlying training, attendance,
wellness, competition, and benchmark records in one or two interactions.

## Read models and calculations

- Add no duplicate source tables. Implement server-side query/read-model
  functions for athlete timeline and squad overview.
- Return a shared `MetricState<T>` for every metric: `value`, `sampleSize`,
  `comparisonWindow`, `status` (`AVAILABLE`, `INSUFFICIENT_DATA`,
  `NOT_COMPARABLE`), and explanation.
- Attendance rate: present/late records divided by all recorded statuses in the
  selected range. Training completion: completed athlete results divided by
  published assigned sessions in the range.
- Comparable pace trend: compare average rep time only where main-set stroke,
  distance, and repetitions match. Never combine courses or unmatched sets.
- PB count: number of new plan-18 PB records in range. Wellness trend: average
  readiness only when `MetricState` is available. Benchmark trend: compare
  matching benchmark results only.
- Default range is the last 28 local days; accepted range is 7–90 days.

## API surface

- `GET /athletes/:athleteId/decision-workspace?from=&to=`
- `GET /squads/:squadId/decision-workspace?from=&to=`
- `GET /athletes/:athleteId/timeline?from=&to=&cursor=`
- `POST /ai/decision-explanations` accepts server-computed metric IDs and
  selected source IDs only; it reuses plan-19 authorization/citation rules.

The API returns only sources the requester may already read. Athletes receive
only their own workspace. Support users receive fields limited by their active
grant scope; they never see coach-only observations by default.

## Frontend

- Add athlete Decision Workspace tab to plan-14 profiles and
  `/coach/squads/[squadId]/performance`.
- Show metric cards with status text, selected date range, and “View source”
  drill-through. Never render zero in place of missing data.
- Provide a chronological timeline with filters and an accessible table view
  for each chart. Use text, icons, and colour together for directional states.
- “Explain with Swim AI” appears only when at least one available metric/source
  is selected; it opens plan-19 chat with citations preselected.

## Implementation sequence

1. Define shared read-model/metric schemas and deterministic calculation tests.
2. Add bounded server queries and indexes only after query-plan review.
3. Add API authorization and source-link DTOs.
4. Build cards, timeline, filters, accessible tables, and AI handoff.

## Acceptance criteria

- The same input fixtures produce the same metrics in every API response.
- A coach can open an alert and reach its source records without a manual
  search.
- Incompatible or sparse data is labelled accurately rather than charted as a
  trend.
- AI explanations cite the inputs and distinguish fact from interpretation.

## Tests

- Calculation fixtures for empty, incomplete, comparable, and incompatible
  data.
- Date-range, pagination, athlete/support/cross-club authorization tests.
- Chart/table equivalence, filter, source-link, and mobile accessibility tests.

## Out of scope

Prediction, automated training prescription, athlete ranking, public
leaderboards, wearable data, and medical decision support.
