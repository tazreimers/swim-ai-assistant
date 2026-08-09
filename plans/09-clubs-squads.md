# Plan 09: Clubs, Users, Invitations, and Squads

## AI implementation prompt

Implement the multi-tenant club and squad foundation for Swim AI. Coaches must
be able to create a club, invite coaches and athletes, and create squads.
Athletes must be able to accept an invitation and join a squad. Keep all
authorization in the NestJS API and align the schema with the MVP terminology.

## Objective

Provide reliable organization membership and role permissions so all later
session, results, and AI features have an explicit club/squad scope.

## Scope

- User profile synchronization from Supabase Auth.
- Club creation and coach ownership.
- Coach and athlete invitation lifecycle.
- Squad creation, editing, archiving, and membership.
- Coach, club administrator, and athlete permissions.
- Migration from or compatibility mapping for the existing `Team` model.
- MUI pages and reusable tables/forms for club and squad management.

## Data model

Define and migrate entities equivalent to:

- `users`: Supabase user ID, profile fields, role, timestamps.
- `clubs`: name, owner, status, timestamps.
- `club_memberships`: user, club, role, status, unique membership.
- `invitations`: club, email, intended role, token/hash, expiry, status.
- `squads`: club, name, description, active status.
- `squad_memberships`: squad, athlete/user, status, timestamps.

Use foreign keys, unique constraints, indexes for membership lookups, and
explicit deletion behavior. Do not silently rename existing data; provide a
migration or compatibility plan for `Coach`, `Athlete`, and `Team`.

## API surface

- `GET /me`
- `POST /clubs`
- `GET /clubs/:clubId`
- `PATCH /clubs/:clubId`
- `POST /clubs/:clubId/invitations`
- `GET /clubs/:clubId/invitations`
- `POST /invitations/:token/accept`
- `POST /clubs/:clubId/squads`
- `GET /clubs/:clubId/squads`
- `PATCH /squads/:squadId`
- `POST /squads/:squadId/members`
- `DELETE /squads/:squadId/members/:userId`

Validate DTOs with shared schemas where appropriate. Scope every query to the
authenticated user's active club membership.

## Frontend routes and components

- `/onboarding`
- `/clubs`
- `/clubs/new`
- `/clubs/[clubId]`
- `/clubs/[clubId]/members`
- `/clubs/[clubId]/squads`
- `/invitations/[token]`
- `ClubSwitcher`, `MemberTable`, `InvitationDialog`, `SquadForm`,
  `SquadMemberDialog`, and `RoleBadge`.

Support useful empty states, invitation failures, duplicate membership
messages, and optimistic UI only where rollback is reliable.

## Security requirements

- Verify Supabase JWTs in the API.
- Enforce club membership and role permissions on every endpoint.
- Never authorize from submitted `clubId` or `userId` alone.
- Invitation tokens must be single-use, expiring, hashed at rest, and scoped
  to the intended club and role.
- Add database RLS policies if the chosen Supabase/Prisma connection model can
  evaluate them; retain API checks regardless.

## Acceptance criteria

- A coach can create a club in onboarding.
- A club owner can invite a coach and an athlete.
- An invited user can accept once and becomes an appropriate member.
- A coach can create a squad and add/remove athletes.
- Users cannot view or mutate another club's data.
- Duplicate memberships and expired invitations are handled clearly.
- The existing data model has a documented migration path.

## Tests

- Service/controller authorization tests for each role.
- Invitation expiry, replay, and wrong-email tests.
- Membership uniqueness and cross-club access tests.
- Prisma migration/seed tests.
- Frontend form, table, empty state, and invitation acceptance tests.

## Out of scope

- Messaging, parent portals, billing, payments, meet management, and advanced
  staff hierarchies.

