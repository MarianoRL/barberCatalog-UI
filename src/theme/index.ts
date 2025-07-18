import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea', // Modern gradient blue
      light: '#764ba2',
      dark: '#4c63d2',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f093fb', // Modern gradient pink
      light: '#f5576c',
      dark: '#d072e8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc', // Light gray background
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#1e293b',
      letterSpacing: '-0.025em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#1e293b',
      letterSpacing: '-0.025em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#1e293b',
      letterSpacing: '-0.025em',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      color: '#1e293b',
      letterSpacing: '-0.025em',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#1e293b',
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 500,
      color: '#1e293b',
    },
    body1: {
      fontSize: '1rem',
      color: '#334155',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      color: '#64748b',
      lineHeight: 1.5,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 12,
          fontWeight: 500,
          fontSize: '0.875rem',
          padding: '10px 20px',
          transition: 'all 0.2s ease-in-out',
        },
        contained: {
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(102, 126, 234, 0.35)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '2px',
          '&:hover': {
            borderWidth: '2px',
            transform: 'translateY(-1px)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          borderRadius: 16,
          border: '1px solid #e2e8f0',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: '0 8px 40px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
          backgroundColor: '#667eea',
          color: '#ffffff',
          '& .MuiToolbar-root': {
            color: '#ffffff',
          },
          '& .MuiButton-root': {
            color: '#ffffff',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
            },
          },
          '& .MuiIconButton-root': {
            color: '#ffffff',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            },
            '&.Mui-focused': {
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 24px rgba(102, 126, 234, 0.35)',
          '&:hover': {
            boxShadow: '0 12px 32px rgba(102, 126, 234, 0.45)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});