'use client';

import { Alert, Button, Card, CardContent, Container, Link, Stack, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '../../src/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMessage('If an account exists for that email, a reset link is on its way.');
  }

  return (
    <Container maxWidth="sm">
      <Stack alignItems="center" spacing={3} sx={{ minHeight: '100vh', justifyContent: 'center', py: 4 }}>
        <Typography variant="h4" component="h1" color="primary.dark" fontWeight={700}>
          Reset your password
        </Typography>
        <Card sx={{ width: '100%', maxWidth: 460 }}>
          <CardContent>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              <Typography color="text.secondary">
                Enter your email and we&apos;ll send you a secure reset link.
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <Button type="submit" variant="contained" size="large">
                Send reset link
              </Button>
              <Link component={NextLink} href="/sign-in" underline="hover">
                Return to sign in
              </Link>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
