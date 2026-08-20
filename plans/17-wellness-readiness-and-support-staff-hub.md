# Plan 17: Wellness, Readiness, and Support-Staff Hub

## AI implementation prompt

Add short athlete self-reported wellness check-ins and non-clinical support
notes. Use a transparent deterministic readiness calculation. Do not store
medical records or present recommendations as diagnoses or treatment.

## Objective

Make daily athlete readiness visible to the authorized coaching team while
preserving athlete privacy and clear limits on what the data means.

## Data model and calculation

- Add `WellnessCheckIn`: athlete user, local calendar date, sleep quality,
  fatigue, mood, stress, soreness (each integer 1–5), optional note (500
  chars), submittedAt, and updatedAt. Enforce one check-in per athlete/date.
- Add `SupportNote`: athlete user, author user, category (`GENERAL`,
  `NUTRITION`, `STRENGTH_CONDITIONING`, `PSYCHOLOGY`), visibility
  (`COACHES_ONLY`, `ATHLETE_VISIBLE`), text (2,000 chars), timestamps.
- Readiness is `round(average(valid scores after reversing fatigue, stress,
  and soreness) / 5 * 100)`. Return contributing fields and count; never hide
  the calculation. Return `null` and “insufficient data” until three check-ins
  exist in the requested 14-day window.
- Store raw scores, not a mutable readiness value. Calculate trends on read.

## Authorization and API

- Athletes read/write only their own check-in and `ATHLETE_VISIBLE` notes.
- Owners/coaches read club athlete wellness and write observations, but not
  support notes unless an allowed visibility state permits it.
- Support users require active plan-14 grants: `WELLNESS` to read wellness and
  `SUPPORT_NOTES` to create/read notes.
- `GET/PUT /athletes/me/wellness/today`
- `GET /athletes/:athleteId/wellness?from=&to=`
- `GET /squads/:squadId/readiness?date=`
- `GET/POST/PATCH /athletes/:athleteId/support-notes`

Date inputs are ISO local dates. The server validates a date is not more than
one day in the future in the club timezone. All list ranges are bounded to 90
days.

## Frontend

- `/athlete/wellness`: five labelled 1–5 controls, optional note, save state,
  today’s score explanation, and 14-day history.
- `/coach/readiness`: squad list with filter, explicit missing/insufficient
  states, drill-through to authorized athlete trend.
- `/support/athletes/[athleteId]`: non-clinical notes only for granted scope.
- Display “Self-reported wellness, not medical advice” beside readiness. Charts
  require text/table alternatives and cannot use colour as the only signal.

## Acceptance criteria

- An athlete submits or updates a check-in in under 30 seconds on mobile.
- The same daily submission is updated, never duplicated.
- Coaches/support staff see only data allowed by membership/grants.
- Readiness values reproduce exactly from the documented formula.

## Tests

- Formula tests for full/missing/invalid data and timezone date boundaries.
- Unique daily upsert, grant, visibility, and cross-club authorization tests.
- Mobile form, validation, accessible trend, and insufficient-data tests.

## Out of scope

Injuries, diagnoses, medication, treatment, clinical files, wearable syncing,
automatic readiness prescriptions, or medical alerts.
