import { z } from 'zod';
import {
  AGE_GROUPS,
  SESSION_STATUS,
  SWIM_STROKES,
} from '../constants/index.js';

// Base schemas
export const dateSchema = z.coerce.date();
export const idSchema = z.string().uuid();
export const swimStrokeSchema = z.enum([
  SWIM_STROKES.FREESTYLE,
  SWIM_STROKES.BACKSTROKE,
  SWIM_STROKES.BREASTSTROKE,
  SWIM_STROKES.BUTTERFLY,
  SWIM_STROKES.INDIVIDUAL_MEDLEY,
]);
export const sessionStatusSchema = z.enum([
  SESSION_STATUS.PENDING,
  SESSION_STATUS.COMPLETED,
  SESSION_STATUS.MISSED,
]);
export const ageGroupSchema = z.enum([
  AGE_GROUPS.U10,
  AGE_GROUPS.U12,
  AGE_GROUPS.U14,
  AGE_GROUPS.U16,
  AGE_GROUPS.U18,
  AGE_GROUPS.SENIOR,
  AGE_GROUPS.MASTER,
]);

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
  ageGroup: ageGroupSchema.optional(),
  primaryStrokes: z.array(swimStrokeSchema).default([]),
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
  stroke: swimStrokeSchema.optional(),
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
  status: sessionStatusSchema,
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

export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

// Export types inferred from schemas
export type User = z.infer<typeof userSchema>;
export type Coach = z.infer<typeof coachSchema>;
export type Athlete = z.infer<typeof athleteSchema>;
export type Team = z.infer<typeof teamSchema>;
export type Workout = z.infer<typeof workoutSchema>;
export type WorkoutSet = z.infer<typeof workoutSetSchema>;
export type Session = z.infer<typeof sessionSchema>;
