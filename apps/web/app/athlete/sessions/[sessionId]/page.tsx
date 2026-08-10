'use client';

import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../../src/components/layout/app-shell';
import {
  completeMyResult,
  getSession,
  saveMyResult,
  TrainingSession,
} from '../../../../src/lib/sessions';

type RepInput = { mainSetId: string; repNumber: number; timeMs: string };

export default function AthleteSessionPage() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();
  const [session, setSession] = useState<TrainingSession | null>(null);
  const [inputs, setInputs] = useState<RepInput[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void getSession(params.sessionId).then((item) => {
      setSession(item);
      const existing = new Map((item.myResult?.repResults ?? []).map((rep) => [`${rep.mainSetId}:${rep.repNumber}`, rep]));
      setInputs(item.mainSets.flatMap((set) =>
        Array.from({ length: set.repetitions }, (_, index) => {
          const rep = existing.get(`${set.id}:${index + 1}`);
          return { mainSetId: set.id, repNumber: index + 1, timeMs: rep ? String(rep.timeMs / 1000) : '' };
        }),
      ));
    }).catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load session'),
    );
  }, [params.sessionId]);

  function updateTime(index: number, value: string) {
    setInputs((current) => current.map((input, inputIndex) => inputIndex === index ? { ...input, timeMs: value } : input));
  }

  async function handleSave(complete = false) {
    setError(null);
    setNotice(null);
    setIsSaving(true);
    try {
      const reps = inputs.filter((input) => input.timeMs).map((input) => ({
        mainSetId: input.mainSetId,
        repNumber: input.repNumber,
        timeMs: Math.round(Number(input.timeMs) * 1000),
      }));
      await saveMyResult(params.sessionId, reps);
      if (complete) await completeMyResult(params.sessionId);
      setNotice(complete ? 'Session completed. Nice work.' : 'Progress saved.');
      if (complete) router.push('/athlete/today');
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Unable to save results');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AppShell displayName="Log session">
      <Container maxWidth="md" disableGutters>
        <Stack spacing={3}>
          {error && <Alert severity="error">{error}</Alert>}
          {notice && <Alert severity="success">{notice}</Alert>}
          {!session && !error && <Typography color="text.secondary">Loading session...</Typography>}
          {session && <>
            <div>
              <Typography variant="h4" component="h1" gutterBottom>{session.title}</Typography>
              <Typography color="text.secondary">{session.sessionType} · Enter seconds for each rep.</Typography>
            </div>
            {session.mainSets.map((set) => (
              <Card key={set.id}><CardContent><Stack spacing={2}>
                <Typography variant="h6">{set.position}. {set.repetitions} × {set.distanceMeters ?? '—'}m {set.stroke ?? ''}</Typography>
                <Grid container spacing={2}>
                  {inputs.map((input, index) => input.mainSetId === set.id && (
                    <Grid item xs={6} sm={3} key={`${input.mainSetId}-${input.repNumber}`}>
                      <TextField label={`Rep ${input.repNumber}`} type="number" inputProps={{ min: 0.1, step: 0.01 }} value={input.timeMs} onChange={(event) => updateTime(index, event.target.value)} placeholder="e.g. 42.50" />
                    </Grid>
                  ))}
                </Grid>
              </Stack></CardContent></Card>
            ))}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button variant="outlined" startIcon={<SaveIcon />} onClick={() => void handleSave()} disabled={isSaving}>Save progress</Button>
              <Button variant="contained" startIcon={<CheckIcon />} onClick={() => void handleSave(true)} disabled={isSaving}>Complete session</Button>
            </Stack>
          </>}
        </Stack>
      </Container>
    </AppShell>
  );
}
