'use client';

import TodayIcon from '@mui/icons-material/Today';
import {
  Alert,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../src/components/layout/app-shell';
import { getTodaySessions, TrainingSession } from '../../../src/lib/sessions';

export default function AthleteTodayPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void getTodaySessions().then(setSessions).catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load today’s sessions'),
    );
  }, []);

  return (
    <AppShell displayName="Today">
      <Container maxWidth="md" disableGutters>
        <Stack spacing={4}>
          <div>
            <Typography variant="overline" color="primary.main" fontWeight={700}>Athlete workspace</Typography>
            <Typography variant="h4" component="h1" gutterBottom>Today&apos;s session</Typography>
            <Typography color="text.secondary">Log your work while it is fresh.</Typography>
          </div>
          {error && <Alert severity="error">{error}</Alert>}
          {sessions.length === 0 && !error && (
            <Card><CardContent><Stack spacing={2} alignItems="flex-start">
              <TodayIcon color="primary" sx={{ fontSize: 42 }} />
              <Typography variant="h6">Nothing published for today</Typography>
              <Typography color="text.secondary">Your coach&apos;s next session will appear here.</Typography>
            </Stack></CardContent></Card>
          )}
          {sessions.map((session) => (
            <Card key={session.id}>
              <CardActionArea component={NextLink} href={`/athlete/sessions/${session.id}`}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{session.title}</Typography>
                  <Typography color="text.secondary">{session.sessionType} · {session.mainSets.length} main set blocks</Typography>
                  <Button sx={{ mt: 2 }} variant="contained">Open session</Button>
                </CardContent>
              </CardActionArea>
            </Card>
          ))}
        </Stack>
      </Container>
    </AppShell>
  );
}
