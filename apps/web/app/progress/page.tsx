'use client';

import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AppShell } from '../../src/components/layout/app-shell';
import { ProgressChart } from '../../src/components/analytics/progress-chart';
import { AthleteProgress, formatTime, getMyProgress } from '../../src/lib/analytics';
import { AiReport, getMyInsights } from '../../src/lib/ai';

export default function ProgressPage() {
  const [progress, setProgress] = useState<AthleteProgress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [insights, setInsights] = useState<AiReport[]>([]);

  useEffect(() => {
    void getMyProgress().then(setProgress).catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load progress'),
    );
    void getMyInsights().then(setInsights).catch(() => undefined);
  }, []);

  const metrics = progress?.metrics;

  return (
    <AppShell displayName="My progress">
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="primary.main" fontWeight={700}>Performance</Typography>
            <Typography variant="h4" component="h1" gutterBottom>My progress</Typography>
            <Typography color="text.secondary">A clear view of the work you have completed and the pace you are building.</Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {!progress && !error && <Typography color="text.secondary">Loading your progress...</Typography>}
          {progress && <>
            <Grid container spacing={2}>
              {[
                ['Average time', formatTime(metrics?.averageTimeMs ?? 0)],
                ['Best time', formatTime(metrics?.bestTimeMs ?? 0)],
                ['Worst time', formatTime(metrics?.worstTimeMs ?? 0)],
                ['Completed sessions', String(metrics?.completedSessions ?? 0)],
              ].map(([label, value]) => (
                <Grid item xs={6} md={3} key={label}>
                  <Card><CardContent><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h5" sx={{ mt: 1 }}>{value}</Typography></CardContent></Card>
                </Grid>
              ))}
            </Grid>
            <Card><CardContent><Typography variant="h6" gutterBottom>Average time trend</Typography><ProgressChart points={progress.progressPoints} /></CardContent></Card>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>AI feedback</Typography>
              {insights.length === 0 ? (
                <Typography color="text.secondary">Complete a session to receive personalized feedback.</Typography>
              ) : (
                <Stack spacing={2}>
                  {insights.slice(0, 3).map((insight) => (
                    <Box key={insight.id}>
                      <Typography fontWeight={700}>{insight.session?.title ?? 'Training session'}</Typography>
                      <Typography color="text.secondary">
                        {insight.status === 'COMPLETED'
                          ? insight.renderedSummary
                          : insight.status === 'FAILED'
                            ? 'Feedback could not be generated. Please try again later.'
                            : 'Feedback is being prepared...'}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              )}
            </CardContent></Card>
            <Card><CardContent>
              <Typography variant="h6" gutterBottom>Session history</Typography>
              {progress.sessionHistory.length === 0 ? (
                <Typography color="text.secondary">Your completed sessions will appear here.</Typography>
              ) : (
                <Table>
                  <TableHead><TableRow><TableCell>Session</TableCell><TableCell>Date</TableCell><TableCell>Average</TableCell><TableCell>Best</TableCell><TableCell>Reps</TableCell></TableRow></TableHead>
                  <TableBody>
                    {progress.sessionHistory.map((session) => (
                      <TableRow key={session.sessionId}>
                        <TableCell>{session.title}</TableCell>
                        <TableCell>{new Date(session.date).toLocaleDateString()}</TableCell>
                        <TableCell>{formatTime(session.averageTimeMs)}</TableCell>
                        <TableCell>{formatTime(session.bestTimeMs)}</TableCell>
                        <TableCell>{session.completedReps}/{session.totalReps}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent></Card>
          </>}
        </Stack>
      </Container>
    </AppShell>
  );
}
