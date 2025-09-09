import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import {
  Fab,
  Zoom,
  Backdrop,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Box,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  KeyboardArrowUp,
  Favorite,
  Share,
  BookOnline,
  Phone,
  Chat,
  WhatsApp,
  Email,
  Close,
  Add,
  Star,
  LocationOn,
  Schedule,
  Notifications,
  Search
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { showSuccessNotification, showInfoNotification } from './EnhancedNotifications';

interface FloatingActionEffectsProps {
  showBookingFab?: boolean;
  showScrollTop?: boolean;
  showSpeedDial?: boolean;
  showContactButtons?: boolean;
  customActions?: Array<{
    icon: React.ReactNode;
    name: string;
    onClick: () => void;
    color?: string;
  }>;
}

const FloatingActionEffects: React.FC<FloatingActionEffectsProps> = ({
  showBookingFab = true,
  showScrollTop = true,
  showSpeedDial = true,
  showContactButtons = true,
  customActions = []
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { scrollY } = useScroll();
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);

  // Scroll-based animations
  const scrollButtonOpacity = useTransform(scrollY, [0, 300], [0, 1]);
  const scrollButtonScale = useTransform(scrollY, [0, 300, 600], [0.5, 1, 1.2]);

  // Check scroll position
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollButton(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Spring animations for floating elements
  const floatingSpring = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 3000 }
  });

  const pulseSpring = useSpring({
    from: { scale: 1 },
    to: async (next) => {
      while (true) {
        await next({ scale: 1.1 });
        await next({ scale: 1 });
      }
    },
    config: { duration: 2000 }
  });

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    showSuccessNotification('Scrolled to top! 🚀');
  };

  // Speed dial actions
  const speedDialActions = [
    {
      icon: <BookOnline />,
      name: 'Quick Book',
      onClick: () => {
        navigate('/barbershops');
        showInfoNotification('Finding barbers near you...');
        setSpeedDialOpen(false);
      },
      color: '#C9A96E'
    },
    {
      icon: <Search />,
      name: 'Search',
      onClick: () => {
        navigate('/barbershops');
        setSpeedDialOpen(false);
      },
      color: '#66bb6a'
    },
    {
      icon: <Favorite />,
      name: 'Favorites',
      onClick: () => {
        navigate('/profile');
        setSpeedDialOpen(false);
      },
      color: '#ff6b6b'
    },
    {
      icon: <Schedule />,
      name: 'My Bookings',
      onClick: () => {
        navigate('/bookings');
        setSpeedDialOpen(false);
      },
      color: '#29b6f6'
    },
    ...customActions
  ];

  // Contact buttons data
  const contactButtons = [
    {
      icon: <Phone />,
      label: 'Call Us',
      onClick: () => {
        window.open('tel:+1234567890');
        showSuccessNotification('Opening phone dialer...');
      },
      color: '#66bb6a'
    },
    {
      icon: <WhatsApp />,
      label: 'WhatsApp',
      onClick: () => {
        window.open('https://wa.me/1234567890');
        showSuccessNotification('Opening WhatsApp...');
      },
      color: '#25d366'
    },
    {
      icon: <Email />,
      label: 'Email',
      onClick: () => {
        window.open('mailto:contact@barbercatalog.com');
        showSuccessNotification('Opening email client...');
      },
      color: '#ff6b6b'
    }
  ];

  return (
    <>
      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && showScrollButton && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 180 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 20,
              right: 20,
              zIndex: 1000
            }}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.9 }}
            >
              <Fab
                color="primary"
                onClick={scrollToTop}
                sx={{
                  background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                  color: '#121212',
                  boxShadow: '0 12px 48px rgba(201, 169, 110, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A8864C, #C9A96E)',
                    boxShadow: '0 20px 64px rgba(201, 169, 110, 0.6)',
                  }
                }}
              >
                <KeyboardArrowUp />
              </Fab>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Booking FAB */}
      <AnimatePresence>
        {showBookingFab && location.pathname !== '/bookings' && (
          <motion.div
            initial={{ opacity: 0, scale: 0, x: 100 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0, x: 100 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              bottom: 90,
              right: 20,
              zIndex: 999
            }}
          >
            <animated.div style={floatingSpring}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tooltip title="Quick Book Appointment" placement="left">
                  <Fab
                    variant="extended"
                    onClick={() => {
                      navigate('/barbershops');
                      showSuccessNotification('Let\'s find your perfect barber! ✂️');
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #66bb6a, #81c784)',
                      color: 'white',
                      boxShadow: '0 12px 48px rgba(102, 187, 106, 0.4)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      px: 3,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #4caf50, #66bb6a)',
                        boxShadow: '0 20px 64px rgba(102, 187, 106, 0.6)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <BookOnline sx={{ mr: 1 }} />
                    Quick Book
                  </Fab>
                </Tooltip>
              </motion.div>
            </animated.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Speed Dial */}
      <AnimatePresence>
        {showSpeedDial && (
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: 160,
              right: 20,
              zIndex: 998
            }}
          >
            <SpeedDial
              ariaLabel="Quick Actions"
              icon={<SpeedDialIcon />}
              onClose={() => setSpeedDialOpen(false)}
              onOpen={() => setSpeedDialOpen(true)}
              open={speedDialOpen}
              direction="up"
              sx={{
                '& .MuiSpeedDial-fab': {
                  background: 'linear-gradient(135deg, #29b6f6, #4fc3f7)',
                  color: 'white',
                  boxShadow: '0 12px 48px rgba(41, 182, 246, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #0288d1, #29b6f6)',
                    boxShadow: '0 20px 64px rgba(41, 182, 246, 0.6)',
                  }
                }
              }}
            >
              {speedDialActions.map((action, index) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  onClick={action.onClick}
                  sx={{
                    '& .MuiSpeedDialAction-fab': {
                      backgroundColor: action.color,
                      color: 'white',
                      boxShadow: `0 8px 32px ${action.color}40`,
                      '&:hover': {
                        backgroundColor: action.color,
                        transform: 'scale(1.1)',
                        boxShadow: `0 12px 48px ${action.color}60`,
                      }
                    }
                  }}
                  FabProps={{
                    component: motion.div
                  } as any}
                />
              ))}
            </SpeedDial>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Contact Buttons */}
      <AnimatePresence>
        {showContactButtons && (
          <Box
            sx={{
              position: 'fixed',
              left: 20,
              bottom: 20,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              zIndex: 997
            }}
          >
            {contactButtons.map((button, index) => (
              <motion.div
                key={button.label}
                initial={{ opacity: 0, x: -100, rotate: -90 }}
                animate={{ opacity: 1, x: 0, rotate: 0 }}
                exit={{ opacity: 0, x: -100, rotate: -90 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, x: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Tooltip title={button.label} placement="right">
                    <IconButton
                      onClick={button.onClick}
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: button.color,
                        color: 'white',
                        boxShadow: `0 8px 32px ${button.color}40`,
                        '&:hover': {
                          backgroundColor: button.color,
                          boxShadow: `0 12px 48px ${button.color}60`,
                        }
                      }}
                    >
                      {button.icon}
                    </IconButton>
                  </Tooltip>
                </motion.div>
              </motion.div>
            ))}
          </Box>
        )}
      </AnimatePresence>

      {/* Notification Badge */}
      <AnimatePresence>
        {notifications > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0, rotate: 180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: -180 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'fixed',
              top: 90,
              right: 20,
              zIndex: 996
            }}
          >
            <animated.div style={pulseSpring}>
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                whileTap={{ scale: 0.9 }}
              >
                <Tooltip title="You have new notifications" placement="left">
                  <IconButton
                    onClick={() => {
                      setNotifications(0);
                      showInfoNotification('Notifications cleared! 🔔');
                    }}
                    sx={{
                      backgroundColor: '#ff6b6b',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(255, 107, 107, 0.4)',
                      '&:hover': {
                        backgroundColor: '#e55555',
                        boxShadow: '0 12px 48px rgba(255, 107, 107, 0.6)',
                      }
                    }}
                  >
                    <Badge badgeContent={notifications} color="warning">
                      <Notifications />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </motion.div>
            </animated.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Decorative Elements */}
      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          left: '5%',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          animate={{
            y: [0, -20, 0],
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.1), rgba(228, 196, 154, 0.05))',
              borderRadius: '50%',
              filter: 'blur(20px)',
              opacity: 0.6
            }}
          />
        </motion.div>
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: '15%',
          right: '8%',
          zIndex: -1,
          pointerEvents: 'none'
        }}
      >
        <motion.div
          animate={{
            y: [0, 15, 0],
            x: [0, -10, 0],
            rotate: [0, -3, 0, 3, 0]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              background: 'linear-gradient(135deg, rgba(102, 187, 106, 0.1), rgba(129, 199, 132, 0.05))',
              borderRadius: '50%',
              filter: 'blur(15px)',
              opacity: 0.4
            }}
          />
        </motion.div>
      </Box>

      {/* Backdrop for Speed Dial */}
      <Backdrop
        open={speedDialOpen}
        onClick={() => setSpeedDialOpen(false)}
        sx={{
          zIndex: 997,
          background: 'rgba(10, 10, 10, 0.6)',
          backdropFilter: 'blur(4px)'
        }}
      />
    </>
  );
};

export default FloatingActionEffects;