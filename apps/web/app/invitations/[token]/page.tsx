'use client';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Button,
  Card,
  CardContent,
  Container,
  Stack,
  Typography,
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { acceptInvitation } from '../../../src/lib/clubs';

export default function AcceptInvitationPage() {
  const params = useParams<{ token: string }>();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleAccept() {
    setError(null);
    setIsSubmitting(true);
    try {
      const result = await acceptInvitation(params.token);
      router.replace(`/clubs/${result.clubId}`);
    } catch (acceptError) {
      setError(acceptError instanceof Error ? acceptError.message : 'Unable to accept invitation');
      setIsSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Card>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack spacing={3} alignItems="flex-start">
            <CheckCircleIcon color="primary" sx={{ fontSize: 44 }} />
            <div>
              <Typography variant="h4" component="h1" gutterBottom>Join your club</Typography>
              <Typography color="text.secondary">
                Accept this invitation to join the Swim AI club workspace.
              </Typography>
            </div>
            {error && <Alert severity="error">{error}</Alert>}
            <Button variant="contained" size="large" onClick={() => void handleAccept()} disabled={isSubmitting}>
              {isSubmitting ? 'Joining...' : 'Accept invitation'}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
}
