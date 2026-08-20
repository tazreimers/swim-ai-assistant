# Plan 20: AI Workout Drafting and Fast Capture

## AI implementation prompt

Turn chat, voice, and whiteboard input into an editable, schema-valid workout
draft. AI output is never a session and may not publish or modify athlete data.
A coach must review and explicitly save it through existing template/session
workflows.

## Objective

Reduce coach workout-entry time while preserving control, validation, and a
clear recovery path when source material is incomplete.

## Shared draft contract and data model

- Define one shared `WorkoutDraft` schema: title, club ID, squad ID optional,
  scheduled date optional, session type, notes, ordered main sets, and an array
  of `reviewQuestions`.
- Each main set validates existing session limits: stroke optional, positive
  distance/repetitions/send-off where supplied, notes, and stable position.
- Add `AiDraft`: club, creator, source (`CHAT`, `VOICE`, `WHITEBOARD`), input
  hash, status (`PROCESSING`, `READY`, `FAILED`, `EXPIRED`), draft JSON,
  review questions, error code, raw media storage path optional, expiresAt,
  timestamps. Create a unique active draft per creator/input hash/source.
- Retain voice/whiteboard media for seven days; retain the approved draft audit
  record for 180 days. Deleting raw media does not delete an approved session.

## API surface

- `POST /ai/workout-drafts` accepts chat text or creates a signed private
  upload for voice/whiteboard input.
- `POST /ai/workout-drafts/:draftId/process` performs/continues processing
  idempotently.
- `GET /ai/workout-drafts/:draftId` returns only the creator's draft.
- `POST /ai/workout-drafts/:draftId/create-session` validates the edited
  `WorkoutDraft` with the existing `CreateSessionDto` and creates a DRAFT.
- `POST /ai/workout-drafts/:draftId/create-template` validates and creates a
  template under plan 15.
- `DELETE /ai/workout-drafts/:draftId` removes the draft and any raw media.

Owners/coaches create and apply drafts only for their club. Support users and
athletes cannot create or apply drafts. Signed upload paths are scoped to the
draft ID and creator; validate MIME type and size before issuing the URL.

## AI processing rules

- Chat uses the authorized context from plan 19. Voice is a bounded audio file
  transcribed by the AI service. Whiteboard input is a private image URL valid
  only for one processing request.
- FastAPI returns JSON matching `WorkoutDraft`; invalid output is a failed
  draft, never best-effort session data.
- Unread/ambiguous text becomes a review question with a blank/optional field,
  never an invented distance, send-off, stroke, or date.
- Require `scheduledDate` and `squadId` before creating a session. Require a
  title and at least one main set before creating a template. Publish remains
  the existing explicit coach action.

## Frontend

- Add “Ask Swim AI” from the plan-19 panel, “Dictate workout” from session
  creation, and “Read whiteboard” beside the existing photo workflow.
- Processing screen shows source type, progress, safe failure reason, retry,
  delete, and raw-media expiry. It must not imply success before a valid draft
  exists.
- The review page uses the current session/template fields, highlights AI
  values and review questions, and has explicit “Create draft session” and
  “Create template” buttons. No button says Publish.

## Acceptance criteria

- A coach can turn a text request, valid voice recording, or whiteboard image
  into an editable draft.
- Unclear or malformed AI output cannot create a session accidentally.
- Applying a draft creates only a DRAFT session/template and records its
  source; the coach still controls publish.
- Expired or unauthorized media cannot be read.

## Tests

- Shared schema, input-hash idempotency, expiry, and apply-validation tests.
- Audio/image MIME/size/path authorization tests.
- Mock AI tests for timeout, invalid JSON, uncertainty, and provider failure.
- Review-page keyboard, mobile, error, and explicit-approval tests.

## Out of scope

Live voice commands, autonomous publishing, background listening, reusable
prompt marketplace, or image/video analysis beyond whiteboard extraction.
