// Core domain types for Swim AI platform

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coach extends User {
  bio?: string;
  specialization?: string;
}

export interface Athlete extends User {
  coachId: string;
  teamId?: string;
  ageGroup?: string;
  primaryStrokes?: string[];
}

export interface Team {
  id: string;
  name: string;
  coachId: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Workout {
  id: string;
  title: string;
  description?: string;
  coachId: string;
  isTemplate: boolean;
  templateId?: string;
  sets: WorkoutSet[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkoutSet {
  id: string;
  order: number;
  reps: number;
  distance?: number;
  time?: number;
  stroke?: string;
  pace?: string;
  notes?: string;
}

export interface Session {
  id: string;
  workoutId: string;
  athleteId: string;
  scheduledDate: Date;
  completedDate?: Date;
  status: 'pending' | 'completed' | 'missed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  error?: null;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
  data?: null;
}
