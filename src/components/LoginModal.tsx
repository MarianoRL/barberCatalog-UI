import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Box,
  IconButton,
  Chip,
  Card,
} from '@mui/material';
import { Close, Verified } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
      }
      barber {
        id
        email
        firstName
        lastName
        role
      }
      expiresIn
    }
  }
`;

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await loginMutation({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      if (result.data?.login) {
        const { token, refreshToken, user, barber } = result.data.login;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        if (barber) {
          localStorage.setItem('barber', JSON.stringify(barber));
        }
        
        onClose();
        reset();
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={handleClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'transparent',
              boxShadow: 'none',
              overflow: 'visible',
              margin: 2,
              maxWidth: 'none',
              width: 'auto',
            }
          }}
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
            },
            '& .MuiDialog-container': {
              alignItems: 'center',
              justifyContent: 'center',
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <DialogContent sx={{ p: 0, position: 'relative', overflow: 'visible' }}>
              <Card
                sx={{
                  width: 600,
                  maxWidth: '90vw',
                  mx: 'auto',
                  background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.98) 0%, rgba(26, 26, 26, 0.98) 100%)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  borderRadius: '24px',
                  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 169, 110, 0.1)',
                  position: 'relative',
                  overflow: 'visible',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Close Button */}
                <IconButton
                  onClick={handleClose}
                  sx={{
                    position: 'absolute',
                    top: -20,
                    right: -20,
                    background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 100%)',
                    color: '#121212',
                    width: 40,
                    height: 40,
                    zIndex: 10,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 100%)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
                    },
                  }}
                >
                  <Close />
                </IconButton>

                <Box sx={{ 
                  p: 5,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                }}>
                  <Box textAlign="center" mb={4}>
                    <Chip
                      icon={<Verified sx={{ color: '#121212' }} />}
                      label="Welcome Back"
                      sx={{ 
                        mb: 3, 
                        fontWeight: '600',
                        background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 100%)',
                        color: '#121212',
                        fontSize: '0.9rem',
                        height: '36px',
                      }}
                    />
                    <Typography 
                      variant="h4" 
                      fontWeight="700" 
                      gutterBottom
                      sx={{
                        color: '#FAFAFA',
                        fontFamily: '"Inter", "SF Pro Display", sans-serif',
                        mb: 2,
                      }}
                    >
                      Sign In
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{
                        color: '#B8B8B8',
                        fontFamily: '"Inter", "SF Pro Text", sans-serif',
                        fontWeight: 400,
                      }}
                    >
                      Access your account for premium appointments
                    </Typography>
                  </Box>

                  {error && (
                    <Alert 
                      severity="error" 
                      sx={{ 
                        mb: 3,
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        border: '1px solid rgba(255, 107, 107, 0.3)',
                        borderRadius: '12px',
                        color: '#ff6b6b',
                        '& .MuiAlert-icon': {
                          color: '#ff6b6b',
                        },
                        '& .MuiAlert-message': {
                          fontFamily: '"Inter", "SF Pro Text", sans-serif',
                        },
                      }}
                    >
                      {error.message || 'Invalid email or password. Please try again.'}
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      label="Email Address"
                      type="email"
                      fullWidth
                      margin="normal"
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{ 
                        mb: 2.5,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(22, 22, 22, 0.9)',
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(201, 169, 110, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(201, 169, 110, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C9A96E',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8B8B8',
                          '&.Mui-focused': {
                            color: '#C9A96E',
                          },
                        },
                        '& input': {
                          color: '#FAFAFA',
                          fontSize: '1rem',
                          fontWeight: 400,
                        },
                      }}
                    />

                    <TextField
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters',
                        },
                      })}
                      label="Password"
                      type="password"
                      fullWidth
                      margin="normal"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      sx={{ 
                        mb: 3.5,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: 'rgba(22, 22, 22, 0.9)',
                          borderRadius: '12px',
                          '& fieldset': {
                            borderColor: 'rgba(201, 169, 110, 0.3)',
                          },
                          '&:hover fieldset': {
                            borderColor: 'rgba(201, 169, 110, 0.5)',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#C9A96E',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8B8B8',
                          '&.Mui-focused': {
                            color: '#C9A96E',
                          },
                        },
                        '& input': {
                          color: '#FAFAFA',
                          fontSize: '1rem',
                          fontWeight: 400,
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{
                        mb: 4,
                        py: 2,
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        letterSpacing: '0.5px',
                        borderRadius: '16px',
                        textTransform: 'none',
                        background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
                        color: '#121212',
                        boxShadow: '0 8px 32px rgba(201, 169, 110, 0.4)',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 48px rgba(201, 169, 110, 0.6)',
                        },
                        '&:disabled': {
                          background: 'rgba(201, 169, 110, 0.3)',
                          color: 'rgba(18, 18, 18, 0.7)',
                        },
                      }}
                    >
                      {loading ? (
                        <CircularProgress size={24} sx={{ color: '#121212' }} />
                      ) : (
                        'Sign In to Continue'
                      )}
                    </Button>
                  </form>

                  <Box textAlign="center">
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#B8B8B8',
                        fontFamily: '"Inter", "SF Pro Text", sans-serif',
                      }}
                    >
                      New to Luxe Cuts?{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => {
                          handleClose();
                          navigate('/register');
                        }}
                        sx={{ 
                          fontWeight: '600', 
                          textDecoration: 'none',
                          color: '#C9A96E',
                          fontFamily: '"Inter", "SF Pro Text", sans-serif',
                          '&:hover': {
                            color: '#E4C49A',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        Create Account
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </Card>
            </DialogContent>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default LoginModal;