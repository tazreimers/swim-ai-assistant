'use client';

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../src/components/layout/app-shell';
import { createSupabaseBrowserClient } from '../../src/lib/supabase/client';

export default function DashboardPage() {
  const [displayName, setDisplayName] = useState('Swim AI member');
  const [role, setRole] = useState<'coach' | 'athlete' | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (!active) return;

      if (userError) {
        setError(userError.message);
        return;
      }

      if (!user) return;

      setDisplayName(user.user_metadata.full_name || user.email || 'Swim AI member');
      const metadataRole = user.user_metadata.role;
      if (metadataRole === 'coach' || metadataRole === 'athlete') {
        setRole(metadataRole);
      }
    }

    void loadUser();
    return () => {
      active = false;
    };
  }, []);

  return (
    <AppShell displayName={displayName}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="overline" color="primary.main" fontWeight={700}>
            Your workspace
          </Typography>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, {displayName.split(' ')[0]}
          </Typography>
          <Typography color="text.secondary">
            Keep your squad moving with simple, focused coaching insights.
          </Typography>
        </Box>

        {error && <Alert severity="error">{error}</Alert>}

        <Card sx={{ background: 'linear-gradient(135deg, #e7f5f2 0%, #edf7fb 100%)' }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  {role === 'athlete' ? "Today's training" : 'Your next session'}
                </Typography>
                <Typography color="text.secondary">
                  Your session workspace will appear here as soon as your club is set up.
                </Typography>
              </Box>
              {role && <Chip label={role === 'coach' ? 'Coach' : 'Athlete'} color="primary" />}
            </Stack>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {[
            ['Clubs and squads', 'Organize your swimming community.', '/clubs'],
            ['Training sessions', 'Plan and publish the work that matters.', '/coach/sessions/new'],
            ['Progress insights', 'See the patterns behind every rep.', '/progress'],
          ].map(([title, description, href]) => (
            <Grid item xs={12} md={4} key={title}>
              <Card sx={{ height: '100%' }} component={href ? NextLink : 'div'} href={href}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {title}
                  </Typography>
                  <Typography color="text.secondary">{description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Stack>
    </AppShell>
  );
}
