'use client';

import GroupsIcon from '@mui/icons-material/Groups';
import PeopleIcon from '@mui/icons-material/People';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AppShell } from '../../../src/components/layout/app-shell';
import { ClubDetail, getClub } from '../../../src/lib/clubs';

export default function ClubOverviewPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = params.clubId;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!clubId) return;
    void getClub(clubId)
      .then(setClub)
      .catch((loadError: unknown) =>
        setError(loadError instanceof Error ? loadError.message : 'Unable to load club'),
      );
  }, [clubId]);

  return (
    <AppShell displayName={club?.name ?? 'Club'}>
      <Stack spacing={4}>
        {error && <Alert severity="error">{error}</Alert>}
        {!club && !error && <Typography color="text.secondary">Loading club...</Typography>}
        {club && (
          <>
            <Box>
              <Typography variant="overline" color="primary.main" fontWeight={700}>
                Club workspace
              </Typography>
              <Typography variant="h4" component="h1" gutterBottom>{club.name}</Typography>
              <Typography color="text.secondary">
                Keep your community organized and ready for the next session.
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <PeopleIcon color="primary" />
                      <Box>
                        <Typography variant="h5">{club.memberships.length}</Typography>
                        <Typography color="text.secondary">Active members</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <GroupsIcon color="secondary" />
                      <Box>
                        <Typography variant="h5">{club.squads.length}</Typography>
                        <Typography color="text.secondary">Active squads</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Squads</Typography>
                    <Button component={NextLink} href={`/clubs/${clubId}/squads`} variant="outlined">
                      Manage squads
                    </Button>
                  </Stack>
                  {club.squads.length === 0 ? (
                    <Typography color="text.secondary">No squads have been created yet.</Typography>
                  ) : (
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                      {club.squads.map((squad) => (
                        <Chip key={squad.id} label={`${squad.name} · ${squad._count?.memberships ?? 0}`} />
                      ))}
                    </Stack>
                  )}
                </Stack>
              </CardContent>
            </Card>
            <Button component={NextLink} href={`/clubs/${clubId}/members`} variant="contained" sx={{ alignSelf: 'flex-start' }}>
              Manage members and invitations
            </Button>
          </>
        )}
      </Stack>
    </AppShell>
  );
}
