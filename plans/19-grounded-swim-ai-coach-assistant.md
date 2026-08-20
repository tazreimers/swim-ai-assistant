# Plan 19: Grounded Swim AI Coach Assistant

## AI implementation prompt

Build a persistent, permission-aware coach assistant using the existing AI
service. It answers questions about explicitly selected Swim AI records,
streams a typed response, cites sources, and collects feedback. It never
executes mutations or accesses unselected club data.

## Objective

Give coaches a dependable way to ask questions instead of manually searching
through authorized training, attendance, wellness, competition, and profile
data.

## Data model

- Add `AiConversation`: club, owner user, title, status (`ACTIVE`,
  `ARCHIVED`), model, prompt version, created/updated/archived timestamps.
- Add `AiMessage`: conversation, role (`USER`, `ASSISTANT`, `SYSTEM`), text,
  status (`PENDING`, `COMPLETED`, `FAILED`, `CANCELLED`), selected-context
  JSON, error code, model, prompt version, timestamps.
- Add `AiMessageCitation`: assistant message, source type, source UUID,
  source label, permitted route, ordinal. It stores a reference, not a copy of
  source content.
- Add `AiMessageFeedback`: assistant message, user, rating (`UP`, `DOWN`),
  optional reason (500 chars), timestamps; unique message/user pair.
- Retain archived conversations for 90 days and active conversations for 180
  days, then delete messages/citations/feedback through a scheduled cleanup.

## Context and authorization

- A chat request contains a conversation ID optional, text, and selected
  context items (`ATHLETE`, `SESSION`, `SQUAD`, `COMPETITION`, `RACE_RESULT`,
  `WELLNESS_WINDOW`). Limit to 20 items and validate every ID with the caller's
  current club membership or athlete access grant.
- NestJS builds a minimal normalized context after authorization. It does not
  pass entire club data, raw secrets, private notes outside visibility scope,
  or arbitrary database query ability to FastAPI.
- FastAPI receives the server-built context and returns response text plus
  structured citation references. It must not call the database directly.
- The model prompt says facts must come from supplied context, uncertainty must
  be stated, and it must not offer medical diagnosis or execute actions.

## Streaming API

- `POST /ai/conversations` creates an active conversation.
- `GET /ai/conversations?status=ACTIVE|ARCHIVED&cursor=` lists owner-only
  summaries.
- `POST /ai/conversations/:conversationId/messages` starts an SSE response.
- `POST /ai/conversations/:conversationId/cancel` marks the pending message
  cancelled.
- `POST /ai/conversations/:conversationId/archive` archives it.
- `POST /ai/messages/:messageId/feedback` upserts feedback.

SSE event payloads are shared schemas: `conversation_started`,
`assistant_delta`, `citation`, `assistant_completed`, `assistant_failed`.
Every event includes message ID and sequence number. The browser reconnects
once to fetch the final message state; it does not blindly replay a prompt.

## Frontend

- Add a persistent MUI right-side assistant panel available to coaches and
  authorized support staff, with current-context chips controlled by the page.
- Provide conversation history, archive, new conversation, connection/status
  label, stop, retry, citations, source links, and thumbs up/down.
- Render source links only after the existing API confirms current access. A
  citation whose access was revoked displays “Source no longer available.”
- Store only the active conversation ID and panel width in browser storage;
  messages and authorization always come from the server.

## Acceptance criteria

- Coaches can resume their own active conversation and archive it.
- Every source-based assertion includes a source citation or declares that the
  available data is insufficient.
- Cross-club and revoked-grant access is blocked before context reaches AI.
- Disconnect, timeout, malformed output, cancellation, and provider errors
  leave a readable, retryable message state.

## Tests

- Conversation ownership, archive, retention, feedback, and citation tests.
- Context authorization tests for every source type and revoked grant.
- Typed SSE sequence/parser/reconnect tests and AI-service malformed-output
  tests.
- Keyboard, screen-reader, narrow-panel, error, and citation-access UI tests.

## Out of scope

Tool execution, autonomous changes, vector databases, external web search,
multi-agent orchestration, non-coach chat, and workout creation; plan 20 adds
the approval-only drafting flow.
