-- Reuse the legacy session data while giving the table the MVP name.
ALTER TABLE "Session" RENAME TO "sessions";
ALTER TABLE "sessions" ALTER COLUMN "workoutId" DROP NOT NULL;
ALTER TABLE "sessions" ALTER COLUMN "athleteId" DROP NOT NULL;

CREATE TYPE "SessionWorkflowStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'ARCHIVED');
CREATE TYPE "AthleteResultStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'MISSED');

ALTER TABLE "sessions"
  ADD COLUMN "clubId" UUID,
  ADD COLUMN "squadId" UUID,
  ADD COLUMN "coachId" UUID,
  ADD COLUMN "title" TEXT,
  ADD COLUMN "sessionType" TEXT,
  ADD COLUMN "publishedAt" TIMESTAMP(3),
  ADD COLUMN "workflowStatus" "SessionWorkflowStatus" NOT NULL DEFAULT 'DRAFT';

CREATE TABLE "session_photos" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "storagePath" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "session_photos_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "main_sets" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "position" INTEGER NOT NULL,
    "stroke" TEXT,
    "distanceMeters" INTEGER,
    "repetitions" INTEGER NOT NULL,
    "sendOffSeconds" INTEGER,
    "notes" TEXT,
    CONSTRAINT "main_sets_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "athlete_results" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "status" "AthleteResultStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "athlete_results_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "rep_results" (
    "id" UUID NOT NULL,
    "athleteResultId" UUID NOT NULL,
    "mainSetId" UUID NOT NULL,
    "repNumber" INTEGER NOT NULL,
    "timeMs" INTEGER NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "rep_results_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "session_photos_sessionId_key" ON "session_photos"("sessionId");
CREATE UNIQUE INDEX "main_sets_sessionId_position_key" ON "main_sets"("sessionId", "position");
CREATE UNIQUE INDEX "athlete_results_sessionId_userId_key" ON "athlete_results"("sessionId", "userId");
CREATE UNIQUE INDEX "rep_results_athleteResultId_mainSetId_repNumber_key"
  ON "rep_results"("athleteResultId", "mainSetId", "repNumber");

CREATE INDEX "sessions_clubId_scheduledDate_idx" ON "sessions"("clubId", "scheduledDate");
CREATE INDEX "sessions_squadId_scheduledDate_workflowStatus_idx"
  ON "sessions"("squadId", "scheduledDate", "workflowStatus");
CREATE INDEX "sessions_coachId_scheduledDate_idx" ON "sessions"("coachId", "scheduledDate");
CREATE INDEX "main_sets_sessionId_idx" ON "main_sets"("sessionId");
CREATE INDEX "athlete_results_userId_completedAt_idx" ON "athlete_results"("userId", "completedAt");
CREATE INDEX "rep_results_mainSetId_idx" ON "rep_results"("mainSetId");

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_clubId_fkey"
  FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_squadId_fkey"
  FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_coachId_fkey"
  FOREIGN KEY ("coachId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "session_photos" ADD CONSTRAINT "session_photos_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "main_sets" ADD CONSTRAINT "main_sets_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "athlete_results" ADD CONSTRAINT "athlete_results_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "athlete_results" ADD CONSTRAINT "athlete_results_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rep_results" ADD CONSTRAINT "rep_results_athleteResultId_fkey"
  FOREIGN KEY ("athleteResultId") REFERENCES "athlete_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "rep_results" ADD CONSTRAINT "rep_results_mainSetId_fkey"
  FOREIGN KEY ("mainSetId") REFERENCES "main_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
