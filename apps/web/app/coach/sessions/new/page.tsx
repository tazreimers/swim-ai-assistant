'use client';

import AddIcon from '@mui/icons-material/Add';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { AppShell } from '../../../../src/components/layout/app-shell';
import { ClubDetail, getClub, listClubs, ClubSummary } from '../../../../src/lib/clubs';
import { createSession } from '../../../../src/lib/sessions';

type SetDraft = {
  position: number;
  stroke: string;
  distanceMeters: string;
  repetitions: string;
  sendOffSeconds: string;
  notes: string;
};

const emptySet = (position: number): SetDraft => ({
  position,
  stroke: '',
  distanceMeters: '',
  repetitions: '1',
  sendOffSeconds: '',
  notes: '',
});

export default function NewSessionPage() {
  const router = useRouter();
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [clubId, setClubId] = useState('');
  const [squadId, setSquadId] = useState('');
  const [title, setTitle] = useState('');
  const [sessionType, setSessionType] = useState('Main set');
  const [scheduledDate, setScheduledDate] = useState(new Date().toISOString().slice(0, 16));
  const [notes, setNotes] = useState('');
  const [sets, setSets] = useState<SetDraft[]>([emptySet(1)]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void listClubs().then((items) => {
      setClubs(items);
      if (items[0]) setClubId(items[0].club.id);
    }).catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load clubs'),
    );
  }, []);

  useEffect(() => {
    if (!clubId) return;
    void getClub(clubId).then((item) => {
      setClub(item);
      setSquadId(item.squads[0]?.id ?? '');
    }).catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load squads'),
    );
  }, [clubId]);

  function updateSet(index: number, field: keyof SetDraft, value: string) {
    setSets((current) => current.map((set, setIndex) =>
      setIndex === index ? { ...set, [field]: value } : set,
    ));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const session = await createSession({
        clubId,
        squadId,
        title,
        sessionType,
        scheduledDate: new Date(scheduledDate).toISOString(),
        notes,
        mainSets: sets.map((set) => ({
          position: set.position,
          stroke: set.stroke || undefined,
          distanceMeters: set.distanceMeters ? Number(set.distanceMeters) : undefined,
          repetitions: Number(set.repetitions),
          sendOffSeconds: set.sendOffSeconds ? Number(set.sendOffSeconds) : undefined,
          notes: set.notes || undefined,
        })),
      });
      router.push(`/coach/sessions/${session.id}/edit`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create session');
      setIsSubmitting(false);
    }
  }

  return (
    <AppShell displayName="New session">
      <Container maxWidth="md" disableGutters>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <BoxHeader />
          {error && <Alert severity="error">{error}</Alert>}
          <Card><CardContent><Stack spacing={2}>
            <Typography variant="h6">Session details</Typography>
            <TextField select label="Club" value={clubId} onChange={(event) => setClubId(event.target.value)} required>
              {clubs.map((item) => <MenuItem key={item.club.id} value={item.club.id}>{item.club.name}</MenuItem>)}
            </TextField>
            <TextField select label="Squad" value={squadId} onChange={(event) => setSquadId(event.target.value)} required>
              {club?.squads.map((squad) => <MenuItem key={squad.id} value={squad.id}>{squad.name}</MenuItem>)}
            </TextField>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={7}><TextField label="Session title" value={title} onChange={(event) => setTitle(event.target.value)} required /></Grid>
              <Grid item xs={12} sm={5}><TextField label="Session type" value={sessionType} onChange={(event) => setSessionType(event.target.value)} required /></Grid>
            </Grid>
            <TextField label="Date and time" type="datetime-local" value={scheduledDate} onChange={(event) => setScheduledDate(event.target.value)} InputLabelProps={{ shrink: true }} required />
            <TextField label="Coach notes" value={notes} onChange={(event) => setNotes(event.target.value)} multiline minRows={2} />
          </Stack></CardContent></Card>
          <Card><CardContent><Stack spacing={2}>
            <Typography variant="h6">Main set</Typography>
            {sets.map((set, index) => (
              <Card variant="outlined" key={set.position}><CardContent><Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography fontWeight={700}>Set {set.position}</Typography>
                  {sets.length > 1 && <Button color="error" onClick={() => setSets((current) => current.filter((_, i) => i !== index))} startIcon={<DeleteOutlineIcon />}>Remove</Button>}
                </Stack>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}><TextField label="Stroke" value={set.stroke} onChange={(event) => updateSet(index, 'stroke', event.target.value)} /></Grid>
                  <Grid item xs={6} sm={3}><TextField label="Distance (m)" type="number" value={set.distanceMeters} onChange={(event) => updateSet(index, 'distanceMeters', event.target.value)} /></Grid>
                  <Grid item xs={6} sm={2}><TextField label="Reps" type="number" value={set.repetitions} onChange={(event) => updateSet(index, 'repetitions', event.target.value)} required /></Grid>
                  <Grid item xs={12} sm={3}><TextField label="Send-off (sec)" type="number" value={set.sendOffSeconds} onChange={(event) => updateSet(index, 'sendOffSeconds', event.target.value)} /></Grid>
                </Grid>
                <TextField label="Set notes" value={set.notes} onChange={(event) => updateSet(index, 'notes', event.target.value)} />
              </Stack></CardContent></Card>
            ))}
            <Button startIcon={<AddIcon />} onClick={() => setSets((current) => [...current, emptySet(current.length + 1)])} sx={{ alignSelf: 'flex-start' }}>
              Add set
            </Button>
          </Stack></CardContent></Card>
          <Button type="submit" variant="contained" size="large" disabled={isSubmitting || !clubId || !squadId}>
            {isSubmitting ? 'Saving draft...' : 'Save draft'}
          </Button>
        </Stack>
      </Container>
    </AppShell>
  );
}

function BoxHeader() {
  return (
    <div>
      <Typography variant="overline" color="primary.main" fontWeight={700}>Coach workspace</Typography>
      <Typography variant="h4" component="h1" gutterBottom>Create training session</Typography>
      <Typography color="text.secondary">Build the session once, then publish it to your squad.</Typography>
    </div>
  );
}
