import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  Paper,
  useScrollTrigger,
  Slide,
  Fade,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  AccountCircle, 
  ContentCut, 
  Dashboard,
  Store,
  Person,
  CalendarMonth,
  Analytics,
  Business,
  Settings,
  Logout,
  Notifications,
  NotificationsNone,
} from '@mui/icons-material';
import { isAuthenticated, logout, getCurrentUser } from '../utils/auth';
import { Role } from '../types';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [notificationsAnchor, setNotificationsAnchor] = React.useState<null | HTMLElement>(null);
  const isLoggedIn = isAuthenticated();
  const currentUser = getCurrentUser();
  const trigger = useScrollTrigger();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotifications = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationsAnchor(event.currentTarget);
  };

  const handleCloseNotifications = () => {
    setNotificationsAnchor(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleClose();
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Slide appear={false} direction="down" in={!trigger}>
        <AppBar 
          position="fixed" 
          elevation={0}
          sx={{
            background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '2px solid #d4af37',
            zIndex: 1200,
            '&::before': {
              content: '""',
              position: 'absolute',
              bottom: '-2px',
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
            },
          }}
        >
          <Toolbar sx={{ minHeight: '80px !important', px: 4 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mr: 6,
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&:hover': {
                  transform: 'scale(1.02)',
                  filter: 'drop-shadow(0 0 20px rgba(201, 169, 110, 0.6))',
                }
              }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
                  borderRadius: '16px',
                  p: 1.8,
                  mr: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(201, 169, 110, 0.3)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.2), rgba(228, 196, 154, 0.2))',
                    filter: 'blur(8px)',
                    zIndex: -1,
                  },
                }}
              >
                <ContentCut sx={{ color: '#121212', fontSize: 32, fontWeight: 'bold' }} />
              </Box>
              <Typography
                variant="h4"
                component="div"
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #FAFAFA 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: '"Inter", "SF Pro Display", sans-serif',
                  letterSpacing: '-0.02em',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                }}
              >
                LUXE CUTS
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 4, ml: 4 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/barbershops')}
                startIcon={<Store />}
                sx={{ 
                  borderRadius: '24px',
                  px: 3,
                  py: 1.2,
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  fontFamily: '"Inter", "SF Pro Text", sans-serif',
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  position: 'relative',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  backgroundColor: 'rgba(201, 169, 110, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(201, 169, 110, 0.15)',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(201, 169, 110, 0.3)',
                    color: '#E4C49A',
                  }
                }}
              >
                Barbershops
              </Button>
              
              <Button 
                color="inherit" 
                onClick={() => navigate('/barbers')}
                startIcon={<Person />}
                sx={{ 
                  borderRadius: '24px',
                  px: 3,
                  py: 1.2,
                  fontWeight: 500,
                  letterSpacing: '0.5px',
                  fontFamily: '"Inter", "SF Pro Text", sans-serif',
                  fontSize: '0.9rem',
                  textTransform: 'none',
                  transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  position: 'relative',
                  border: '1px solid rgba(201, 169, 110, 0.2)',
                  backgroundColor: 'rgba(201, 169, 110, 0.05)',
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    backgroundColor: 'rgba(201, 169, 110, 0.15)',
                    border: '1px solid rgba(201, 169, 110, 0.4)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 32px rgba(201, 169, 110, 0.3)',
                    color: '#E4C49A',
                  }
                }}
              >
                Master Barbers
              </Button>
              
              {isLoggedIn && (
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/bookings')}
                  startIcon={<CalendarMonth />}
                  sx={{ 
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Bookings
                </Button>
              )}
              
              {isLoggedIn && currentUser?.role === Role.OWNER && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/owner/dashboard')}
                    startIcon={<Business />}
                    sx={{ 
                      borderRadius: '25px',
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Owner
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/owner/appointments')}
                    startIcon={<CalendarMonth />}
                    sx={{ 
                      borderRadius: '25px',
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Appointments
                  </Button>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/owner/analytics')}
                    startIcon={<Analytics />}
                    sx={{ 
                      borderRadius: '25px',
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Analytics
                  </Button>
                </>
              )}
              
              {isLoggedIn && currentUser?.role === Role.BARBER && (
                <>
                  <Button 
                    color="inherit" 
                    onClick={() => navigate('/barber/analytics')}
                    startIcon={<Analytics />}
                    sx={{ 
                      borderRadius: '25px',
                      px: 3,
                      py: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Analytics
                  </Button>
                </>
              )}
            </Box>
          
            {isLoggedIn ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton
                  color="inherit"
                  onClick={handleNotifications}
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'scale(1.1)',
                    }
                  }}
                >
                  <NotificationsNone />
                </IconButton>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    avatar={
                      currentUser?.avatar ? (
                        <Avatar src={currentUser.avatar} sx={{ width: 24, height: 24 }} />
                      ) : (
                        <Avatar sx={{ width: 24, height: 24, bgcolor: 'rgba(255,255,255,0.2)' }}>
                          {currentUser?.firstName?.charAt(0) || 'U'}
                        </Avatar>
                      )
                    }
                    label={`${currentUser?.firstName || ''} ${currentUser?.lastName || ''}`.trim() || 'User'}
                    onClick={handleMenu}
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        transform: 'translateY(-2px)',
                      },
                      '& .MuiChip-label': {
                        color: 'white',
                        fontWeight: 500,
                      }
                    }}
                  />
                </Box>
                
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 200,
                      borderRadius: '16px',
                      background: 'rgba(22, 22, 22, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(201, 169, 110, 0.2)',
                      boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
                    }
                  }}
                >
                  <MenuItem 
                    onClick={() => { navigate('/dashboard'); handleClose(); }}
                    sx={{ gap: 2 }}
                  >
                    <Dashboard fontSize="small" />
                    Dashboard
                  </MenuItem>
                  <MenuItem 
                    onClick={() => { navigate('/profile'); handleClose(); }}
                    sx={{ gap: 2 }}
                  >
                    <Settings fontSize="small" />
                    Profile Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem 
                    onClick={handleLogout}
                    sx={{ gap: 2, color: 'error.main' }}
                  >
                    <Logout fontSize="small" />
                    Logout
                  </MenuItem>
                </Menu>
                
                <Menu
                  anchorEl={notificationsAnchor}
                  open={Boolean(notificationsAnchor)}
                  onClose={handleCloseNotifications}
                  PaperProps={{
                    sx: {
                      mt: 1,
                      minWidth: 300,
                      borderRadius: '16px',
                      background: 'rgba(22, 22, 22, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(201, 169, 110, 0.2)',
                      boxShadow: '0 16px 64px rgba(0,0,0,0.4)',
                    }
                  }}
                >
                  <MenuItem>
                    <Typography variant="body2" color="text.secondary">
                      No new notifications
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/login')}
                  sx={{
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  color="inherit" 
                  onClick={() => navigate('/register')}
                  variant="outlined"
                  sx={{ 
                    borderRadius: '25px',
                    px: 3,
                    py: 1,
                    borderColor: 'rgba(255, 255, 255, 0.5)', 
                    color: 'white',
                    transition: 'all 0.3s ease',
                    '&:hover': { 
                      borderColor: 'white', 
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>
      </Slide>
      
      <Box sx={{ minHeight: '80px' }} /> {/* Spacer for fixed AppBar */}
      
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #0A0A0A 0%, #161616 50%, #0A0A0A 100%)',
          minHeight: 'calc(100vh - 80px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 25% 75%, rgba(201, 169, 110, 0.08) 0%, transparent 60%), 
              radial-gradient(circle at 75% 25%, rgba(201, 169, 110, 0.05) 0%, transparent 60%), 
              radial-gradient(circle at 50% 50%, rgba(201, 169, 110, 0.03) 0%, transparent 50%),
              linear-gradient(135deg, transparent 0%, rgba(201, 169, 110, 0.01) 50%, transparent 100%)
            `,
            pointerEvents: 'none'
          },
          '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 100px,
                rgba(201, 169, 110, 0.005) 102px
              )
            `,
            pointerEvents: 'none',
            zIndex: 0,
          }
        }}
      >
        <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
          <Fade in={true} timeout={800}>
            <Box>{children}</Box>
          </Fade>
        </Container>
      </Box>
      
      <Box 
        component="footer" 
        sx={{ 
          mt: 'auto', 
          py: 4, 
          px: 2, 
          backgroundColor: '#0f0f0f',
          borderTop: '2px solid #d4af37',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: '-2px',
            left: 0,
            right: 0,
            height: '1px',
            background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
          },
        }}
      >
        <Container maxWidth="lg">
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#C9A96E',
              textAlign: 'center',
              fontFamily: '"Inter", "SF Pro Display", sans-serif',
              fontSize: '1rem',
              fontWeight: 400,
              letterSpacing: '0.5px',
            }}
          >
            © 2024 LUXE CUTS. Where Luxury Meets Precision.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;