'use client';

import {
  Alert,
  Button,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../src/components/layout/app-shell';
import { listClubs } from '../../../src/lib/clubs';
import { CoachDashboard, formatTime, getCoachDashboard } from '../../../src/lib/analytics';
import { generateAiReport } from '../../../src/lib/ai';

export default function CoachDashboardPage() {
  const [dashboard, setDashboard] = useState<CoachDashboard | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const latestCompletedSessionId = dashboard?.latestCompletedSessionId;

  useEffect(() => {
    void listClubs()
      .then((clubs) => {
        const clubId = clubs[0]?.club.id;
        if (!clubId) throw new Error('Create or join a club to view the coach dashboard');
        return getCoachDashboard(clubId);
      })
      .then(setDashboard)
      .catch((loadError: unknown) =>
        setError(loadError instanceof Error ? loadError.message : 'Unable to load dashboard'),
      );
  }, []);

  return (
    <AppShell displayName="Coach dashboard">
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          <Box>
            <Typography variant="overline" color="primary.main" fontWeight={700}>Coach workspace</Typography>
            <Typography variant="h4" component="h1" gutterBottom>Performance dashboard</Typography>
            <Typography color="text.secondary">See the patterns that deserve your attention after each session.</Typography>
          </Box>
          {error && <Alert severity="error">{error}</Alert>}
          {!dashboard && !error && <Typography color="text.secondary">Loading dashboard...</Typography>}
          {dashboard && <>
            <Grid container spacing={2}>
              {[
                ['Completed results', String(dashboard.completedResults)],
                ['Athletes reporting', String(dashboard.athletesWithResults)],
                ['Recent sessions', String(dashboard.recentSessions)],
                ['Average performance', formatTime(dashboard.averageSessionPerformanceMs)],
              ].map(([label, value]) => (
                <Grid item xs={6} md={3} key={label}>
                  <Card><CardContent><Typography color="text.secondary" variant="body2">{label}</Typography><Typography variant="h5" sx={{ mt: 1 }}>{value}</Typography></CardContent></Card>
                </Grid>
              ))}
            </Grid>
            <Card sx={{ background: 'linear-gradient(135deg, #e7f5f2 0%, #edf7fb 100%)' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>AI coaching summary</Typography>
                <Typography color="text.secondary">
                  {dashboard.latestAiSummary ?? 'Generate a report after a completed session to see actionable coaching guidance here.'}
                </Typography>
                {latestCompletedSessionId && (
                  <Button
                    sx={{ mt: 2 }}
                    variant="contained"
                    disabled={generating}
                    onClick={() => {
                      setGenerating(true);
                      void generateAiReport(latestCompletedSessionId)
                        .then((report) => {
                          setDashboard({ ...dashboard, latestAiSummary: report.renderedSummary ?? null });
                        })
                        .catch((loadError: unknown) => {
                          setError(loadError instanceof Error ? loadError.message : 'Unable to generate AI report');
                        })
                        .finally(() => setGenerating(false));
                    }}
                  >
                    {generating ? 'Generating...' : 'Generate latest report'}
                  </Button>
                )}
              </CardContent>
            </Card>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}><InsightCard title="Most improved swimmer" value={dashboard.mostImproved ? `${dashboard.mostImproved.athleteName} · ${formatTime(dashboard.mostImproved.improvementMs)} faster` : 'Not enough comparable data yet'} /></Grid>
              <Grid item xs={12} md={6}><InsightCard title="Largest pace drop-off" value={dashboard.largestPaceDropOff ? `${dashboard.largestPaceDropOff.athleteName} · ${formatTime(dashboard.largestPaceDropOff.dropOffMs)} slower` : 'Not enough completed reps yet'} /></Grid>
            </Grid>
          </>}
        </Stack>
      </Container>
    </AppShell>
  );
}

function InsightCard({ title, value }: { title: string; value: string }) {
  return <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #e7f5f2 0%, #edf7fb 100%)' }}><CardContent><Typography variant="h6" gutterBottom>{title}</Typography><Typography color="text.secondary">{value}</Typography></CardContent></Card>;
}
