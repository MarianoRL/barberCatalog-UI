import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Grid,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  InputAdornment,
  Stack,
  Rating,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Autocomplete,
  Slider,
  Collapse
} from '@mui/material';
import {
  Search,
  LocationOn,
  Phone,
  Email,
  Star,
  Person,
  Work,
  Schedule,
  Store,
  Clear,
  FilterList,
  Visibility,
  BookOnline,
  Info,
  AccessTime,
  Assignment,
  ExpandMore,
  ExpandLess
} from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Barber, Role, DayOfWeek } from '../types';

// GraphQL Queries
const GET_BARBERS = gql`
  query GetBarbers {
    barbers {
      id
      firstName
      lastName
      email
      phone
      avatar
      bio
      experienceYears
      specialties
      role
      isActive
      createdAt
      updatedAt
      averageRating
      totalRatings
      barberShops {
        id
        name
        address
        city
        state
        country
        phone
        email
        website
        avatar
        coverPhoto
      }
    }
  }
`;

const SEARCH_BARBERS = gql`
  query SearchBarbers($name: String, $city: String, $state: String, $specialty: String, $minExperience: Int, $minRating: Float) {
    searchBarbers(name: $name, city: $city, state: $state, specialty: $specialty, minExperience: $minExperience, minRating: $minRating) {
      id
      firstName
      lastName
      email
      phone
      avatar
      bio
      experienceYears
      specialties
      role
      isActive
      createdAt
      updatedAt
      averageRating
      totalRatings
      barberShops {
        id
        name
        address
        city
        state
        country
        phone
        email
        website
        avatar
        coverPhoto
      }
    }
  }
`;

const GET_FILTER_DATA = gql`
  query GetFilterData {
    getAvailableSpecialties
    getAvailableCities
    getAvailableStates
  }
`;

