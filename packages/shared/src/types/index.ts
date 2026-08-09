export type {
  User,
  Coach,
  Athlete,
  Team,
  Workout,
  WorkoutSet,
  Session,
} from '../schemas';

export interface ApiResponse<T> {
  data: T;
  error?: null | undefined;
}

export interface ApiError {
  error: {
    message: string;
    code: string;
    statusCode: number;
  };
  data?: null;
}

export interface PaginationParams {
  page?: number;
  pageSize?: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}
