import { Box, Container, Link, Stack, Typography } from '@mui/material';
import NextLink from 'next/link';
import { AuthForm } from '../../../src/components/auth/auth-form';

export default function SignUpPage() {
  return (
    <Container maxWidth="sm">
      <Stack alignItems="center" spacing={3} sx={{ minHeight: '100vh', justifyContent: 'center', py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h3" color="primary.dark" fontWeight={700}>
            Swim AI
          </Typography>
          <Typography color="text.secondary">Build better sessions, together.</Typography>
        </Box>
        <AuthForm mode="sign-up" />
        <Link component={NextLink} href="/" underline="hover" color="text.secondary">
          Back to home
        </Link>
      </Stack>
    </Container>
  );
}
