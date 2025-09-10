import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Fab,
  Box,
  IconButton,
  Tooltip,
  Badge
} from '@mui/material';
import {
  KeyboardArrowUp,
  Phone,
  WhatsApp,
  Email,
  Notifications
} from '@mui/icons-material';
import { showSuccessNotification, showInfoNotification } from './EnhancedNotifications';

interface FloatingActionEffectsProps {
  showScrollTop?: boolean;
  showContactButtons?: boolean;
}

const FloatingActionEffects: React.FC<FloatingActionEffectsProps> = ({
  showScrollTop = true,
  showContactButtons = true
}) => {
  const { scrollY } = useScroll();
  const [showScrollButton, setShowScrollButton] = useState(false);
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


  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    showSuccessNotification('Scrolled to top! 🚀');
  };


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

    </>
  );
};

export default FloatingActionEffects;