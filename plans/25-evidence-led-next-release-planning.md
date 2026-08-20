# Plan 25: Evidence-Led Next-Release Planning

## AI implementation prompt

Use pilot evidence to create the next implementation plans. Do not build a
feature in this plan. A proposed feature is eligible only when its user,
problem, success measure, data/security impact, dependencies, and priority are
known.

## Objective

Turn real pilot usage and operational evidence into the smallest next release
that saves coaches time, improves collaboration, or enables a better coaching
decision.

## Required inputs

- Plan-24 metrics for two pilot operating weeks.
- Coach, athlete, owner, and support-user interviews; preserve anonymized
  quotes and the workflow/context of each request.
- AI feedback, latency/cost, failed drafts, citations users opened, and AI
  failure classes.
- CSV/import errors, video upload/annotation use, accessibility findings,
  support tickets, incidents, deployment failures, and infrastructure cost.
- A list of manual workarounds and their time cost. Do not treat a feature
  request without evidence as a committed roadmap item.

## Evaluation method

Score each candidate 1–5 for: evidence strength, coach time saved,
collaboration improvement, decision-quality improvement, pilot reach,
security/privacy risk, operational risk, dependency cost, and implementation
effort. Use the score to compare candidates, then apply product judgement;
record the reason for any override.

Candidates to evaluate, not assume:

- Garmin, WHOOP, Apple Health, Polar, timing-system, or other data
  integrations.
- Automated split/stroke/turn/underwater/breakout race analysis.
- Expanded voice capture, direct messages/notifications, parent portal, or
  native mobile application.
- Multi-sport abstraction, advanced season planning, payments, and expanded
  support/clinical workflows.
- AI improvements such as retrieval quality, structured tools with explicit
  approval, evaluation datasets, or lower-cost model routing.

## Required outputs

- A pilot evidence report: metric baseline, qualitative themes, incidents,
  limitations, and verified product outcomes.
- A prioritized “do now / validate first / do not build” list. Every item has a
  one-sentence reason and link to its evidence.
- Numbered implementation plans only for “do now” items. Each follows the
  plans 13–24 documentation standard: objective, dependencies, exact data/API/
  UI/authorization choices, tests, acceptance criteria, and exclusions.
- A separate validation experiment for “validate first” items, with hypothesis,
  target users, duration, success threshold, cost cap, privacy review, and stop
  condition.
- A deferred list with the evidence required to revisit each item.

## Acceptance criteria

- Every subsequent plan traces to pilot evidence or a documented commercial/
  regulatory requirement.
- No next-release feature proceeds with unresolved authorization, retention,
  or ownership decisions.
- The next release has measurable success criteria and a smallest shippable
  slice, rather than a copy of the full long-term vision.

## Out of scope

Implementing candidates, collecting personal data beyond pilot consent, or
committing to a technology/vendor before the validation decision is complete.
