-- Rename the external identity field from Clerk-specific terminology.
ALTER TABLE "User" RENAME COLUMN "clerkId" TO "authId";
ALTER INDEX "User_clerkId_key" RENAME TO "User_authId_key";

CREATE TYPE "ClubRole" AS ENUM ('OWNER', 'COACH', 'ATHLETE');
CREATE TYPE "MembershipStatus" AS ENUM ('ACTIVE', 'SUSPENDED');
CREATE TYPE "ClubStatus" AS ENUM ('ACTIVE', 'ARCHIVED');
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

CREATE TABLE "Club" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "ownerId" UUID NOT NULL,
    "status" "ClubStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Club_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ClubMembership" (
    "id" UUID NOT NULL,
    "clubId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" "ClubRole" NOT NULL,
    "status" "MembershipStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "ClubMembership_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Invitation" (
    "id" UUID NOT NULL,
    "clubId" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "role" "ClubRole" NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "invitedById" UUID NOT NULL,
    "acceptedById" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Invitation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Squad" (
    "id" UUID NOT NULL,
    "clubId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Squad_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SquadMembership" (
    "id" UUID NOT NULL,
    "squadId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "SquadMembership_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ClubMembership_clubId_userId_key" ON "ClubMembership"("clubId", "userId");
CREATE UNIQUE INDEX "Invitation_tokenHash_key" ON "Invitation"("tokenHash");
CREATE UNIQUE INDEX "Squad_clubId_name_key" ON "Squad"("clubId", "name");
CREATE UNIQUE INDEX "SquadMembership_squadId_userId_key" ON "SquadMembership"("squadId", "userId");

CREATE INDEX "Club_ownerId_idx" ON "Club"("ownerId");
CREATE INDEX "Club_status_idx" ON "Club"("status");
CREATE INDEX "ClubMembership_userId_status_idx" ON "ClubMembership"("userId", "status");
CREATE INDEX "ClubMembership_clubId_role_status_idx" ON "ClubMembership"("clubId", "role", "status");
CREATE INDEX "Invitation_clubId_status_idx" ON "Invitation"("clubId", "status");
CREATE INDEX "Invitation_email_status_idx" ON "Invitation"("email", "status");
CREATE INDEX "Invitation_expiresAt_idx" ON "Invitation"("expiresAt");
CREATE INDEX "Squad_clubId_isActive_idx" ON "Squad"("clubId", "isActive");
CREATE INDEX "SquadMembership_userId_idx" ON "SquadMembership"("userId");

ALTER TABLE "Club" ADD CONSTRAINT "Club_ownerId_fkey"
  FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_clubId_fkey"
  FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ClubMembership" ADD CONSTRAINT "ClubMembership_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_clubId_fkey"
  FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_invitedById_fkey"
  FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Invitation" ADD CONSTRAINT "Invitation_acceptedById_fkey"
  FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Squad" ADD CONSTRAINT "Squad_clubId_fkey"
  FOREIGN KEY ("clubId") REFERENCES "Club"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SquadMembership" ADD CONSTRAINT "SquadMembership_squadId_fkey"
  FOREIGN KEY ("squadId") REFERENCES "Squad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SquadMembership" ADD CONSTRAINT "SquadMembership_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
