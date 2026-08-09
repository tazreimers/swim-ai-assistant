'use client';

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import {
  Alert,
  Button,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Link,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import NextLink from 'next/link';
import { useParams } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { AppShell } from '../../../../src/components/layout/app-shell';
import {
  addSquadMember,
  ClubDetail,
  createSquad,
  getClub,
  Squad,
} from '../../../../src/lib/clubs';

export default function ClubSquadsPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = params.clubId;
  const [club, setClub] = useState<ClubDetail | null>(null);
  const [squads, setSquads] = useState<Squad[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAthletes, setSelectedAthletes] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    const clubData = await getClub(clubId);
    setClub(clubData);
    setSquads(clubData.squads);
  }, [clubId]);

  useEffect(() => {
    if (!clubId) return;
    void loadData().catch((loadError: unknown) =>
      setError(loadError instanceof Error ? loadError.message : 'Unable to load squads'),
    );
  }, [clubId, loadData]);

  async function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    try {
      const squad = await createSquad(clubId, name, description);
      setSquads((current) => [...current, squad]);
      setName('');
      setDescription('');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create squad');
    }
  }

  async function handleAddMember(squadId: string) {
    const userId = selectedAthletes[squadId];
    if (!userId) return;
    setError(null);
    try {
      await addSquadMember(squadId, userId);
      await loadData();
      setSelectedAthletes((current) => ({ ...current, [squadId]: '' }));
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to add athlete');
    }
  }

  const athletes = club?.memberships.filter((member) => member.role === 'ATHLETE') ?? [];

  return (
    <AppShell displayName={club?.name ?? 'Squads'}>
      <Stack spacing={4}>
        <Link component={NextLink} href={`/clubs/${clubId}`} underline="hover" sx={{ alignSelf: 'flex-start' }}>
          <ArrowBackIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          Back to club
        </Link>
        <div>
          <Typography variant="h4" component="h1" gutterBottom>Squads</Typography>
          <Typography color="text.secondary">Create focused training groups and keep membership current.</Typography>
        </div>
        {error && <Alert severity="error">{error}</Alert>}
        <Card>
          <CardContent>
            <Stack spacing={2} component="form" onSubmit={handleCreate}>
              <Typography variant="h6">Create a squad</Typography>
              <TextField label="Squad name" value={name} onChange={(event) => setName(event.target.value)} required />
              <TextField label="Description" value={description} onChange={(event) => setDescription(event.target.value)} multiline minRows={2} />
              <Button type="submit" variant="contained" sx={{ alignSelf: 'flex-start' }}>Create squad</Button>
            </Stack>
          </CardContent>
        </Card>
        <Stack spacing={2}>
          {squads.map((squad) => (
            <Card key={squad.id}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <div>
                      <Typography variant="h6">{squad.name}</Typography>
                      {squad.description && <Typography color="text.secondary">{squad.description}</Typography>}
                    </div>
                    <Typography color="text.secondary">{squad.memberships.length} athletes</Typography>
                  </Stack>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <FormControl fullWidth>
                      <InputLabel id={`${squad.id}-athlete-label`}>Add athlete</InputLabel>
                      <Select
                        labelId={`${squad.id}-athlete-label`}
                        label="Add athlete"
                        value={selectedAthletes[squad.id] ?? ''}
                        onChange={(event) => setSelectedAthletes((current) => ({ ...current, [squad.id]: event.target.value }))}
                      >
                        {athletes.map((athlete) => (
                          <MenuItem key={athlete.user.id} value={athlete.user.id}>{athlete.user.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <Button variant="outlined" startIcon={<GroupAddIcon />} onClick={() => void handleAddMember(squad.id)}>
                      Add
                    </Button>
                  </Stack>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                    {squad.memberships.map((membership) => (
                      <Typography key={membership.id} variant="body2" color="text.secondary">
                        {membership.user.name}
                      </Typography>
                    ))}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
          {squads.length === 0 && <Typography color="text.secondary">No squads yet.</Typography>}
        </Stack>
      </Stack>
    </AppShell>
  );
}
