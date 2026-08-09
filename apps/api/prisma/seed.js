const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const coachUser = await prisma.user.upsert({
    where: { authId: 'seed_coach_auth_id' },
    update: {},
    create: {
      authId: 'seed_coach_auth_id',
      email: 'coach@swim-ai.local',
      name: 'Alex Morgan',
      coach: {
        create: {
          bio: 'Head coach for the Swim AI development team.',
          specialization: 'Performance and technique',
        },
      },
    },
    include: { coach: true },
  });

  const coach = coachUser.coach;
  const team = await prisma.team.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000001',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      name: 'Swim AI Development Squad',
      description: 'Sample team for local development.',
      coachId: coach.id,
    },
  });

  const athleteUser = await prisma.user.upsert({
    where: { authId: 'seed_athlete_auth_id' },
    update: {},
    create: {
      authId: 'seed_athlete_auth_id',
      email: 'athlete@swim-ai.local',
      name: 'Taylor Reed',
      athlete: {
        create: {
          coachId: coach.id,
          teamId: team.id,
          ageGroup: 'u16',
          primaryStrokes: ['freestyle', 'backstroke'],
        },
      },
    },
    include: { athlete: true },
  });

  const club = await prisma.club.upsert({
    where: { id: '00000000-0000-0000-0000-000000000004' },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000004',
      name: 'Swim AI Development Club',
      ownerId: coachUser.id,
    },
  });

  await prisma.clubMembership.upsert({
    where: {
      clubId_userId: { clubId: club.id, userId: coachUser.id },
    },
    update: {},
    create: {
      clubId: club.id,
      userId: coachUser.id,
      role: 'OWNER',
    },
  });

  await prisma.clubMembership.upsert({
    where: {
      clubId_userId: { clubId: club.id, userId: athleteUser.id },
    },
    update: {},
    create: {
      clubId: club.id,
      userId: athleteUser.id,
      role: 'ATHLETE',
    },
  });

  const squad = await prisma.squad.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000005',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000005',
      clubId: club.id,
      name: 'Development Squad',
      description: 'Sample squad for local development.',
    },
  });

  await prisma.squadMembership.upsert({
    where: {
      squadId_userId: { squadId: squad.id, userId: athleteUser.id },
    },
    update: {},
    create: {
      squadId: squad.id,
      userId: athleteUser.id,
    },
  });

  const workout = await prisma.workout.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000002',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000002',
      title: 'Aerobic Freestyle Foundation',
      description: 'Sample aerobic workout for local development.',
      coachId: coach.id,
      isTemplate: true,
      sets: {
        create: [
          {
            position: 1,
            reps: 4,
            distance: 100,
            stroke: 'freestyle',
            pace: 'easy',
            notes: '20 seconds rest',
          },
          {
            position: 2,
            reps: 8,
            distance: 50,
            stroke: 'freestyle',
            pace: 'moderate',
            notes: '10 seconds rest',
          },
        ],
      },
    },
  });

  await prisma.session.upsert({
    where: {
      id: '00000000-0000-0000-0000-000000000003',
    },
    update: {},
    create: {
      id: '00000000-0000-0000-0000-000000000003',
      workoutId: workout.id,
      athleteId: athleteUser.athlete.id,
      scheduledDate: new Date('2026-08-10T07:00:00.000Z'),
      status: 'PENDING',
    },
  });

  console.log('Database seed completed.');
}

main()
  .catch((error) => {
    console.error('Database seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
