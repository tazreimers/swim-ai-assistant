'use client';

import { Alert, Button, Card, CardContent, Container, Link, Stack, TextField, Typography } from '@mui/material';
import NextLink from 'next/link';
import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '../../src/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setMessage('Your password has been updated. You can now sign in.');
  }

  return (
    <Container maxWidth="sm">
      <Stack alignItems="center" spacing={3} sx={{ minHeight: '100vh', justifyContent: 'center', py: 4 }}>
        <Typography variant="h4" component="h1" color="primary.dark" fontWeight={700}>
          Choose a new password
        </Typography>
        <Card sx={{ width: '100%', maxWidth: 460 }}>
          <CardContent>
            <Stack spacing={3} component="form" onSubmit={handleSubmit}>
              {error && <Alert severity="error">{error}</Alert>}
              {message && <Alert severity="success">{message}</Alert>}
              <TextField
                label="New password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                inputProps={{ minLength: 8 }}
                helperText="Use at least 8 characters."
                required
              />
              <Button type="submit" variant="contained" size="large">
                Update password
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
