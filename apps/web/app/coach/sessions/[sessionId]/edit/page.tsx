'use client';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PublishIcon from '@mui/icons-material/Publish';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Stack,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { AppShell } from '../../../../../src/components/layout/app-shell';
import { createSupabaseBrowserClient } from '../../../../../src/lib/supabase/client';
import {
  completePhotoUpload,
  createPhotoUpload,
  getSession,
  publishSession,
  TrainingSession,
} from '../../../../../src/lib/sessions';

export default function EditSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    void getSession(params.sessionId).then(setSession).catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load session'),
    );
  }, [params.sessionId]);

  async function handlePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(null);
    setNotice(null);
    setIsUploading(true);
    try {
      const upload = await createPhotoUpload(params.sessionId, file);
      const supabase = createSupabaseBrowserClient();
      const { error: uploadError } = await supabase.storage.from(upload.bucket).uploadToSignedUrl(upload.path, upload.token, file);
      if (uploadError) throw uploadError;
      await completePhotoUpload(params.sessionId, upload);
      setNotice('Whiteboard photo uploaded successfully.');
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Unable to upload photo');
    } finally {
      setIsUploading(false);
    }
  }

  async function handlePublish() {
    setError(null);
    setIsPublishing(true);
    try {
      setSession(await publishSession(params.sessionId));
      setNotice('Session published to the squad.');
    } catch (publishError) {
      setError(publishError instanceof Error ? publishError.message : 'Unable to publish session');
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <AppShell displayName={session?.title ?? 'Session'}>
      <Container maxWidth="md" disableGutters>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {notice && <Alert severity="success">{notice}</Alert>}
          {!session && !error && <Typography color="text.secondary">Loading session...</Typography>}
          {session && <>
            <div>
              <Typography variant="overline" color="primary.main" fontWeight={700}>Session draft</Typography>
              <Typography variant="h4" component="h1" gutterBottom>{session.title}</Typography>
              <Typography color="text.secondary">{session.sessionType} · {new Date(session.scheduledDate).toLocaleString()}</Typography>
            </div>
            <Card><CardContent><Stack spacing={2}>
              <Typography variant="h6">Main set</Typography>
              {session.mainSets.map((set) => (
                <Stack key={set.id} direction="row" justifyContent="space-between">
                  <Typography>{set.position}. {set.repetitions} × {set.distanceMeters ?? '—'}m {set.stroke ?? ''}</Typography>
                  <Typography color="text.secondary">{set.sendOffSeconds ? `${set.sendOffSeconds}s send-off` : ''}</Typography>
                </Stack>
              ))}
            </Stack></CardContent></Card>
            <Card><CardContent><Stack spacing={2}>
              <Typography variant="h6">Whiteboard photo</Typography>
              <Typography color="text.secondary">Upload a clear JPG, PNG, or WebP image up to 10 MB.</Typography>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />} disabled={isUploading}>
                {isUploading ? 'Uploading...' : 'Upload photo'}
                <input hidden type="file" accept="image/jpeg,image/png,image/webp" onChange={handlePhoto} />
              </Button>
              {isUploading && <LinearProgress />}
            </Stack></CardContent></Card>
            <Button
              variant="contained"
              size="large"
              startIcon={<PublishIcon />}
              onClick={() => void handlePublish()}
              disabled={isPublishing || session.workflowStatus !== 'DRAFT'}
            >
              {session.workflowStatus === 'DRAFT' ? (isPublishing ? 'Publishing...' : 'Publish session') : session.workflowStatus.toLowerCase()}
            </Button>
            <Button onClick={() => router.push('/coach/sessions/new')} color="inherit">Create another session</Button>
          </>}
        </Stack>
      </Container>
    </AppShell>
  );
}
