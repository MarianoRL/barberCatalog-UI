import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  Grid,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Rating,
  Autocomplete,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Collapse,
  IconButton,
} from '@mui/material';
import { Search, LocationOn, Star, Favorite, FavoriteBorder, FilterList, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { BarberShop } from '../types';

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
  const [searchTerm, setSearchTerm] = React.useState(initialSearch);
  const [debouncedSearch, setDebouncedSearch] = React.useState(initialSearch);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState<SearchFilters>({
    name: initialSearch,
    city: '',
    state: '',
    minRating: 0,
    serviceCategory: '',
  });
  const [debouncedFilters, setDebouncedFilters] = React.useState<SearchFilters>(filters);

  // Debounce search term and filters
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setDebouncedFilters({
        ...filters,
        name: searchTerm,
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, filters]);

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

  const handleCardClick = (shopId: string) => {
    navigate(`/barbershops/${shopId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
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
    <Box>
      <Typography variant="h2" component="h1" gutterBottom>
        Barber Shops
      </Typography>
      
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search barber shops..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant={showFilters ? 'contained' : 'outlined'}
            startIcon={<FilterList />}
            endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
            onClick={() => setShowFilters(!showFilters)}
            sx={{ minWidth: 120 }}
          >
            Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Paper sx={{ p: 3, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Search Filters
            </Typography>
            
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
            
            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={clearFilters} variant="outlined">
                Clear Filters
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Box>

      {barberShops.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No barber shops found
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {debouncedSearch
              ? `Try searching with different keywords`
              : 'No barber shops are currently available'}
          </Typography>
        </Box>
      ) : (
        <>
          <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
            {barberShops.length} barber shop{barberShops.length !== 1 ? 's' : ''} found
          </Typography>
          
          <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
            {barberShops.map((shop) => (
              <Grid item xs={12} sm={6} md={4} key={shop.id} sx={{ display: 'flex' }}>
                <Card
                  sx={{
                    height: '100%',
                    width: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: '#161616',
                    background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
                    boxShadow: '0 16px 64px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
                    borderRadius: '24px',
                    border: '1px solid rgba(201, 169, 110, 0.1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #C9A96E, transparent)',
                      transform: 'scaleX(0)',
                      transformOrigin: 'center',
                      transition: 'transform 0.4s ease',
                      pointerEvents: 'none',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'radial-gradient(circle at 50% 0%, rgba(201, 169, 110, 0.05) 0%, transparent 70%)',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                      pointerEvents: 'none',
                    },
                    '&:hover': {
                      boxShadow: '0 24px 80px rgba(201, 169, 110, 0.2), 0 16px 48px rgba(0,0,0,0.4)',
                      transform: 'translateY(-8px) scale(1.02)',
                      border: '1px solid rgba(201, 169, 110, 0.3)',
                      '&::before': {
                        transform: 'scaleX(1)',
                      },
                      '&::after': {
                        opacity: 1,
                      },
                    },
                  }}
                  onClick={() => handleCardClick(shop.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={shop.coverPhoto || shop.avatar || '/api/placeholder/400/200'}
                    alt={shop.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography 
                      variant="h6" 
                      component="h3" 
                      gutterBottom 
                      noWrap
                      sx={{ 
                        color: '#FAFAFA', 
                        fontWeight: 600,
                        fontSize: '1.25rem'
                      }}
                    >
                      {shop.name}
                    </Typography>
                    
                    <Box display="flex" alignItems="center" gap={1} mb={1}>
                      <LocationOn fontSize="small" sx={{ color: '#C9A96E' }} />
                      <Typography variant="body2" sx={{ color: '#B8B8B8' }} noWrap>
                        {shop.address}, {shop.city}, {shop.state}
                      </Typography>
                    </Box>
                    
                    {shop.averageRating && (
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <Rating 
                          value={shop.averageRating} 
                          readOnly 
                          precision={0.1} 
                          size="small"
                          sx={{
                            '& .MuiRating-iconFilled': {
                              color: '#C9A96E',
                            },
                            '& .MuiRating-iconEmpty': {
                              color: 'rgba(201, 169, 110, 0.3)',
                            },
                          }}
                        />
                        <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                          {shop.averageRating.toFixed(1)} ({shop.totalRatings} reviews)
                        </Typography>
                      </Box>
                    )}
                    
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#B8B8B8',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        mb: 2,
                        flex: 1,
                        lineHeight: 1.5
                      }}
                    >
                      {shop.description || 'Professional barber services'}
                    </Typography>
                    
                    <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCardClick(shop.id);
                        }}
                        sx={{
                          background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
                          color: '#121212',
                          fontWeight: 600,
                          '&:hover': {
                            background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
                            transform: 'translateY(-1px)',
                          }
                        }}
                      >
                        View Details
                      </Button>
                      
                      {shop.favoriteCount && shop.favoriteCount > 0 && (
                        <Chip
                          icon={<Favorite sx={{ color: '#C9A96E' }} />}
                          label={shop.favoriteCount}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(201, 169, 110, 0.1)',
                            color: '#C9A96E',
                            border: '1px solid rgba(201, 169, 110, 0.3)',
                            backdropFilter: 'blur(10px)'
                          }}
                          color="primary"
                          variant="outlined"
                        />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
};

export default BarberShops;