# Plan 22: Media and Race-Review Foundation

## AI implementation prompt

Create a secure race-video upload, playback, annotation, and comparison
foundation. Ship manual analysis only. Do not promise or partially implement
automatic stroke, turn, underwater, breakout, or split detection.

## Objective

Give authorized coaches a practical way to review races with athletes while
collecting clean, structured data that can later justify automation.

## Data model

- Add `RaceVideo`: club, athlete user, competition optional, uploader, private
  storage path, original file name (sanitized), MIME type, size bytes, duration
  milliseconds optional, status (`UPLOADING`, `READY`, `FAILED`, `DELETED`),
  failure code optional, visibility (`COACHES_ONLY`, `ATHLETE_VISIBLE`),
  uploaded/processed/deleted timestamps.
- Add `RaceVideoAnnotation`: video, author, type (`START`, `SPLIT`, `TURN`,
  `BREAKOUT`, `FINISH`, `NOTE`), timestamp milliseconds, label optional, text
  optional, timestamps. A timestamp must be within known duration when present.
- Add `RaceVideoComparison`: club, primary video, comparison video, creator,
  title optional, timestamps. Both videos must be active, in the same club, and
  accessible to the creator.

## Upload, retention, and access

- Accept `video/mp4`, `video/webm`, and `video/quicktime` only. Set the exact
  v1 file-size and duration limits in environment configuration; reject files
  exceeding either before a signed upload URL is issued.
- Store media in a private `race-videos` bucket under
  `club/{clubId}/athlete/{athleteId}/video/{videoId}`. Never expose a public
  object URL.
- The API creates the record and signed upload URL, then verifies object
  metadata before marking it READY. Signed playback URLs expire in 15 minutes.
- Owners/coaches access club video; athletes access only their own
  `ATHLETE_VISIBLE` video; support users require a matching profile grant and
  do not gain video access by default.
- Retain videos until an owner deletes them. Soft-delete first, revoke URLs
  immediately, and delete stored media after 30 days.

## API surface

- `POST /athletes/:athleteId/race-videos` creates upload intent.
- `POST /race-videos/:videoId/complete` verifies upload and updates state.
- `GET /athletes/:athleteId/race-videos?cursor=` and `GET /race-videos/:videoId`
- `POST /race-videos/:videoId/playback-url`
- `GET/POST/PATCH/DELETE /race-videos/:videoId/annotations`
- `GET/POST/DELETE /race-video-comparisons`
- `DELETE /race-videos/:videoId` soft-deletes the video.

## Frontend

- Add a race-videos section to the plan-14 athlete profile: upload, queued,
  ready, failed/retry, and deleted states.
- Build a video player with annotation timeline, timestamp form, transcript-like
  annotation list, keyboard controls, and text alternatives for video content.
- Build a comparison screen with two synchronized manual players and separate
  annotation timelines. Do not implement frame-perfect synchronization before a
  validated need; controls start/pause both players together.

## Acceptance criteria

- An authorized coach uploads, annotates, compares, and deletes a valid video.
- An unrelated club member receives neither metadata nor a signed URL.
- Failed upload/verification states can be retried without duplicate records.
- Athlete visibility changes take effect before the next playback URL is issued.

## Tests

- MIME/size/path/status transition and signed-URL expiry tests.
- Club/athlete/support/visibility/deletion authorization tests.
- Annotation timestamp and comparison validity tests.
- Keyboard player, mobile upload, caption/annotation alternative, and failure UI
  tests.

## Out of scope

Automated video analysis, transcoding pipeline, public sharing, downloads,
third-party video hosting, and support-staff video access.
