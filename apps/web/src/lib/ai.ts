import { fetchApi } from './api';

export type AiReport = {
  id: string;
  sessionId: string;
  athleteId?: string | null;
  reportType: 'SESSION' | 'ATHLETE' | 'COACH';
  status: 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'STALE';
  renderedSummary?: string | null;
  result?: Record<string, unknown> | null;
  errorCode?: string | null;
  retryCount: number;
  completedAt?: string | null;
  createdAt: string;
  session?: { title: string | null; scheduledDate: string };
};

export function getMyInsights() {
  return fetchApi<AiReport[]>('/athletes/me/ai-insights');
}

export function getSessionAiReport(sessionId: string) {
  return fetchApi<AiReport | null>(`/sessions/${sessionId}/ai-report`);
}

export function generateAiReport(sessionId: string) {
  return fetchApi<AiReport>(`/sessions/${sessionId}/ai-report`, { method: 'POST' });
}
