model Coach {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique

  athletes  Athlete[]

  createdAt DateTime @default(now())
}

model Athlete {
  id          String @id @default(cuid())

  firstName   String
  lastName    String

  dob         DateTime?

  coachId     String
  coach       Coach @relation(fields: [coachId], references: [id])

  sessions    SessionAttendance[]
}

model Workout {
  id          String @id @default(cuid())

  title       String

  description String?

  createdById String

  createdAt   DateTime @default(now())

  sets        WorkoutSet[]
}

model WorkoutSet {
  id          String @id @default(cuid())

  workoutId   String
  workout     Workout @relation(fields: [workoutId], references: [id])

  distance    Int
  stroke      String
  interval    String?
  notes       String?
}

model SessionAttendance {
  id          String @id @default(cuid())

  athleteId   String
  athlete     Athlete @relation(fields: [athleteId], references: [id])

  date        DateTime
}