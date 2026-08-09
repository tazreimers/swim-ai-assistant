# Plan 12: AI Insights, Reports, and MVP Validation

## AI implementation prompt

Implement the MVP AI insight pipeline after a session is completed. The
system must generate a structured session summary, athlete-specific feedback,
and coach dashboard highlights using the FastAPI AI service and an OpenAI
model. Keep prompts domain-specific, versioned, observable, and safe.

## Objective

Prove the differentiator: a coach receives useful, actionable insights after a
session without manually analyzing every athlete's times.

## Data model

Add or evolve `ai_reports` with:

- report ID, session ID, optional athlete ID, report type.
- status: queued, processing, completed, failed, stale.
- prompt/model/version metadata.
- structured JSON result and human-readable rendering fields.
- input summary hash, error code, timestamps, duration, and retry count.

Do not store unnecessary personal data in prompts or logs. Define retention and
regeneration behavior.

## Pipeline

1. Session completion emits or enqueues an analysis request.
2. NestJS gathers authorized normalized session and result data.
3. FastAPI validates a typed request and calls OpenAI with a structured output
   schema.
4. The response is validated, persisted, and made available to the API.
5. The web app shows processing, completed, stale, and failed states.

Use idempotency by session/input hash, bounded retries with backoff, explicit
timeouts, and a failure state that never pretends a report succeeded.

## Required outputs

### Session summary

- Number of swimmers completed.
- Average pace/performance and comparison where valid.
- Personal best count.
- Significant fade/drop-off count.
- Attendance and notable patterns.

### Athlete insight

- What the athlete did well.
- Meaningful comparison with prior comparable sessions.
- One or two practical improvement recommendations.
- Clear uncertainty when data is incomplete.

### Coach summary

- Most improved swimmer.
- Biggest improvement.
- Largest pace drop-off.
- Attendance.
- Average session performance.
- Actionable coaching recommendations.

The API must return schema-validated structured data, not only untyped prose.

## Prompt and domain logic

- Build deterministic metrics before calling the model.
- Pass normalized units, comparable baselines, and explicit missing-data flags.
- Store prompt templates and versions in source control or a versioned registry.
- Instruct the model not to invent times, diagnoses, attendance, or causes.
- Separate computed facts from model-generated interpretation.
- Add a human-readable disclaimer for uncertain or insufficient data.

## API and UI

- `POST /sessions/:sessionId/ai-report`
- `GET /sessions/:sessionId/ai-report`
- `GET /athletes/me/ai-insights`
- `POST /ai-reports/:reportId/regenerate`
- Coach dashboard insight cards and athlete feedback section.
- Polling or refresh-on-focus while processing; avoid aggressive polling.

## Reliability, privacy, and observability

- Keep OpenAI credentials server-side.
- Authenticate service-to-service requests.
- Redact secrets and sensitive raw inputs from logs.
- Record duration, provider/model, status, retry count, and safe error class.
- Define behavior when the AI service or provider is unavailable.
- Add rate limits and regeneration permissions.

## Acceptance criteria

- A completed session produces a report or an explicit failed state.
- Valid reports include session, athlete, and coach sections as applicable.
- Insights are grounded in stored results and never fabricate metrics.
- Reports become available within the 30-second MVP target under normal load.
- Coaches can identify actionable highlights without reading every rep.
- Athletes receive concise, personalized feedback.
- Failed reports can be retried safely and visibly.

## Tests and validation

- Pydantic/TypeScript contract tests across FastAPI and NestJS.
- Fixture tests for missing data, personal bests, fade, and no prior baseline.
- Mock provider tests for timeout, malformed output, rate limit, and retry.
- End-to-end completion-to-report test.
- Prompt regression/evaluation set reviewed by swimming domain users.
- Pilot metrics: report usefulness, coach actionability, report latency,
  athlete logging rate, and weekly club retention.

## Out of scope

- AI workout generation, race prediction, medical advice, voice assistant,
  video analysis, wearables, and autonomous coaching decisions.

