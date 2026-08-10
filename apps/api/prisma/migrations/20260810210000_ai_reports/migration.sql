CREATE TYPE "AiReportStatus" AS ENUM ('QUEUED', 'PROCESSING', 'COMPLETED', 'FAILED', 'STALE');
CREATE TYPE "AiReportType" AS ENUM ('SESSION', 'ATHLETE', 'COACH');

CREATE TABLE "AiReport" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "athleteId" UUID,
    "reportType" "AiReportType" NOT NULL,
    "status" "AiReportStatus" NOT NULL DEFAULT 'QUEUED',
    "promptVersion" TEXT NOT NULL,
    "model" TEXT,
    "inputSummaryHash" TEXT NOT NULL,
    "result" JSONB,
    "renderedSummary" TEXT,
    "errorCode" TEXT,
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "AiReport_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "AiReport_sessionId_athleteId_reportType_inputSummaryHash_key"
  ON "AiReport"("sessionId", "athleteId", "reportType", "inputSummaryHash");
CREATE INDEX "AiReport_sessionId_reportType_status_idx"
  ON "AiReport"("sessionId", "reportType", "status");
CREATE INDEX "AiReport_athleteId_createdAt_idx"
  ON "AiReport"("athleteId", "createdAt");

ALTER TABLE "AiReport" ADD CONSTRAINT "AiReport_sessionId_fkey"
  FOREIGN KEY ("sessionId") REFERENCES "sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AiReport" ADD CONSTRAINT "AiReport_athleteId_fkey"
  FOREIGN KEY ("athleteId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