const GET_BARBER_WORKING_HOURS = gql`
  query GetBarberWorkingHours($barberId: ID!) {
    barberWorkingHours(barberId: $barberId) {
      id
      dayOfWeek
      startTime
      endTime
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_RATINGS_BY_BARBER = gql`
  query GetRatingsByBarber($entityId: ID!) {
    ratingsByEntity(entityId: $entityId, entityType: BARBER) {
      id
      rating
      comment
      createdAt
      updatedAt
      rater {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

const GET_MANAGEMENT_SERVICES_BY_BARBER = gql`
  query GetManagementServicesByBarber($barberId: ID!) {
    managementServicesByBarber(barberId: $barberId) {
      id
      name
      description
      price
      durationMinutes
      isActive
      category {
        id
        name
        icon
      }
    }
  }
`;

interface BarberFilters {
  name: string;
  specialty: string;
  minExperience: number;
  city: string;
  state: string;
  minRating: number;
}

const Barbers: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<BarberFilters>({
    name: '',
    specialty: '',
    minExperience: 0,
    city: '',
    state: '',
    minRating: 0
  });
  const [debouncedFilters, setDebouncedFilters] = useState<BarberFilters>(filters);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedBarber, setSelectedBarber] = useState<Barber | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [userRole, setUserRole] = useState<Role | null>(null);

  // Get user role from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  // Debounce filters
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  // Queries
  const { data: filterData } = useQuery(GET_FILTER_DATA);
  const availableSpecialties = filterData?.getAvailableSpecialties || [];
  const availableCities = filterData?.getAvailableCities || [];
  const availableStates = filterData?.getAvailableStates || [];

  const hasActiveFilters = Boolean(debouncedFilters.name || debouncedFilters.specialty || debouncedFilters.minExperience > 0 || debouncedFilters.city || debouncedFilters.state || debouncedFilters.minRating > 0);

  const { data: barbersData, loading: barbersLoading, error: barbersError } = useQuery(GET_BARBERS, {
    skip: hasActiveFilters,
    fetchPolicy: 'cache-and-network'
  });

  const { data: searchData, loading: searchLoading } = useQuery(SEARCH_BARBERS, {
    variables: {
      name: debouncedFilters.name || undefined,
      city: debouncedFilters.city || undefined,
      state: debouncedFilters.state || undefined,
      specialty: debouncedFilters.specialty || undefined,
      minExperience: debouncedFilters.minExperience > 0 ? debouncedFilters.minExperience : undefined,
      minRating: debouncedFilters.minRating > 0 ? debouncedFilters.minRating : undefined
    },
    skip: !hasActiveFilters,
    fetchPolicy: 'cache-and-network'
  });

  const { data: workingHoursData, loading: workingHoursLoading } = useQuery(GET_BARBER_WORKING_HOURS, {
    variables: { barberId: selectedBarber?.id || '' },
    skip: !selectedBarber,
    fetchPolicy: 'cache-and-network'
  });

  const { data: ratingsData, loading: ratingsLoading } = useQuery(GET_RATINGS_BY_BARBER, {
    variables: { entityId: selectedBarber?.id || '' },
    skip: !selectedBarber,
    fetchPolicy: 'cache-and-network'
  });

  const { data: servicesData, loading: servicesLoading } = useQuery(GET_MANAGEMENT_SERVICES_BY_BARBER, {
    variables: { barberId: selectedBarber?.id || '' },
    skip: !selectedBarber,
    fetchPolicy: 'cache-and-network'
  });

  // Get barbers data
  const barbers = searchData?.searchBarbers || barbersData?.barbers || [];

  // Apply client-side search term filter (other filters are handled by GraphQL)
  const filteredBarbers = barbers.filter((barber: Barber) => {
    const matchesSearch = !searchTerm || 
      `${barber.firstName} ${barber.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barber.specialties?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      barber.barberShops?.[0]?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const handleFilterChange = (key: keyof BarberFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      name: '',
      specialty: '',
      minExperience: 0,
      city: '',
      state: '',
      minRating: 0
    });
    setSearchTerm('');
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.name) count++;
    if (filters.specialty) count++;
    if (filters.minExperience > 0) count++;
    if (filters.city) count++;
    if (filters.state) count++;
    if (filters.minRating > 0) count++;
    return count;
  };

  const handleViewDetails = (barber: Barber) => {
    setSelectedBarber(barber);
    setDetailsOpen(true);
  };

  const handleBookAppointment = (barber: Barber) => {
    // Navigate to booking page or open booking modal
    navigate(`/book/${barber.id}`);
  };

  const renderBarberCard = (barber: Barber) => (
    <Card sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column',
      transition: 'transform 0.2s, box-shadow 0.2s',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
      },
    }}
    onClick={() => navigate(`/barbers/${barber.id}`)}>
      <CardContent sx={{ flex: 1 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar 
            src={barber.avatar} 
            sx={{ width: 60, height: 60, mr: 2 }}
          />
          <Box flex={1}>
            <Typography variant="h6" component="h2" gutterBottom>
              {barber.firstName} {barber.lastName}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Rating value={barber.averageRating || 0} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" ml={1}>
                ({barber.totalRatings || 0} reviews)
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary">
              {barber.experienceYears} years experience
            </Typography>
          </Box>
        </Box>
        
        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <Store sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="body2">
              {barber.barberShops?.[0]?.name || 'No shop assigned'}
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" mb={1}>
            <LocationOn sx={{ mr: 1, color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="body2">
              {barber.barberShops?.[0]?.city || 'N/A'}, {barber.barberShops?.[0]?.state || 'N/A'}
            </Typography>
          </Box>
        </Box>
        
        {barber.specialties && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Specialties:
            </Typography>
            <Typography variant="body2">
              {barber.specialties}
            </Typography>
          </Box>
        )}
        
        {barber.bio && (
          <Box mb={2}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              About:
            </Typography>
            <Typography variant="body2" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}>
              {barber.bio}
            </Typography>
          </Box>
        )}
      </CardContent>
      
      <CardActions sx={{ justifyContent: 'space-between', p: 2, mt: 'auto' }}>
        <Button 
          size="small" 
          variant="outlined"
          startIcon={<Info />}
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(barber);
          }}
        >
          Quick View
        </Button>
        <Button 
          size="small" 
          variant="contained"
          startIcon={<Visibility />}
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/barbers/${barber.id}`);
          }}
        >
          View Profile
        </Button>
      </CardActions>
    </Card>
  );

  const renderBarberDetails = () => (
    <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center">
          <Avatar 
            src={selectedBarber?.avatar} 
            sx={{ width: 50, height: 50, mr: 2 }}
          />
          <Box>
            <Typography variant="h6">
              {selectedBarber?.firstName} {selectedBarber?.lastName}
            </Typography>
            <Box display="flex" alignItems="center">
              <Rating value={selectedBarber?.averageRating || 0} readOnly size="small" />
              <Typography variant="body2" color="text.secondary" ml={1}>
                ({selectedBarber?.totalRatings || 0} reviews)
              </Typography>
            </Box>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Contact Information
              </Typography>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Email:</Typography>
                <Typography variant="body2">{selectedBarber?.email}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Phone:</Typography>
                <Typography variant="body2">{selectedBarber?.phone}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Experience:</Typography>
                <Typography variant="body2">{selectedBarber?.experienceYears} years</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Specialties:</Typography>
                <Typography variant="body2">{selectedBarber?.specialties}</Typography>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Store sx={{ mr: 1, verticalAlign: 'middle' }} />
                Barbershop Information
              </Typography>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Name:</Typography>
                <Typography variant="body2">{selectedBarber?.barberShops?.[0]?.name || 'No shop assigned'}</Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Address:</Typography>
                <Typography variant="body2">
                  {selectedBarber?.barberShops?.[0]?.address || 'N/A'}, {selectedBarber?.barberShops?.[0]?.city || 'N/A'}, {selectedBarber?.barberShops?.[0]?.state || 'N/A'}
                </Typography>
              </Box>
              <Box mb={1}>
                <Typography variant="body2" color="text.secondary">Phone:</Typography>
                <Typography variant="body2">{selectedBarber?.barberShops?.[0]?.phone || 'N/A'}</Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
                Working Hours
              </Typography>
              {workingHoursLoading ? (
                <CircularProgress size={24} />
              ) : (
                <List dense>
                  {workingHoursData?.barberWorkingHours?.map((hours: any) => (
                    <ListItem key={hours.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={hours.dayOfWeek}
                        secondary={`${hours.startTime} - ${hours.endTime}`}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Assignment sx={{ mr: 1, verticalAlign: 'middle' }} />
                Services
              </Typography>
              {servicesLoading ? (
                <CircularProgress size={24} />
              ) : (
                <List dense>
                  {servicesData?.managementServicesByBarber?.map((service: any) => (
                    <ListItem key={service.id} sx={{ px: 0 }}>
                      <ListItemText
                        primary={service.name}
                        secondary={
                          <Box display="flex" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              {service.durationMinutes} min
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${service.price}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recent Reviews
              </Typography>
              {ratingsLoading ? (
                <CircularProgress size={24} />
              ) : (
                <Stack spacing={2}>
                  {ratingsData?.ratingsByEntity?.slice(0, 3).map((rating: any) => (
                    <Box key={rating.id}>
                      <Box display="flex" alignItems="center" mb={1}>
                        <Avatar 
                          src={rating.rater?.avatar} 
                          sx={{ width: 32, height: 32, mr: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {rating.rater?.firstName} {rating.rater?.lastName}
                          </Typography>
                          <Rating value={rating.rating} readOnly size="small" />
                        </Box>
                      </Box>
                      {rating.comment && (
                        <Typography variant="body2" color="text.secondary">
                          {rating.comment}
                        </Typography>
                      )}
                      <Divider sx={{ mt: 1 }} />
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetailsOpen(false)}>Close</Button>
        {userRole === Role.CUSTOMER && (
          <Button 
            variant="contained" 
            onClick={() => handleBookAppointment(selectedBarber!)}
            startIcon={<BookOnline />}
          >
            Book Appointment
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );

  if (barbersLoading) return <CircularProgress />;
  if (barbersError) return <Alert severity="error">Error loading barbers: {barbersError.message}</Alert>;

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom>
        Find Your Perfect Barber
      </Typography>
      
      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search barbers, specialties, or barbershops..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: searchTerm && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchTerm('')}>
                      <Clear />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant={showFilters ? 'contained' : 'outlined'}
              startIcon={<FilterList />}
              endIcon={showFilters ? <ExpandLess /> : <ExpandMore />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ mr: 1 }}
            >
              Filters {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
            </Button>
            <Button
              variant="outlined"
              startIcon={<Clear />}
              onClick={handleClearFilters}
            >
              Clear
            </Button>
          </Grid>
          <Grid item xs={12} md={2}>
            <Typography variant="body2" color="text.secondary">
              {filteredBarbers.length} barbers found
            </Typography>
          </Grid>
        </Grid>
        
        <Collapse in={showFilters}>
          <Paper sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Advanced Search Filters
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Barber Name"
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  placeholder="Search by name..."
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={availableSpecialties}
                  value={filters.specialty}
                  onChange={(_, newValue) => handleFilterChange('specialty', newValue || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="Specialty" placeholder="Select specialty..." />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Min Experience (years)"
                  type="number"
                  value={filters.minExperience}
                  onChange={(e) => handleFilterChange('minExperience', parseInt(e.target.value) || 0)}
                  inputProps={{ min: 0, max: 50 }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={availableCities}
                  value={filters.city}
                  onChange={(_, newValue) => handleFilterChange('city', newValue || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="City" placeholder="Select city..." />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Autocomplete
                  options={availableStates}
                  value={filters.state}
                  onChange={(_, newValue) => handleFilterChange('state', newValue || '')}
                  renderInput={(params) => (
                    <TextField {...params} label="State" placeholder="Select state..." />
                  )}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
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
              <Button onClick={handleClearFilters} variant="outlined">
                Clear All Filters
              </Button>
            </Box>
          </Paper>
        </Collapse>
      </Paper>
      
      {/* Barbers Grid */}
      {filteredBarbers.length === 0 ? (
        <Alert severity="info">
          No barbers found matching your criteria. Try adjusting your search or filters.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {filteredBarbers.map((barber: Barber) => (
            <Grid item xs={12} sm={6} md={4} key={barber.id} sx={{ display: 'flex' }}>
              {renderBarberCard(barber)}
            </Grid>
          ))}
        </Grid>
      )}
      
      {/* Barber Details Dialog */}
      {selectedBarber && renderBarberDetails()}
    </Box>
  );
};

export default Barbers;