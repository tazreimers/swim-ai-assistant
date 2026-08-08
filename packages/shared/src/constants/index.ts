// Swim strokes
export const SWIM_STROKES = {
  FREESTYLE: 'freestyle',
  BACKSTROKE: 'backstroke',
  BREASTSTROKE: 'breaststroke',
  BUTTERFLY: 'butterfly',
  INDIVIDUAL_MEDLEY: 'im',
} as const;

export type SwimStroke = typeof SWIM_STROKES[keyof typeof SWIM_STROKES];

// Pool sizes (in meters)
export const POOL_SIZES = {
  YARDS_SHORT: 25,
  METERS_SHORT: 25,
  METERS_OLYMPIC: 50,
} as const;

export type PoolSize = typeof POOL_SIZES[keyof typeof POOL_SIZES];

// Distance conversions
export const DISTANCE_CONVERSIONS = {
  YARDS_TO_METERS: 0.9144,
  METERS_TO_YARDS: 1.0936,
} as const;

// Paces (in seconds per 100 meters)
export const PACE_LEVELS = {
  EASY: 'easy',
  MODERATE: 'moderate',
  THRESHOLD: 'threshold',
  VO2_MAX: 'vo2max',
  SPRINT: 'sprint',
} as const;

export type PaceLevel = typeof PACE_LEVELS[keyof typeof PACE_LEVELS];

// Session status
export const SESSION_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  MISSED: 'missed',
} as const;

export type SessionStatus = typeof SESSION_STATUS[keyof typeof SESSION_STATUS];

// Age groups
export const AGE_GROUPS = {
  U10: 'u10',
  U12: 'u12',
  U14: 'u14',
  U16: 'u16',
  U18: 'u18',
  SENIOR: 'senior',
  MASTER: 'master',
} as const;

export type AgeGroup = typeof AGE_GROUPS[keyof typeof AGE_GROUPS];

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
