'use client';

import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Container,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { AppShell } from '../../src/components/layout/app-shell';
import { ClubSummary, listClubs } from '../../src/lib/clubs';

export default function ClubsPage() {
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    void listClubs()
      .then(setClubs)
      .catch((loadError: unknown) =>
        setError(loadError instanceof Error ? loadError.message : 'Unable to load clubs'),
      );
  }, []);

  return (
    <AppShell displayName="Clubs">
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={700}>
                Organization
              </Typography>
              <Typography variant="h4" component="h1">Your clubs</Typography>
            </Box>
            <Button component={NextLink} href="/onboarding" variant="contained" startIcon={<AddIcon />}>
              Create club
            </Button>
          </Stack>
          {error && <Alert severity="error">{error}</Alert>}
          {clubs.length === 0 && !error ? (
            <Card>
              <CardContent>
                <Stack spacing={2} alignItems="flex-start">
                  <BusinessIcon color="primary" sx={{ fontSize: 40 }} />
                  <Typography variant="h6">Your club workspace starts here</Typography>
                  <Typography color="text.secondary">
                    Create a club or accept an invitation to begin managing squads.
                  </Typography>
                  <Button component={NextLink} href="/onboarding" variant="outlined">
                    Create your first club
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {clubs.map(({ club, role }) => (
                <Grid item xs={12} sm={6} md={4} key={club.id}>
                  <Card sx={{ height: '100%' }}>
                    <CardActionArea component={NextLink} href={`/clubs/${club.id}`} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>{club.name}</Typography>
                        <Typography color="text.secondary" variant="body2">
                          {role.toLowerCase()} · {club._count.memberships} members · {club._count.squads} squads
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Container>
    </AppShell>
  );
}
