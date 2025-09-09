import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Container,
  TextField,
  InputAdornment,
} from '@mui/material';
import { Search, Star, AccessTime, LocationOn } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isValid = payload.exp * 1000 > Date.now();
        setIsLoggedIn(isValid);
      } catch (error) {
        setIsLoggedIn(false);
      }
    }
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/barbershops?search=${encodeURIComponent(searchTerm)}`);
    }
  };

  const features = [
    {
      icon: <LocationOn sx={{ fontSize: 64, color: '#C9A96E' }} />,
      title: 'Luxe Locations',
      description: 'Discover premium barbershops in the most sophisticated neighborhoods, curated for their exceptional ambiance and artistry.',
    },
    {
      icon: <AccessTime sx={{ fontSize: 64, color: '#C9A96E' }} />,
      title: 'Seamless Booking',
      description: 'Experience effortless scheduling with our intuitive booking system. Premium appointments that fit your lifestyle.',
    },
    {
      icon: <Star sx={{ fontSize: 64, color: '#C9A96E' }} />,
      title: 'Master Artisans',
      description: 'Connect with certified master barbers who elevate grooming to an art form with decades of refined expertise.',
    },
  ];

  // If user is logged in, show dashboard
  if (isLoggedIn) {
    return <Dashboard />;
  }

  // If user is not logged in, show regular home page
  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `
            linear-gradient(135deg, rgba(10,10,10,0.95) 0%, rgba(22,22,22,0.9) 50%, rgba(10,10,10,0.95) 100%)
          `,
          color: 'white',
          py: 16,
          mb: 8,
          position: 'relative',
          overflow: 'hidden',
          minHeight: '80vh',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 30% 20%, rgba(201, 169, 110, 0.15) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(201, 169, 110, 0.1) 0%, transparent 50%),
              linear-gradient(135deg, transparent 0%, rgba(201, 169, 110, 0.05) 50%, transparent 100%)
            `,
            animation: 'pulseGlow 4s ease-in-out infinite alternate',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.08), transparent)',
            animation: 'shimmer 6s infinite',
          },
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' },
          },
          '@keyframes pulseGlow': {
            '0%': { opacity: 0.6 },
            '100%': { opacity: 1 },
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography
              variant="h1"
              component="h1"
              gutterBottom
              sx={{ 
                textAlign: 'center', 
                mb: 4,
                fontFamily: '"Inter", "SF Pro Display", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '3rem', md: '5rem', lg: '6.5rem' },
                letterSpacing: '-0.02em',
                background: 'linear-gradient(135deg, #FAFAFA 0%, #C9A96E 40%, #E4C49A 60%, #FAFAFA 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                lineHeight: 1.1,
              }}
            >
              LUXE CUTS
            </Typography>
            <Typography
              variant="h3"
              component="p"
              sx={{ 
                textAlign: 'center', 
                mb: 8, 
                fontFamily: '"Inter", "SF Pro Text", sans-serif',
                fontWeight: 300,
                fontSize: { xs: '1.1rem', md: '1.4rem' },
                color: '#C9A96E',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              Where Sophistication Meets Artistry
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, maxWidth: 700, mx: 'auto', position: 'relative', zIndex: 1 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Find your perfect barber..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(22, 22, 22, 0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(201, 169, 110, 0.3)',
                  borderRadius: '32px',
                  fontSize: '1.1rem',
                  py: 1,
                  transition: 'all 0.4s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(22, 22, 22, 0.9)',
                    border: '1px solid rgba(201, 169, 110, 0.5)',
                    boxShadow: '0 8px 32px rgba(201, 169, 110, 0.2)',
                  },
                  '&.Mui-focused': {
                    backgroundColor: 'rgba(22, 22, 22, 0.95)',
                    border: '2px solid #C9A96E',
                    boxShadow: '0 12px 48px rgba(201, 169, 110, 0.3)',
                  },
                },
                '& input': {
                  color: '#FAFAFA',
                  fontFamily: '"Inter", "SF Pro Text", sans-serif',
                  fontWeight: 400,
                  '&::placeholder': {
                    color: 'rgba(184, 184, 184, 0.7)',
                    fontStyle: 'normal',
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: '#C9A96E', fontSize: 24, ml: 1 }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              sx={{
                background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
                color: '#121212',
                px: 6,
                py: 2,
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'none',
                borderRadius: '32px',
                minWidth: '140px',
                boxShadow: '0 8px 32px rgba(201, 169, 110, 0.4)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
                  transform: 'translateY(-3px) scale(1.02)',
                  boxShadow: '0 16px 48px rgba(201, 169, 110, 0.6)',
                },
                '&:active': {
                  transform: 'translateY(-1px) scale(0.98)',
                },
              }}
            >
              Discover
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="xl" sx={{ mb: 10 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom 
            sx={{ 
              textAlign: 'center', 
              mb: 3,
              fontFamily: '"Playfair Display", serif',
              fontWeight: 600,
              fontSize: { xs: '2rem', md: '3rem' },
              color: '#ffffff',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '100px',
                height: '3px',
                background: 'linear-gradient(90deg, #d4af37, #f4e4a1, #d4af37)',
              },
            }}
          >
            THE ELITE EXPERIENCE
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#b8b8b8',
              fontFamily: '"Lato", sans-serif',
              fontSize: '1.2rem',
              fontWeight: 300,
              letterSpacing: '1px',
              textTransform: 'uppercase',
            }}
          >
            Unparalleled Service & Craftsmanship
          </Typography>
        </Box>
        
        <Grid container spacing={6}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card 
                sx={{ 
                  height: '100%', 
                  textAlign: 'center', 
                  p: 4,
                  background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: 'linear-gradient(90deg, #d4af37, #f4e4a1, #d4af37)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                  },
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 60px rgba(212, 175, 55, 0.2)',
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                  },
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Box 
                    sx={{ 
                      mb: 3,
                      position: 'relative',
                      display: 'inline-block',
                      p: 3,
                      borderRadius: '50%',
                      background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.1), rgba(244, 228, 161, 0.1))',
                      border: '2px solid #d4af37',
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography 
                    variant="h4" 
                    component="h3" 
                    gutterBottom
                    sx={{
                      fontFamily: '"Inter", "SF Pro Display", sans-serif',
                      fontWeight: 600,
                      color: '#d4af37',
                      mb: 2,
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{
                      color: '#b8b8b8',
                      fontFamily: '"Inter", "SF Pro Text", sans-serif',
                      lineHeight: 1.7,
                      fontSize: '1.1rem',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 50%, #1a1a1a 100%)',
          py: 10,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              repeating-linear-gradient(
                45deg,
                transparent,
                transparent 10px,
                rgba(212, 175, 55, 0.03) 10px,
                rgba(212, 175, 55, 0.03) 20px
              )
            `,
            pointerEvents: 'none',
          },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              gutterBottom
              sx={{
                fontFamily: '"Inter", "SF Pro Display", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                color: '#ffffff',
                mb: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              }}
            >
              BEGIN YOUR JOURNEY
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#d4af37',
                fontFamily: '"Inter", "SF Pro Text", sans-serif',
                fontWeight: 300,
                fontSize: '1.3rem',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                mb: 6,
              }}
            >
              Where Style Meets Perfection
            </Typography>
            <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => navigate('/barbershops')}
                sx={{ 
                  px: 8,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  background: 'linear-gradient(45deg, #d4af37 30%, #f4e4a1 90%)',
                  color: '#1a1a1a',
                  border: '2px solid #d4af37',
                  borderRadius: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                    transition: 'left 0.5s',
                  },
                  '&:hover': {
                    background: 'linear-gradient(45deg, #b8941f 30%, #d4af37 90%)',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(212, 175, 55, 0.4)',
                    '&::before': {
                      left: '100%',
                    },
                  },
                }}
              >
                Elite Shops
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => navigate('/barbers')}
                sx={{ 
                  px: 8,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  borderWidth: '2px',
                  borderColor: '#d4af37',
                  color: '#d4af37',
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(45deg, #d4af37, #f4e4a1)',
                    transform: 'scaleX(0)',
                    transformOrigin: 'left',
                    transition: 'transform 0.3s ease',
                    zIndex: -1,
                  },
                  '&:hover': {
                    borderColor: '#f4e4a1',
                    color: '#1a1a1a',
                    transform: 'translateY(-3px)',
                    boxShadow: '0 12px 35px rgba(212, 175, 55, 0.3)',
                    '&::before': {
                      transform: 'scaleX(1)',
                    },
                  },
                }}
              >
                Master Barbers
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;