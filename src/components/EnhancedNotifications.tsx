import React from 'react';
import { Toaster } from 'react-hot-toast';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const EnhancedNotifications: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 80,
        right: 20,
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
          color: '#FAFAFA',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 16px 64px rgba(0,0,0,0.4), 0 8px 32px rgba(201, 169, 110, 0.2)',
          backdropFilter: 'blur(20px)',
          fontSize: '14px',
          fontWeight: 500,
          maxWidth: '400px',
          padding: '16px 20px',
        },
        success: {
          iconTheme: {
            primary: '#66bb6a',
            secondary: '#ffffff',
          },
          style: {
            background: 'linear-gradient(135deg, rgba(102, 187, 106, 0.1) 0%, rgba(129, 199, 132, 0.05) 100%)',
            border: '1px solid rgba(102, 187, 106, 0.3)',
            color: '#66bb6a',
          },
        },
        error: {
          iconTheme: {
            primary: '#ff6b6b',
            secondary: '#ffffff',
          },
          style: {
            background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.1) 0%, rgba(255, 142, 142, 0.05) 100%)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            color: '#ff6b6b',
          },
        },
        loading: {
          iconTheme: {
            primary: '#C9A96E',
            secondary: '#161616',
          },
          style: {
            background: 'linear-gradient(135deg, rgba(201, 169, 110, 0.1) 0%, rgba(228, 196, 154, 0.05) 100%)',
            border: '1px solid rgba(201, 169, 110, 0.3)',
            color: '#C9A96E',
          },
        },
      }}
    />
  );
};


// Utility functions for custom notifications
export const showSuccessNotification = (message: string, options?: any) => {
  
  return toast.success(message, {
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #66bb6a 0%, #81c784 100%)',
      color: 'white',
      borderRadius: '20px',
      fontWeight: 600,
      boxShadow: '0 12px 48px rgba(102, 187, 106, 0.4)',
      border: 'none',
      fontSize: '15px',
      padding: '16px 24px',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#66bb6a',
    },
    ...options,
  });
};

export const showErrorNotification = (message: string, options?: any) => {
  
  return toast.error(message, {
    duration: 5000,
    style: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
      color: 'white',
      borderRadius: '20px',
      fontWeight: 600,
      boxShadow: '0 12px 48px rgba(255, 107, 107, 0.4)',
      border: 'none',
      fontSize: '15px',
      padding: '16px 24px',
    },
    iconTheme: {
      primary: 'white',
      secondary: '#ff6b6b',
    },
    ...options,
  });
};

export const showLoadingNotification = (message: string, options?: any) => {
  
  return toast.loading(message, {
    style: {
      background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 100%)',
      color: '#121212',
      borderRadius: '20px',
      fontWeight: 600,
      boxShadow: '0 12px 48px rgba(201, 169, 110, 0.4)',
      border: 'none',
      fontSize: '15px',
      padding: '16px 24px',
    },
    iconTheme: {
      primary: '#121212',
      secondary: '#C9A96E',
    },
    ...options,
  });
};

export const showInfoNotification = (message: string, options?: any) => {
  
  return toast(message, {
    duration: 4000,
    style: {
      background: 'linear-gradient(135deg, #29b6f6 0%, #4fc3f7 100%)',
      color: 'white',
      borderRadius: '20px',
      fontWeight: 600,
      boxShadow: '0 12px 48px rgba(41, 182, 246, 0.4)',
      border: 'none',
      fontSize: '15px',
      padding: '16px 24px',
    },
    icon: 'ℹ️',
    ...options,
  });
};

export const showCustomNotification = (message: string, type: 'booking' | 'favorite' | 'review' | 'welcome', options?: any) => {
  
  const customStyles = {
    booking: {
      background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 100%)',
      color: '#121212',
      icon: '📅',
    },
    favorite: {
      background: 'linear-gradient(135deg, #ff6b6b 0%, #ff8e8e 100%)',
      color: 'white',
      icon: '❤️',
    },
    review: {
      background: 'linear-gradient(135deg, #ffa726 0%, #ffcc80 100%)',
      color: '#121212',
      icon: '⭐',
    },
    welcome: {
      background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
      color: '#121212',
      icon: '👋',
    },
  };

  const style = customStyles[type];

  return toast(message, {
    duration: 4000,
    style: {
      ...style,
      borderRadius: '20px',
      fontWeight: 600,
      boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
      border: 'none',
      fontSize: '15px',
      padding: '16px 24px',
      maxWidth: '420px',
    },
    icon: style.icon,
    ...options,
  });
};

// Custom toast with motion animations
export const showMotionToast = (message: string, options?: any) => {
  
  return toast.custom(
    (t) => (
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ 
          opacity: t.visible ? 1 : 0, 
          y: t.visible ? 0 : -50,
          scale: t.visible ? 1 : 0.9 
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
          color: '#FAFAFA',
          padding: '16px 24px',
          borderRadius: '20px',
          border: '1px solid rgba(201, 169, 110, 0.3)',
          boxShadow: '0 16px 64px rgba(0,0,0,0.4), 0 8px 32px rgba(201, 169, 110, 0.2)',
          backdropFilter: 'blur(20px)',
          fontSize: '15px',
          fontWeight: 600,
          maxWidth: '420px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
            }}
          >
            ✨
          </motion.div>
          <span>{message}</span>
        </div>
      </motion.div>
    ),
    {
      duration: 4000,
      ...options,
    }
  );
};

export default EnhancedNotifications;