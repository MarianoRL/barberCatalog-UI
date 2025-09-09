import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  Container,
  Grid,
  Stack,
  Chip,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ContentCut,
  Schedule,
  Star,
  Verified,
  GroupWork,
  Business,
} from '@mui/icons-material';
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

const Login: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [loginMutation, { loading, error }] = useMutation(LOGIN_MUTATION);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    console.log('Form submitted with data:', data);
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
        
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const features = [
    {
      icon: <Schedule sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Easy Booking',
      description: 'Book appointments with your favorite barbers in just a few clicks',
    },
    {
      icon: <Star sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Top Rated Barbers',
      description: 'Browse and choose from highly rated professional barbers',
    },
    {
      icon: <Business sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'Premium Shops',
      description: 'Discover the best barbershops in your area',
    },
    {
      icon: <GroupWork sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Community',
      description: 'Join a community of style enthusiasts and professionals',
    },
  ];

  const stats = [
    { number: '1000+', label: 'Happy Customers' },
    { number: '50+', label: 'Expert Barbers' },
    { number: '25+', label: 'Premium Shops' },
    { number: '4.9', label: 'Average Rating' },
  ];

  const testimonials = [
    {
      name: 'John Smith',
      role: 'Customer',
      text: 'Amazing experience! Found the perfect barber and booked instantly.',
      rating: 5,
    },
    {
      name: 'Mike Johnson',
      role: 'Barber',
      text: 'This platform helped me grow my client base significantly.',
      rating: 5,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0A0A0A 0%, #161616 50%, #0A0A0A 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 25% 25%, rgba(201, 169, 110, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(201, 169, 110, 0.08) 0%, transparent 50%),
            linear-gradient(135deg, transparent 0%, rgba(201, 169, 110, 0.03) 50%, transparent 100%)
          `,
          '@keyframes pulseGlow': {
            '0%': { opacity: 0.6 },
            '100%': { opacity: 1 },
          },
          animation: 'pulseGlow 6s ease-in-out infinite alternate',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          top: -200,
          right: -200,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 110, 0.1) 0%, transparent 70%)',
          filter: 'blur(100px)',
          '@keyframes floatRight': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '33%': { transform: 'translateY(-20px) rotate(5deg)' },
            '66%': { transform: 'translateY(10px) rotate(-3deg)' },
          },
          animation: 'floatRight 8s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -200,
          left: -200,
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
          filter: 'blur(120px)',
          '@keyframes floatLeft': {
            '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
            '33%': { transform: 'translateY(20px) rotate(-5deg)' },
            '66%': { transform: 'translateY(-10px) rotate(3deg)' },
          },
          animation: 'floatLeft 10s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 5 }}>
        <Grid container spacing={4} sx={{ minHeight: '100vh', alignItems: 'center' }}>
          {/* Left side - Landing content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ color: '#FAFAFA', pr: { md: 4 } }}>
              {/* Header */}
              <Box display="flex" alignItems="center" mb={6}>
                <Box
                  sx={{
                    background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
                    borderRadius: '16px',
                    p: 1.5,
                    mr: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <ContentCut sx={{ fontSize: 32, color: '#121212' }} />
                </Box>
                <Typography 
                  variant="h4" 
                  sx={{
                    fontFamily: '"Inter", "SF Pro Display", sans-serif',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #FAFAFA 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  LUXE CUTS
                </Typography>
              </Box>

              {/* Hero section */}
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                mb={4}
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(135deg, #FAFAFA 0%, #C9A96E 50%, #E4C49A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.1,
                  letterSpacing: '-0.025em',
                }}
              >
                Discover Your Perfect Barber
              </Typography>

              <Typography 
                variant="h6" 
                mb={6} 
                sx={{ 
                  opacity: 0.8, 
                  lineHeight: 1.7, 
                  color: '#B8B8B8',
                  fontFamily: '"Inter", "SF Pro Text", sans-serif',
                  fontWeight: 300,
                  fontSize: '1.2rem',
                }}
              >
                Connect with master artisans, book premium appointments seamlessly, and discover 
                the most sophisticated barbershops. Luxury grooming experiences await.
              </Typography>

              {/* Stats */}
              <Grid container spacing={3} mb={6}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Paper
                      sx={{
                        p: 3,
                        textAlign: 'center',
                        background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(201, 169, 110, 0.2)',
                        borderRadius: '16px',
                        color: '#FAFAFA',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          border: '1px solid rgba(201, 169, 110, 0.4)',
                          boxShadow: '0 12px 32px rgba(201, 169, 110, 0.2)',
                        },
                      }}
                    >
                      <Typography 
                        variant="h5" 
                        fontWeight="bold" 
                        sx={{ 
                          color: '#C9A96E',
                          fontFamily: '"Inter", "SF Pro Display", sans-serif',
                          mb: 1,
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#B8B8B8',
                          fontFamily: '"Inter", "SF Pro Text", sans-serif',
                          fontSize: '0.9rem',
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Features */}
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                mb={4} 
                sx={{ 
                  color: '#C9A96E',
                  fontFamily: '"Inter", "SF Pro Display", sans-serif',
                  fontSize: '1.8rem',
                }}
              >
                Why Choose Luxe Cuts?
              </Typography>
              
              <Grid container spacing={3} mb={6}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        p: 3,
                        background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.6) 0%, rgba(26, 26, 26, 0.6) 100%)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        border: '1px solid rgba(201, 169, 110, 0.2)',
                        transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.8) 0%, rgba(26, 26, 26, 0.8) 100%)',
                          border: '1px solid rgba(201, 169, 110, 0.4)',
                          boxShadow: '0 16px 48px rgba(201, 169, 110, 0.2)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        {React.cloneElement(feature.icon, { 
                          sx: { fontSize: 40, color: '#C9A96E', mr: 2 } 
                        })}
                        <Typography 
                          variant="h6" 
                          fontWeight="600" 
                          sx={{ 
                            color: '#FAFAFA',
                            fontFamily: '"Inter", "SF Pro Display", sans-serif',
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: '#B8B8B8',
                          fontFamily: '"Inter", "SF Pro Text", sans-serif',
                          lineHeight: 1.6,
                          fontSize: '0.95rem',
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Testimonials */}
              <Typography 
                variant="h5" 
                fontWeight="bold" 
                mb={4} 
                sx={{ 
                  color: '#C9A96E',
                  fontFamily: '"Inter", "SF Pro Display", sans-serif',
                  fontSize: '1.8rem',
                }}
              >
                Client Testimonials
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                {testimonials.map((testimonial, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 4,
                      background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.6) 0%, rgba(26, 26, 26, 0.6) 100%)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(201, 169, 110, 0.2)',
                      borderRadius: '20px',
                      color: '#FAFAFA',
                      flex: 1,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        border: '1px solid rgba(201, 169, 110, 0.4)',
                        boxShadow: '0 12px 32px rgba(201, 169, 110, 0.2)',
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={3}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#C9A96E', fontSize: 18 }} />
                      ))}
                    </Box>
                    <Typography 
                      variant="body2" 
                      mb={3} 
                      sx={{ 
                        fontStyle: 'italic', 
                        color: '#B8B8B8',
                        fontFamily: '"Inter", "SF Pro Text", sans-serif',
                        lineHeight: 1.6,
                        fontSize: '0.95rem',
                      }}
                    >
                      "{testimonial.text}"
                    </Typography>
                    <Box>
                      <Typography 
                        variant="body2" 
                        fontWeight="600" 
                        sx={{ 
                          color: '#FAFAFA',
                          fontFamily: '"Inter", "SF Pro Display", sans-serif',
                          mb: 0.5,
                        }}
                      >
                        {testimonial.name}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        sx={{ 
                          color: '#C9A96E',
                          fontFamily: '"Inter", "SF Pro Text", sans-serif',
                          fontSize: '0.8rem',
                        }}
                      >
                        {testimonial.role}
                      </Typography>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            </Box>
          </Grid>

          {/* Right side - Login form */}
          <Grid item xs={12} md={5}>
            <Box display="flex" justifyContent="center">
              <Card
                sx={{
                  maxWidth: 480,
                  width: '100%',
                  background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.95) 0%, rgba(26, 26, 26, 0.95) 100%)',
                  backdropFilter: 'blur(24px)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  borderRadius: '24px',
                  boxShadow: '0 24px 64px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(201, 169, 110, 0.1)',
                  position: 'relative',
                  zIndex: 10,
                }}
              >
                <CardContent sx={{ p: 5, position: 'relative', zIndex: 15 }}>
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

                  <form onSubmit={handleSubmit(onSubmit)} style={{ position: 'relative', zIndex: 20 }}>
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
                        mb: 2,
                        position: 'relative',
                        zIndex: 25,
                        '& .MuiOutlinedInput-root': {
                          position: 'relative',
                          zIndex: 25,
                          pointerEvents: 'auto',
                          backgroundColor: 'rgba(22, 22, 22, 0.9)',
                          backdropFilter: 'none',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8B8B8',
                          '&.Mui-focused': {
                            color: '#C9A96E',
                          },
                        },
                        '& input': {
                          color: '#FAFAFA !important',
                          fontSize: '1rem',
                          fontWeight: 400,
                          textShadow: 'none',
                          '&::placeholder': {
                            color: '#B8B8B8 !important',
                            opacity: '1 !important',
                          },
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
                        mb: 3,
                        position: 'relative',
                        zIndex: 25,
                        '& .MuiOutlinedInput-root': {
                          position: 'relative',
                          zIndex: 25,
                          pointerEvents: 'auto',
                          backgroundColor: 'rgba(22, 22, 22, 0.9)',
                          backdropFilter: 'none',
                        },
                        '& .MuiInputLabel-root': {
                          color: '#B8B8B8',
                          '&.Mui-focused': {
                            color: '#C9A96E',
                          },
                        },
                        '& input': {
                          color: '#FAFAFA !important',
                          fontSize: '1rem',
                          fontWeight: 400,
                          textShadow: 'none',
                          '&::placeholder': {
                            color: '#B8B8B8 !important',
                            opacity: '1 !important',
                          },
                        },
                      }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      onClick={() => console.log('Button clicked!')}
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
                        position: 'relative',
                        zIndex: 25,
                        cursor: 'pointer',
                        pointerEvents: 'auto',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 12px 48px rgba(201, 169, 110, 0.6)',
                        },
                        '&:disabled': {
                          background: 'rgba(201, 169, 110, 0.3)',
                          color: 'rgba(18, 18, 18, 0.7)',
                          cursor: 'not-allowed',
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
                        onClick={() => navigate('/register')}
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
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Login;