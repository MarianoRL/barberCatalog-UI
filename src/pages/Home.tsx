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
      icon: <LocationOn sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Find Nearby Barbers',
      description: 'Discover the best barber shops in your area with our location-based search.',
    },
    {
      icon: <AccessTime sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Easy Booking',
      description: 'Book appointments seamlessly with your favorite barbers in just a few clicks.',
    },
    {
      icon: <Star sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Verified Reviews',
      description: 'Read authentic reviews from customers to make informed decisions.',
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
          background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
          color: 'white',
          py: 8,
          mb: 6,
          borderRadius: 2,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{ textAlign: 'center', mb: 2 }}
          >
            Find Your Perfect Barber
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ textAlign: 'center', mb: 4, opacity: 0.9 }}
          >
            Discover skilled barbers, read reviews, and book appointments online
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search for barber shops, services, or locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'white',
                  borderRadius: 2,
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              sx={{
                bgcolor: 'black',
                color: 'white',
                px: 4,
                '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
              }}
            >
              Search
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography variant="h2" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
          Why Choose BarberCatalog?
        </Typography>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%', textAlign: 'center', p: 3 }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
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
          bgcolor: 'grey.50',
          py: 6,
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h2" gutterBottom>
            Ready to Find Your Barber?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            Join thousands of satisfied customers who found their perfect barber
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/barbershops')}
              sx={{ px: 4 }}
            >
              Browse Barber Shops
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate('/barbers')}
              sx={{ px: 4 }}
            >
              Find Barbers
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;