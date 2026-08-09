'use client';

import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createClub } from '../../src/lib/clubs';

export default function OnboardingPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const club = await createClub(name);
      router.replace(`/clubs/${club.id}`);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to create club');
      setIsSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3} component="form" onSubmit={handleSubmit}>
            <AddBusinessIcon color="primary" sx={{ fontSize: 44 }} />
            <div>
              <Typography variant="h4" component="h1" gutterBottom>
                Set up your club
              </Typography>
              <Typography color="text.secondary">
                Create the shared home for your coaches, athletes, and squads.
              </Typography>
            </div>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Club name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Harbour Swim Club"
              required
              autoFocus
            />
            <Button type="submit" variant="contained" size="large" disabled={isSubmitting}>
              {isSubmitting ? 'Creating club...' : 'Create club'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
