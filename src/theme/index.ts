import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#121212', // Sophisticated charcoal
      light: '#2d2d2d',
      dark: '#000000',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#C9A96E', // Warm champagne gold
      light: '#E4C49A',
      dark: '#A8864C',
      contrastText: '#121212',
    },
    background: {
      default: '#0A0A0A', // Ultra-deep black
      paper: '#161616',
    },
    text: {
      primary: '#FAFAFA',
      secondary: '#B8B8B8',
    },
    divider: 'rgba(201, 169, 110, 0.2)',
    error: {
      main: '#ff6b6b',
      light: '#ff8e8e',
      dark: '#e55555',
    },
    warning: {
      main: '#ffa726',
      light: '#ffcc80',
      dark: '#f57c00',
    },
    info: {
      main: '#29b6f6',
      light: '#4fc3f7',
      dark: '#0288d1',
    },
    success: {
      main: '#66bb6a',
      light: '#81c784',
      dark: '#4caf50',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif',
    h1: {
      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
      fontWeight: 700,
      color: '#FAFAFA',
      letterSpacing: '-0.025em',
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      background: 'linear-gradient(135deg, #FAFAFA 0%, #C9A96E 50%, #E4C49A 100%)',
      backgroundClip: 'text',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      textShadow: 'none',
      lineHeight: 1.1,
    },
    h2: {
      fontSize: 'clamp(2rem, 4vw, 3rem)',
      fontWeight: 650,
      color: '#FAFAFA',
      letterSpacing: '-0.02em',
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: 'clamp(1.5rem, 3vw, 2.25rem)',
      fontWeight: 600,
      color: '#FAFAFA',
      letterSpacing: '-0.015em',
      fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
      lineHeight: 1.3,
    },
    h4: {
      fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)',
      fontWeight: 500,
      color: '#FAFAFA',
      letterSpacing: '-0.005em',
      fontFamily: '"Inter", "SF Pro Display", sans-serif',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: 500,
      color: '#C9A96E',
      letterSpacing: '-0.005em',
      fontFamily: '"Inter", "SF Pro Display", sans-serif',
    },
    h6: {
      fontSize: '1.25rem',
      fontWeight: 500,
      color: '#C9A96E',
      letterSpacing: '0em',
      fontFamily: '"Inter", "SF Pro Display", sans-serif',
    },
    body1: {
      fontSize: '1rem',
      color: '#FAFAFA',
      lineHeight: 1.6,
      fontFamily: '"Inter", "SF Pro Text", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    body2: {
      fontSize: '0.875rem',
      color: '#B8B8B8',
      lineHeight: 1.5,
      fontFamily: '"Inter", "SF Pro Text", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.01em',
    },
    button: {
      fontFamily: '"Inter", "SF Pro Text", sans-serif',
      fontWeight: 500,
      letterSpacing: '0.02em',
      textTransform: 'none',
    },
    caption: {
      fontSize: '0.75rem',
      color: '#B8B8B8',
      fontFamily: '"Inter", "SF Pro Text", sans-serif',
      fontWeight: 400,
      letterSpacing: '0.02em',
    },
    overline: {
      fontSize: '0.75rem',
      color: '#C9A96E',
      fontFamily: '"Inter", "SF Pro Text", sans-serif',
      fontWeight: 600,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '32px',
          fontWeight: 500,
          fontSize: '0.9rem',
          padding: '14px 28px',
          letterSpacing: '0.5px',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          fontFamily: '"Inter", "SF Pro Text", sans-serif',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.3), transparent)',
            transition: 'left 0.6s ease-in-out',
            pointerEvents: 'none',
          },
          '&:hover::before': {
            left: '100%',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
          color: '#121212',
          boxShadow: '0 8px 32px rgba(201, 169, 110, 0.4), 0 0 0 1px rgba(201, 169, 110, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
            boxShadow: '0 12px 48px rgba(201, 169, 110, 0.6), 0 0 0 1px rgba(201, 169, 110, 0.3)',
            transform: 'translateY(-3px) scale(1.02)',
          },
          '&:active': {
            transform: 'translateY(-1px) scale(0.98)',
          },
        },
        outlined: {
          borderWidth: '2px',
          borderColor: '#C9A96E',
          color: '#C9A96E',
          backgroundColor: 'rgba(201, 169, 110, 0.05)',
          backdropFilter: 'blur(10px)',
          '&:hover': {
            borderWidth: '2px',
            borderColor: '#E4C49A',
            backgroundColor: 'rgba(201, 169, 110, 0.15)',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(201, 169, 110, 0.3)',
          },
        },
        text: {
          color: '#C9A96E',
          '&:hover': {
            backgroundColor: 'rgba(201, 169, 110, 0.1)',
            color: '#E4C49A',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#161616',
          background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
          boxShadow: '0 16px 64px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: '24px',
          border: '1px solid rgba(201, 169, 110, 0.1)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
            transform: 'scaleX(0)',
            transformOrigin: 'center',
            transition: 'transform 0.4s ease',
            pointerEvents: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 50% 0%, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
            opacity: 0,
            transition: 'opacity 0.4s ease',
            pointerEvents: 'none',
          },
          '&:hover': {
            boxShadow: '0 24px 80px rgba(201, 169, 110, 0.2), 0 16px 48px rgba(0,0,0,0.4)',
            transform: 'translateY(-8px) scale(1.02)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            '&::before': {
              transform: 'scaleX(1)',
            },
            '&::after': {
              opacity: 1,
            },
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(24px)',
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          borderBottom: '1px solid rgba(201, 169, 110, 0.2)',
          color: '#FAFAFA',
          '& .MuiToolbar-root': {
            color: '#FAFAFA',
            minHeight: '72px',
            paddingLeft: '24px',
            paddingRight: '24px',
          },
          '& .MuiButton-root': {
            color: '#FAFAFA',
            borderRadius: '24px',
            position: 'relative',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 20px',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '50%',
              width: '0%',
              height: '2px',
              backgroundColor: '#C9A96E',
              transition: 'all 0.3s ease',
              transform: 'translateX(-50%)',
            },
            '&:hover': {
              backgroundColor: 'rgba(201, 169, 110, 0.1)',
              '&::after': {
                width: '80%',
              },
            },
          },
          '& .MuiIconButton-root': {
            color: '#C9A96E',
            borderRadius: '12px',
            '&:hover': {
              backgroundColor: 'rgba(201, 169, 110, 0.1)',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          fontWeight: 500,
          fontSize: '0.8rem',
          backgroundColor: 'rgba(201, 169, 110, 0.1)',
          color: '#C9A96E',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(201, 169, 110, 0.2)',
            color: '#E4C49A',
            transform: 'scale(1.05)',
            boxShadow: '0 4px 16px rgba(201, 169, 110, 0.3)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '16px',
            backgroundColor: 'rgba(22, 22, 22, 0.8)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s ease',
            '& fieldset': {
              borderColor: 'rgba(201, 169, 110, 0.2)',
              borderWidth: '1px',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(201, 169, 110, 0.4)',
              boxShadow: '0 0 16px rgba(201, 169, 110, 0.2)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C9A96E',
              borderWidth: '2px',
              boxShadow: '0 0 24px rgba(201, 169, 110, 0.4)',
            },
            '& input': {
              color: '#FAFAFA',
              fontSize: '1rem',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#B8B8B8',
            fontSize: '1rem',
            '&.Mui-focused': {
              color: '#C9A96E',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '20px',
          backgroundColor: '#161616',
          background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
          boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
          border: '1px solid rgba(201, 169, 110, 0.1)',
          backdropFilter: 'blur(10px)',
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
          color: '#121212',
          boxShadow: '0 12px 48px rgba(201, 169, 110, 0.4), 0 0 0 1px rgba(201, 169, 110, 0.2)',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
            boxShadow: '0 20px 64px rgba(201, 169, 110, 0.6), 0 0 0 1px rgba(201, 169, 110, 0.4)',
            transform: 'translateY(-6px) scale(1.1)',
          },
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(22, 22, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          borderRadius: '16px',
          boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
          '& .MuiMenuItem-root': {
            color: '#FAFAFA',
            borderRadius: '12px',
            margin: '4px 8px',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(201, 169, 110, 0.15)',
              color: '#C9A96E',
              transform: 'translateX(4px)',
            },
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          border: '1px solid',
          fontFamily: '"Inter", "SF Pro Text", sans-serif',
        },
        standardError: {
          backgroundColor: 'rgba(255, 107, 107, 0.1)',
          borderColor: 'rgba(255, 107, 107, 0.3)',
          color: '#ff6b6b',
        },
        standardWarning: {
          backgroundColor: 'rgba(255, 167, 38, 0.1)',
          borderColor: 'rgba(255, 167, 38, 0.3)',
          color: '#ffa726',
        },
        standardInfo: {
          backgroundColor: 'rgba(41, 182, 246, 0.1)',
          borderColor: 'rgba(41, 182, 246, 0.3)',
          color: '#29b6f6',
        },
        standardSuccess: {
          backgroundColor: 'rgba(102, 187, 106, 0.1)',
          borderColor: 'rgba(102, 187, 106, 0.3)',
          color: '#66bb6a',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: '#FAFAFA',
          backgroundColor: 'transparent',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#B8B8B8',
          '&.Mui-focused': {
            color: '#C9A96E',
          },
        },
      },
    },
    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(22, 22, 22, 0.8)',
            '& fieldset': {
              borderColor: 'rgba(201, 169, 110, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(201, 169, 110, 0.4)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#C9A96E',
            },
          },
        },
      },
    },
    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(10, 10, 10, 0.8)',
          backdropFilter: 'blur(4px)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: '#161616',
          backgroundImage: 'none',
          border: '1px solid rgba(201, 169, 110, 0.2)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(22, 22, 22, 0.95)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'rgba(22, 22, 22, 0.95)',
          color: '#FAFAFA',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          fontSize: '0.8rem',
          fontFamily: '"Inter", "SF Pro Text", sans-serif',
        },
      },
    },
  },
});