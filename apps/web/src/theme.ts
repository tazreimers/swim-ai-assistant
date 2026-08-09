import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2f7f8f',
      dark: '#215d6a',
      light: '#72b7bf',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#5e9b86',
      dark: '#3f725f',
      light: '#a5cfbd',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f4faf9',
      paper: '#ffffff',
    },
    text: {
      primary: '#19343b',
      secondary: '#5d7378',
    },
    success: {
      main: '#4c9272',
    },
    warning: {
      main: '#c58b45',
    },
    error: {
      main: '#bd5d64',
    },
  },
  typography: {
    fontFamily: 'var(--font-inter), Arial, sans-serif',
    h1: {
      fontWeight: 700,
      letterSpacing: '-0.03em',
    },
    h2: {
      fontWeight: 700,
      letterSpacing: '-0.02em',
    },
    h3: {
      fontWeight: 650,
    },
    button: {
      fontWeight: 650,
      textTransform: 'none',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid rgba(47, 127, 143, 0.12)',
          boxShadow: '0 10px 28px rgba(34, 92, 102, 0.08)',
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});
