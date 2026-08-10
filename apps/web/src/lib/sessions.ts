import { fetchApi } from './api';

export type MainSet = {
  id: string;
  position: number;
  stroke: string | null;
  distanceMeters: number | null;
  repetitions: number;
  sendOffSeconds: number | null;
  notes: string | null;
};

export type RepResult = {
  id: string;
  mainSetId: string;
  repNumber: number;
  timeMs: number;
  notes: string | null;
};

export type TrainingSession = {
  id: string;
  clubId: string;
  squadId: string;
  title: string;
  sessionType: string;
  scheduledDate: string;
  workflowStatus: 'DRAFT' | 'PUBLISHED' | 'COMPLETED' | 'ARCHIVED';
  notes: string | null;
  mainSets: MainSet[];
  results?: Array<{ id: string; repResults: RepResult[]; status: string }>;
  myResult?: { id: string; repResults: RepResult[]; status: string } | null;
};

export async function createSession(input: {
  clubId: string;
  squadId: string;
  title: string;
  scheduledDate: string;
  sessionType: string;
  notes?: string;
  mainSets: Array<{
    position: number;
    stroke?: string;
    distanceMeters?: number;
    repetitions: number;
    sendOffSeconds?: number;
    notes?: string;
  }>;
}) {
  return fetchApi<TrainingSession>('/sessions', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getSession(sessionId: string) {
  return fetchApi<TrainingSession>(`/sessions/${sessionId}`);
}

export async function publishSession(sessionId: string) {
  return fetchApi<TrainingSession>(`/sessions/${sessionId}/publish`, {
    method: 'POST',
  });
}

export async function getTodaySessions() {
  return fetchApi<TrainingSession[]>('/athletes/me/sessions/today');
}

export async function saveMyResult(
  sessionId: string,
  reps: Array<Pick<RepResult, 'mainSetId' | 'repNumber' | 'timeMs'>>,
) {
  return fetchApi(`/sessions/${sessionId}/my-result`, {
    method: 'PUT',
    body: JSON.stringify({ reps }),
  });
}

export async function completeMyResult(sessionId: string) {
  return fetchApi(`/sessions/${sessionId}/my-result/complete`, {
    method: 'POST',
  });
}

export async function createPhotoUpload(
  sessionId: string,
  file: File,
) {
  return fetchApi<{
    bucket: string;
    path: string;
    token: string;
    contentType: string;
    sizeBytes: number;
  }>(`/sessions/${sessionId}/photo`, {
    method: 'POST',
    body: JSON.stringify({
      fileName: file.name,
      contentType: file.type,
      sizeBytes: file.size,
    }),
  });
}

export async function completePhotoUpload(
  sessionId: string,
  upload: { path: string; contentType: string; sizeBytes: number },
) {
  return fetchApi(`/sessions/${sessionId}/photo/complete`, {
    method: 'POST',
    body: JSON.stringify({
      storagePath: upload.path,
      contentType: upload.contentType,
      sizeBytes: upload.sizeBytes,
    }),
  });
}
