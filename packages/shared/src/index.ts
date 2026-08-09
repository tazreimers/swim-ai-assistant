// Export domain types from the schemas so runtime validation and static types
// remain defined by the same source.
export type {
  User,
  Coach,
  Athlete,
  Team,
  Workout,
  WorkoutSet,
  Session,
} from './schemas/index.js';
export type {
  ApiResponse,
  ApiError,
  PaginationParams,
  PaginationMeta,
} from './types/index.js';

// Export all schemas
export {
  userSchema,
  coachSchema,
  athleteSchema,
  teamSchema,
  workoutSchema,
  workoutSetSchema,
  sessionSchema,
  apiResponseSchema,
  apiErrorSchema,
  dateSchema,
  idSchema,
  swimStrokeSchema,
  sessionStatusSchema,
  ageGroupSchema,
  paginationParamsSchema,
} from './schemas/index.js';

// Export all constants
export * from './constants/index.js';

// Export all utilities
export * from './utils/index.js';
