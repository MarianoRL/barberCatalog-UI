import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import {
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Alert,
  Button,
  Autocomplete,
  Slider,
  Paper,
  Container
} from '@mui/material';
import { Search, FilterList, ExpandMore, ExpandLess, TrendingUp, Visibility } from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BarberShop } from '../types';
import EnhancedBarberCard from '../components/EnhancedBarberCard';
import EnhancedLoading from '../components/EnhancedLoading';
import { showSuccessNotification, showInfoNotification } from '../components/EnhancedNotifications';
import AOS from 'aos';
import 'aos/dist/aos.css';

const GET_BARBERSHOPS = gql`
  query GetBarberShops {
    barberShops {
      id
      name
      description
      address
      city
      state
      phone
      email
      avatar
      coverPhoto
      isActive
      averageRating
      totalRatings
      favoriteCount
    }
  }
`;

const SEARCH_BARBERSHOPS = gql`
  query SearchBarberShops(
    $name: String
    $city: String
    $state: String
    $minRating: Float
    $serviceCategory: String
  ) {
    searchBarberShops(
      name: $name
      city: $city
      state: $state
      minRating: $minRating
      serviceCategory: $serviceCategory
    ) {
      id
      name
      description
      address
      city
      state
      phone
      email
      avatar
      coverPhoto
      isActive
      averageRating
      totalRatings
      favoriteCount
    }
  }
`;

const GET_FILTER_DATA = gql`
  query GetFilterData {
    getAvailableCities
    getAvailableStates
  }
`;

interface SearchFilters {
  name: string;
  city: string;
  state: string;
  minRating: number;
  serviceCategory: string;
}

