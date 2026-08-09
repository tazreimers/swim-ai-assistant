# Plan 10: Training Sessions, Whiteboards, Publishing, and Athlete Logging

## AI implementation prompt

Implement the core coach-to-athlete training workflow. A coach must be able
to create and publish a session for a squad, optionally upload a whiteboard
photo, and an athlete must be able to open today's session, enter rep times,
save, and complete the workout quickly.

## Objective

Turn a coach's training plan into a published, trackable athlete session while
preserving draft state, validation, authorization, and a fast mobile-friendly
logging experience.

## Data model

Evolve the current workout/session schema toward:

- `sessions`: club, squad, coach, title, date, type, notes, status, publishedAt.
- `session_photos`: session, storage path, MIME type, size, metadata.
- `main_sets`: session, position, stroke, distance, reps, send-off, notes.
- `athlete_results`: session, athlete, status, started/completed timestamps.
- `rep_results`: athlete result, main-set reference, rep number, time,
  optional notes.

Use draft/published/completed/archived states and constraints preventing
athletes from logging unpublished or unauthorized sessions.

## API surface

- `POST /sessions`
- `GET /sessions/:sessionId`
- `PATCH /sessions/:sessionId`
- `POST /sessions/:sessionId/photo`
- `DELETE /sessions/:sessionId/photo`
- `POST /sessions/:sessionId/publish`
- `GET /squads/:squadId/sessions`
- `GET /athletes/me/sessions/today`
- `GET /sessions/:sessionId/my-result`
- `PUT /sessions/:sessionId/my-result`
- `POST /sessions/:sessionId/my-result/complete`

Use multipart upload or a signed-upload flow for photos. Prefer direct
Supabase Storage upload with an API-issued scoped path and signed read URL.
Validate file type, size, and ownership.

## Coach experience

- `/coach/sessions/new`
- `/coach/sessions/[sessionId]/edit`
- `/coach/sessions/[sessionId]/publish`
- Session form with title, date, type, notes, squad, and ordered main-set
  rows.
- Whiteboard upload preview with retry/remove behavior.
- Publish confirmation showing missing fields and target squad.

The happy path should support publishing in under two minutes using sensible
defaults and keyboard-friendly repeated set entry.

## Athlete experience

- `/athlete/today`
- `/athlete/sessions/[sessionId]`
- Mobile-first set and rep entry with numeric/time input.
- Autosave or explicit save with visible saved status.
- Completion confirmation and edit rules.

Use local draft state only as a resilience aid; the server remains authoritative
and writes must be idempotent.

## Validation and state rules

- Draft sessions can be edited by authorized coaches.
- Published sessions cannot be destructively changed after athletes begin;
  use controlled amendments if required.
- Only squad members can access assigned sessions.
- Rep times must use a consistent duration format and sensible bounds.
- Completion requires all required reps or an explicit missed/ skipped reason.
- Duplicate saves must not create duplicate rep rows.

## Acceptance criteria

- A coach can create, preview, and publish a session to a squad.
- A valid whiteboard photo can be uploaded and viewed by authorized users.
- An athlete can open today's session and log all main-set times in under one
  minute on a mobile viewport.
- Results remain after reload and completion is durable.
- Unauthorized users cannot access session content or photos.
- Draft, published, completed, and invalid states are clear in the UI.

## Tests

- DTO/schema validation and session state transition tests.
- Authorization tests for coach, squad athlete, and unrelated user.
- Storage upload/signing tests with invalid file cases.
- Idempotent save and concurrent update tests.
- End-to-end coach publish and athlete logging flow.

## Out of scope

- Full workout template libraries, meet management, wearable imports, video
  analysis, and AI-generated workouts.

