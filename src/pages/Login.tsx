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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          filter: 'blur(100px)',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          filter: 'blur(120px)',
        }}
      />

      <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4} sx={{ minHeight: '100vh', alignItems: 'center' }}>
          {/* Left side - Landing content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ color: 'white', pr: { md: 4 } }}>
              {/* Header */}
              <Box display="flex" alignItems="center" mb={4}>
                <ContentCut sx={{ fontSize: 40, mr: 2 }} />
                <Typography variant="h4" fontWeight="bold">
                  BarberCatalog
                </Typography>
              </Box>

              {/* Hero section */}
              <Typography
                variant={isMobile ? 'h3' : 'h2'}
                fontWeight="bold"
                mb={3}
                sx={{
                  background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                Find Your Perfect Barber
              </Typography>

              <Typography variant="h6" mb={4} sx={{ opacity: 0.9, lineHeight: 1.6, color: '#ffffff' }}>
                Connect with professional barbers, book appointments instantly, and discover 
                the best barbershops in your area. Your perfect haircut is just one click away.
              </Typography>

              {/* Stats */}
              <Grid container spacing={3} mb={4}>
                {stats.map((stat, index) => (
                  <Grid item xs={6} sm={3} key={index}>
                    <Paper
                      sx={{
                        p: 2,
                        textAlign: 'center',
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        color: 'white',
                      }}
                    >
                      <Typography variant="h5" fontWeight="bold" sx={{ color: '#ffffff' }}>
                        {stat.number}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.8, color: '#ffffff' }}>
                        {stat.label}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>

              {/* Features */}
              <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#ffffff' }}>
                Why Choose BarberCatalog?
              </Typography>
              
              <Grid container spacing={3} mb={4}>
                {features.map((feature, index) => (
                  <Grid item xs={12} sm={6} key={index}>
                    <Box
                      sx={{
                        p: 3,
                        background: 'rgba(255, 255, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          background: 'rgba(255, 255, 255, 0.15)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" mb={2}>
                        {feature.icon}
                        <Typography variant="h6" fontWeight="bold" ml={2} sx={{ color: '#ffffff' }}>
                          {feature.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ opacity: 0.9, color: '#ffffff' }}>
                        {feature.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              {/* Testimonials */}
              <Typography variant="h5" fontWeight="bold" mb={3} sx={{ color: '#ffffff' }}>
                What Our Users Say
              </Typography>
              
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                {testimonials.map((testimonial, index) => (
                  <Paper
                    key={index}
                    sx={{
                      p: 3,
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      flex: 1,
                    }}
                  >
                    <Box display="flex" alignItems="center" mb={2}>
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#ffeb3b', fontSize: 16 }} />
                      ))}
                    </Box>
                    <Typography variant="body2" mb={2} sx={{ fontStyle: 'italic', color: '#ffffff' }}>
                      "{testimonial.text}"
                    </Typography>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: '#ffffff' }}>
                        {testimonial.name}
                      </Typography>
                      <Typography variant="caption" sx={{ opacity: 0.8, color: '#ffffff' }}>
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
                  maxWidth: 450,
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Box textAlign="center" mb={3}>
                    <Chip
                      icon={<Verified />}
                      label="Welcome Back"
                      color="primary"
                      sx={{ mb: 2, fontWeight: 'bold' }}
                    />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                      Sign In
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Access your account to book appointments
                    </Typography>
                  </Box>


                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
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
                      sx={{ mb: 2 }}
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
                      sx={{ mb: 3 }}
                    />

                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      size="large"
                      disabled={loading}
                      sx={{
                        mb: 3,
                        py: 1.5,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                        '&:hover': {
                          background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
                        },
                      }}
                    >
                      {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In to Continue'}
                    </Button>
                  </form>

                  <Box textAlign="center">
                    <Typography variant="body2" color="text.secondary">
                      New to BarberCatalog?{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate('/register')}
                        sx={{ fontWeight: 'bold', textDecoration: 'none' }}
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