const BarberShops: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = useState(initialSearch);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<SearchFilters>({
    name: initialSearch,
    city: '',
    state: '',
    minRating: 0,
    serviceCategory: '',
  });
  const [debouncedFilters, setDebouncedFilters] = useState<SearchFilters>(filters);
  
  // Intersection observer for animations
  const [filtersRef, filtersInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [resultsRef, resultsInView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }, []);

  // Debounce search term and filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDebouncedFilters({
        ...filters,
        name: searchTerm,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

  // Spring animations
  const headerSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { 
      opacity: filtersInView ? 1 : 0, 
      transform: filtersInView ? 'translateY(0px)' : 'translateY(-50px)' 
    },
    config: { tension: 280, friction: 60 }
  });

  const filtersSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { 
      opacity: filtersInView ? 1 : 0, 
      transform: filtersInView ? 'translateY(0px)' : 'translateY(30px)' 
    },
    config: { tension: 200, friction: 25 }
  });

  const resultsSpring = useSpring({
    from: { opacity: 0 },
    to: { opacity: resultsInView ? 1 : 0 },
    config: { tension: 200, friction: 25 }
  });

  // Load filter data
  const { data: filterData } = useQuery(GET_FILTER_DATA);
  const availableCities = filterData?.getAvailableCities || [];
  const availableStates = filterData?.getAvailableStates || [];

  const hasActiveFilters = Boolean(debouncedFilters.name || debouncedFilters.city || debouncedFilters.state || debouncedFilters.minRating > 0 || debouncedFilters.serviceCategory);
  
  const { loading, error, data } = useQuery(
    hasActiveFilters ? SEARCH_BARBERSHOPS : GET_BARBERSHOPS,
    {
      variables: hasActiveFilters ? {
        name: debouncedFilters.name || undefined,
        city: debouncedFilters.city || undefined,
        state: debouncedFilters.state || undefined,
        minRating: debouncedFilters.minRating > 0 ? debouncedFilters.minRating : undefined,
        serviceCategory: debouncedFilters.serviceCategory || undefined,
      } : {},
    }
  );

  const barberShops: BarberShop[] = data?.barberShops || data?.searchBarberShops || [];

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters(prev => ({ ...prev, name: value }));
  };

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      name: '',
      city: '',
      state: '',
      minRating: 0,
      serviceCategory: '',
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.minRating > 0) count++;
    if (filters.serviceCategory) count++;
    return count;
  };


  const handleFavoriteToggle = (shopId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(shopId)) {
        newFavorites.delete(shopId);
        showInfoNotification('Removed from favorites');
      } else {
        newFavorites.add(shopId);
        showSuccessNotification('Added to favorites! ❤️');
      }
      return newFavorites;
    });
  };


  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <EnhancedLoading type="cards" count={6} message="Finding amazing barbers near you..." />
      </Container>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading barber shops: {error.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', pt: 4 }}>
      <Container maxWidth="lg">
        <animated.div ref={filtersRef} style={headerSpring}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Box sx={{ textAlign: 'center', mb: 6 }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: '#FAFAFA',
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #FAFAFA 0%, #C9A96E 50%, #E4C49A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                All Barber Shops
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#B8B8B8',
                  fontWeight: 400,
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Browse our complete collection of premium barber shops
              </Typography>
            </Box>
          </motion.div>
        </animated.div>
      
        <animated.div style={filtersSpring}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: filtersInView ? 1 : 0, y: filtersInView ? 0 : 30 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ mb: 6 }}>
              <Box sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
                <motion.div
                  style={{ flex: 1 }}
                  whileFocus={{ scale: 1.02 }}
                >
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search barber shops..."
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Search sx={{ color: '#C9A96E' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '16px',
                        background: 'rgba(22, 22, 22, 0.8)',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 32px rgba(201, 169, 110, 0.2)',
                          transform: 'translateY(-2px)'
                        },
                        '&.Mui-focused': {
                          boxShadow: '0 12px 48px rgba(201, 169, 110, 0.3)',
                          transform: 'translateY(-2px)'
                        }
                      }
                    }}
                  />
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant={showFilters ? 'contained' : 'outlined'}
                    startIcon={<FilterList />}
                    endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
                    onClick={() => setShowFilters(!showFilters)}
                    sx={{ 
                      minWidth: 140,
                      borderRadius: '16px',
                      py: 1.5,
                      px: 3,
                      fontWeight: 600,
                      background: showFilters 
                        ? 'linear-gradient(135deg, #C9A96E, #E4C49A)' 
                        : 'transparent',
                      color: showFilters ? '#121212' : '#C9A96E',
                      borderColor: '#C9A96E',
                      '&:hover': {
                        background: showFilters 
                          ? 'linear-gradient(135deg, #A8864C, #C9A96E)' 
                          : 'rgba(201, 169, 110, 0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 32px rgba(201, 169, 110, 0.3)'
                      }
                    }}
                  >
                    Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    startIcon={<Visibility />}
                    onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                    sx={{
                      minWidth: 120,
                      borderRadius: '16px',
                      py: 1.5,
                      px: 3,
                      fontWeight: 600,
                      borderColor: 'rgba(201, 169, 110, 0.3)',
                      color: '#B8B8B8',
                      '&:hover': {
                        borderColor: '#C9A96E',
                        color: '#C9A96E',
                        background: 'rgba(201, 169, 110, 0.1)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {viewMode === 'grid' ? 'List' : 'Grid'}
                  </Button>
                </motion.div>
              </Box>

              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Paper 
                      sx={{ 
                        p: 4, 
                        mb: 3,
                        background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.95) 0%, rgba(26, 26, 26, 0.9) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(201, 169, 110, 0.2)',
                        borderRadius: '20px',
                        boxShadow: '0 16px 64px rgba(0,0,0,0.4)'
                      }}
                    >
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                      >
                        <Typography 
                          variant="h5" 
                          gutterBottom
                          sx={{ 
                            color: '#C9A96E', 
                            fontWeight: 600,
                            mb: 3,
                            textAlign: 'center'
                          }}
                        >
                          🔍 Advanced Search Filters
                        </Typography>
                      </motion.div>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={availableCities}
                  value={filters.city}
                  onChange={(_, newValue) => handleFilterChange('city', newValue || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="City" variant="outlined" />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Autocomplete
                  options={availableStates}
                  value={filters.state}
                  onChange={(_, newValue) => handleFilterChange('state', newValue || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="State" variant="outlined" />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Service Category"
                  value={filters.serviceCategory}
                  onChange={(e) => handleFilterChange('serviceCategory', e.target.value)}
                  variant="outlined"
                  placeholder="e.g., Haircut, Beard trim"
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Box>
                  <Typography gutterBottom>Minimum Rating</Typography>
                  <Slider
                    value={filters.minRating}
                    onChange={(_, newValue) => handleFilterChange('minRating', newValue as number)}
                    min={0}
                    max={5}
                    step={0.5}
                    marks={[
                      { value: 0, label: 'Any' },
                      { value: 2.5, label: '2.5+' },
                      { value: 5, label: '5.0' },
                    ]}
                    valueLabelDisplay="auto"
                  />
                </Box>
              </Grid>
            </Grid>
            
                      <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'center' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button 
                            onClick={clearFilters} 
                            variant="outlined"
                            sx={{
                              borderRadius: '16px',
                              py: 1.5,
                              px: 4,
                              fontWeight: 600,
                              borderColor: 'rgba(255, 107, 107, 0.5)',
                              color: '#ff6b6b',
                              '&:hover': {
                                borderColor: '#ff6b6b',
                                background: 'rgba(255, 107, 107, 0.1)',
                                transform: 'translateY(-2px)'
                              }
                            }}
                          >
                            🗑️ Clear Filters
                          </Button>
                        </motion.div>
                      </Box>
                    </Paper>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </motion.div>
        </animated.div>

        <animated.div ref={resultsRef} style={resultsSpring}>
          {barberShops.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Box 
                textAlign="center" 
                py={8}
                sx={{
                  background: 'linear-gradient(145deg, rgba(22, 22, 22, 0.8) 0%, rgba(26, 26, 26, 0.6) 100%)',
                  borderRadius: '24px',
                  border: '1px solid rgba(201, 169, 110, 0.1)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#C9A96E', 
                    fontWeight: 600, 
                    mb: 2,
                    fontSize: '3rem' 
                  }}
                >
                  🔍
                </Typography>
                <Typography variant="h5" sx={{ color: '#FAFAFA', fontWeight: 600, mb: 2 }}>
                  No barber shops found
                </Typography>
                <Typography variant="body1" sx={{ color: '#B8B8B8', mb: 3 }}>
                  {debouncedSearch
                    ? `Try searching with different keywords or adjust your filters`
                    : 'No barber shops are currently available'}
                </Typography>
                <Button
                  variant="outlined"
                  onClick={clearFilters}
                  sx={{
                    borderRadius: '16px',
                    py: 1.5,
                    px: 3,
                    borderColor: '#C9A96E',
                    color: '#C9A96E',
                    '&:hover': {
                      background: 'rgba(201, 169, 110, 0.1)',
                      borderColor: '#E4C49A'
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    mb: 4,
                    p: 3,
                    background: 'rgba(201, 169, 110, 0.05)',
                    borderRadius: '16px',
                    border: '1px solid rgba(201, 169, 110, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <TrendingUp sx={{ color: '#C9A96E', fontSize: 32 }} />
                    <Box>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#FAFAFA', 
                          fontWeight: 700,
                          background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                          backgroundClip: 'text',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}
                      >
                        {barberShops.length}
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#B8B8B8' }}>
                        Premium barber shop{barberShops.length !== 1 ? 's' : ''} found
                      </Typography>
                    </Box>
                  </Box>
                  
                  {hasActiveFilters && (
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ color: '#C9A96E', mb: 1 }}>
                        ✨ Filtered Results
                      </Typography>
                      <Button
                        size="small"
                        onClick={clearFilters}
                        sx={{ 
                          color: '#B8B8B8',
                          textDecoration: 'underline',
                          '&:hover': { color: '#C9A96E' }
                        }}
                      >
                        Clear filters
                      </Button>
                    </Box>
                  )}
                </Box>
              </motion.div>
              
              <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
                <AnimatePresence>
                  {barberShops.map((shop, index) => (
                    <Grid item xs={12} sm={6} md={4} key={shop.id} sx={{ display: 'flex' }}>
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -50, scale: 0.9 }}
                        transition={{ 
                          duration: 0.6, 
                          delay: index * 0.05,
                          layout: { duration: 0.3 }
                        }}
                        style={{ width: '100%' }}
                      >
                        <EnhancedBarberCard
                          shop={shop}
                          index={index}
                          onFavoriteToggle={handleFavoriteToggle}
                          isFavorite={favorites.has(shop.id)}
                        />
                      </motion.div>
                    </Grid>
                  ))}
                </AnimatePresence>
              </Grid>
            </>
          )}
        </animated.div>
      </Container>
    </Box>
  );
};

export default BarberShops;