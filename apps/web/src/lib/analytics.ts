import { fetchApi } from './api';

export type ProgressPoint = {
  sessionId: string;
  date: string;
  averageTimeMs: number;
};

export type AthleteProgress = {
  metrics: {
    averageTimeMs: number;
    bestTimeMs: number;
    worstTimeMs: number;
    averageRepDifferenceMs: number;
    completedSessions: number;
  };
  progressPoints: ProgressPoint[];
  sessionHistory: Array<{
    sessionId: string;
    title: string;
    date: string;
    averageTimeMs: number;
    bestTimeMs: number;
    completedReps: number;
    totalReps: number;
  }>;
};

export type CoachDashboard = {
  completedResults: number;
  athletesWithResults: number;
  averageSessionPerformanceMs: number;
  mostImproved: {
    athleteId: string;
    athleteName: string;
    improvementMs: number;
  } | null;
  largestImprovementMs: number;
  largestPaceDropOff: {
    athleteId: string;
    athleteName: string;
    dropOffMs: number;
  } | null;
  recentSessions: number;
  latestCompletedSessionId: string | null;
  latestAiSummary: string | null;
}

export async function getMyProgress() {
  return fetchApi<AthleteProgress>('/athletes/me/progress');
}

export async function getCoachDashboard(clubId: string) {
  return fetchApi<CoachDashboard>(`/coach/dashboard?clubId=${clubId}`);
}

export function formatTime(milliseconds: number) {
  if (!milliseconds) return '—';
  return `${(milliseconds / 1000).toFixed(2)}s`;
}
