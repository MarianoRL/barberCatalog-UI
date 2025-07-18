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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            zIndex: 1200,
          }}
        >
          <Toolbar sx={{ minHeight: '70px !important' }}>
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                mr: 4,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                }
              }}
              onClick={() => navigate('/')}
            >
              <Box
                sx={{
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  borderRadius: '50%',
                  p: 1,
                  mr: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ContentCut sx={{ color: '#667eea', fontSize: 24 }} />
              </Box>
              <Typography
                variant="h5"
                component="div"
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                BarberCatalog
              </Typography>
            </Box>
            
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Button 
                color="inherit" 
                onClick={() => navigate('/barbershops')}
                startIcon={<Store />}
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
                Shops
              </Button>
              
              <Button 
                color="inherit" 
                onClick={() => navigate('/barbers')}
                startIcon={<Person />}
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
                Barbers
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
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
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
                      borderRadius: 2,
                      background: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
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
      
      <Box sx={{ minHeight: '70px' }} /> {/* Spacer for fixed AppBar */}
      
      <Box 
        sx={{ 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)',
          minHeight: 'calc(100vh - 70px)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 135, 135, 0.1) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.05) 0%, transparent 50%)',
            pointerEvents: 'none'
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
          py: 3, 
          px: 2, 
          backgroundColor: '#f5f5f5',
          borderTop: '1px solid #e0e0e0'
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 BarberCatalog. Find your perfect barber.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;