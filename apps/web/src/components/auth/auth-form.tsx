'use client';

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
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
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { createSupabaseBrowserClient } from '../../lib/supabase/client';

type AuthMode = 'sign-in' | 'sign-up';

export function AuthForm({ mode }: { mode: AuthMode }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'coach' | 'athlete'>('coach');
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSignUp = mode === 'sign-up';

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsSubmitting(true);
    const supabase = createSupabaseBrowserClient();

    const result = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) {
      setError(result.error.message);
      setIsSubmitting(false);
      return;
    }

    if (isSignUp && !result.data.session) {
      setNotice('Check your email to confirm your account, then sign in.');
      setIsSubmitting(false);
      return;
    }

    router.replace('/dashboard');
    router.refresh();
  }

  return (
    <Card sx={{ width: '100%', maxWidth: 460 }}>
      <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              {isSignUp ? 'Create your account' : 'Welcome back'}
            </Typography>
            <Typography color="text.secondary">
              {isSignUp
                ? 'Start building better swim sessions with Swim AI.'
                : 'Sign in to continue to your coaching platform.'}
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}
          {notice && <Alert severity="success">{notice}</Alert>}

          {isSignUp && (
            <>
              <TextField
                label="Full name"
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                autoComplete="name"
                required
              />
              <FormControl fullWidth required>
                <InputLabel id="role-label">I am joining as</InputLabel>
                <Select
                  labelId="role-label"
                  label="I am joining as"
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as 'coach' | 'athlete')
                  }
                >
                  <MenuItem value="coach">Coach</MenuItem>
                  <MenuItem value="athlete">Athlete</MenuItem>
                </Select>
              </FormControl>
            </>
          )}

          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            autoComplete="email"
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            inputProps={{ minLength: 8 }}
            helperText={isSignUp ? 'Use at least 8 characters.' : undefined}
            required
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {isSubmitting ? <CircularProgress size={22} color="inherit" /> : isSignUp ? 'Create account' : 'Sign in'}
          </Button>

          {!isSignUp && (
            <Link component={NextLink} href="/forgot-password" underline="hover">
              Forgot your password?
            </Link>
          )}

          <Typography variant="body2" color="text.secondary" textAlign="center">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <Link
              component={NextLink}
              href={isSignUp ? '/sign-in' : '/sign-up'}
              underline="hover"
            >
              {isSignUp ? 'Sign in' : 'Create one'}
            </Link>
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
