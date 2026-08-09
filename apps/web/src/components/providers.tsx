'use client';

import { CssBaseline, ThemeProvider } from '@mui/material';
import { theme } from '../theme';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
