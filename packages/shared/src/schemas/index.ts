import { z } from 'zod';

// Base schemas
export const dateSchema = z.coerce.date();
export const idSchema = z.string().uuid();

// User schemas
export const userSchema = z.object({
  id: idSchema,
  email: z.string().email(),
  name: z.string().min(1),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

export const coachSchema = userSchema.extend({
  bio: z.string().optional(),
  specialization: z.string().optional(),
});

export const athleteSchema = userSchema.extend({
  coachId: idSchema,
  teamId: idSchema.optional(),
  ageGroup: z.string().optional(),
  primaryStrokes: z.array(z.string()).optional(),
});

// Team schema
export const teamSchema = z.object({
  id: idSchema,
  name: z.string().min(1),
  coachId: idSchema,
  description: z.string().optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Workout schemas
export const workoutSetSchema = z.object({
  id: idSchema,
  order: z.number().int().positive(),
  reps: z.number().int().positive(),
  distance: z.number().positive().optional(),
  time: z.number().positive().optional(),
  stroke: z.string().optional(),
  pace: z.string().optional(),
  notes: z.string().optional(),
});

export const workoutSchema = z.object({
  id: idSchema,
  title: z.string().min(1),
  description: z.string().optional(),
  coachId: idSchema,
  isTemplate: z.boolean(),
  templateId: idSchema.optional(),
  sets: z.array(workoutSetSchema),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// Session schema
export const sessionSchema = z.object({
  id: idSchema,
  workoutId: idSchema,
  athleteId: idSchema,
  scheduledDate: dateSchema,
  completedDate: dateSchema.optional(),
  status: z.enum(['pending', 'completed', 'missed']),
  notes: z.string().optional(),
  createdAt: dateSchema,
  updatedAt: dateSchema,
});

// API Response schemas
export const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    data: dataSchema,
    error: z.null().optional(),
  });

export const apiErrorSchema = z.object({
  error: z.object({
    message: z.string(),
    code: z.string(),
    statusCode: z.number(),
  }),
  data: z.null().optional(),
});

// Export types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type Coach = z.infer<typeof coachSchema>;
export type Athlete = z.infer<typeof athleteSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type WorkoutSet = z.infer<typeof workoutSetSchema>;
export type Session = z.infer<typeof sessionSchema>;
