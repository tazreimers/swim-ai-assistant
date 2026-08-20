# Plan 16: Pool-Deck Operations, Attendance, and Announcements

## AI implementation prompt

Implement the daily coach workflow with fast, idempotent attendance capture
and in-app club/squad announcements. Keep communication one-to-many; do not
build direct messaging, email delivery, push notifications, or attachments.

## Objective

Allow a coach to run a session from a tablet or phone without maintaining a
separate attendance sheet or chat announcement channel.

## Data model

- Add `AttendanceStatus`: `PRESENT`, `LATE`, `ABSENT`, `EXCUSED`.
- Add `AttendanceRecord`: session, athlete user, status, optional reason
  (maximum 280 characters), captured-by user, and timestamps. Enforce unique
  `(sessionId, athleteUserId)`.
- Add `Announcement`: club, optional squad, title (120 chars), body (2,000
  chars), author, publishedAt, expiresAt, archivedAt, and timestamps.
- Add `AnnouncementRead`: announcement, user, readAt; enforce unique pair.

## API surface

- `GET /sessions/:sessionId/attendance`
- `PUT /sessions/:sessionId/attendance` with the complete list of roster
  statuses; upsert rows in one transaction and return the saved list.
- `GET /coach/today?squadId=` for today's scheduled sessions and roster.
- `GET/POST/PATCH /announcements`
- `POST /announcements/:announcementId/read`
- `GET /announcements/me?cursor=`

Only owners/coaches can save attendance and create/archive announcements.
Squad announcements are visible to active squad members; club announcements to
active club members. Read is idempotent. Expired/archived announcements do not
appear in normal feeds but remain auditable to owners/coaches.

## Frontend

- `/coach/today`: session selector, roster, one-tap attendance buttons, bulk
  “mark all present,” unsaved-changes indicator, retry, and timestamp.
- `/announcements`: coach compose/archive view and member feed.
- Add an unread count to the existing shell and an announcement card on relevant
  dashboards. The count is supplemental; navigation must work without it.
- Use large touch targets, text plus colour status, labelled controls, and a
  keyboard-operable roster. Draft changes remain local until Save; server state
  is authoritative after save.

## Implementation sequence

1. Add migration, DTO validation, roster lookup, and transaction-safe upsert.
2. Reuse squad membership and session authorization; do not add a roster table.
3. Add announcement service with audience filtering and cursor pagination.
4. Build typed clients, pool-deck page, compose form, and feed/read state.

## Acceptance criteria

- A coach marks an entire squad in under one minute at tablet width.
- Reload shows exactly the saved attendance values with no duplicates.
- A squad announcement is visible only to active members of that squad.
- Members can mark an announcement read and see an accurate unread count.

## Tests

- Attendance validation, repeat-save, transaction, and roster authorization
  tests.
- Announcement audience, expiration, archive, cursor, and read-idempotency
  tests.
- Mobile touch-target, keyboard roster, and colour-independent status tests.

## Out of scope

Direct messages, reactions, files, email, SMS, push notifications, and
automatic attendance inference from session results.
