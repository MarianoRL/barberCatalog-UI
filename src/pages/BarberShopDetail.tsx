import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton,
  Rating,
  Stack,
  Tabs,
  Tab,
  Container,
  Fab,
  Tooltip,
  Badge,
  CardActions,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import {
  LocationOn,
  Phone,
  Email,
  Language,
  AccessTime,
  Star,
  Person,
  ContentCut,
  BookOnline,
  Share,
  Favorite,
  FavoriteBorder,
  Schedule,
  AttachMoney,
  Info,
  CalendarMonth,
  Groups,
  Business,
  Close,
  Check,
  Edit,
  Delete,
  Add,
  RateReview
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, gql } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { Role } from '../types';

// GraphQL Queries
const GET_BARBER_SHOP_DETAILS = gql`
  query GetBarberShopDetails($id: ID!) {
    barberShop(id: $id) {
      id
      name
      description
      address
      city
      state
      country
      zipCode
      phone
      email
      website
      avatar
      coverPhoto
      isActive
      createdAt
      updatedAt
      averageRating
      totalRatings
      favoriteCount
      owner {
        id
        firstName
        lastName
        email
      }
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
        averageRating
        totalRatings
        isActive
      }
      services {
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
        barber {
          id
          firstName
          lastName
        }
      }
      workingHours {
        id
        dayOfWeek
        startTime
        endTime
        isActive
      }
    }
  }
`;

const GET_BARBER_SHOP_RATINGS = gql`
  query GetBarberShopRatings($entityId: ID!) {
    ratingsByEntity(entityId: $entityId, entityType: BARBERSHOP) {
      id
      rating
      comment
      createdAt
      rater {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

const ADD_TO_FAVORITES = gql`
  mutation AddToFavorites($userId: ID!, $shopId: ID!) {
    addToFavorites(userId: $userId, shopId: $shopId) {
      id
      createdAt
    }
  }
`;

const REMOVE_FROM_FAVORITES = gql`
  mutation RemoveFromFavorites($userId: ID!, $shopId: ID!) {
    removeFromFavorites(userId: $userId, shopId: $shopId)
  }
`;

const CHECK_IS_FAVORITE = gql`
  query CheckIsFavorite($userId: ID!, $shopId: ID!) {
    isFavorite(userId: $userId, shopId: $shopId)
  }
`;

const CREATE_USER_RATING = gql`
  mutation CreateUserRating($userId: ID!, $entityId: ID!, $entityType: RatedType!, $rating: Int!, $comment: String, $bookingId: ID) {
    createUserRating(userId: $userId, entityId: $entityId, entityType: $entityType, rating: $rating, comment: $comment, bookingId: $bookingId) {
      id
      rating
      comment
      createdAt
      rater {
        id
        firstName
        lastName
        avatar
      }
    }
  }
`;

const UPDATE_RATING = gql`
  mutation UpdateRating($id: ID!, $rating: Int!, $comment: String) {
    updateRating(id: $id, rating: $rating, comment: $comment) {
      id
      rating
      comment
      updatedAt
    }
  }
`;

const DELETE_RATING = gql`
  mutation DeleteRating($id: ID!) {
    deleteRating(id: $id)
  }
`;

const CREATE_BOOKING = gql`
  mutation CreateBooking($input: CreateBookingInput!) {
    createBooking(input: $input) {
      id
      startTime
      endTime
      status
      totalPrice
      notes
      createdAt
    }
  }
`;

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const BarberShopDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [selectedServices, setSelectedServices] = useState<any[]>([]);
  const [selectedBarber, setSelectedBarber] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState('');
  const [bookingTime, setBookingTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [newRating, setNewRating] = useState<number | null>(0);
  const [newComment, setNewComment] = useState('');

  // Get user info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserRole(payload.role);
        setUserId(payload.userId);
      } catch (error) {
        console.error('Error parsing token:', error);
      }
    }
  }, []);

  // Queries
  const { data: shopData, loading: shopLoading, error: shopError } = useQuery(GET_BARBER_SHOP_DETAILS, {
    variables: { id: id || '' },
    skip: !id
  });

  const { data: ratingsData, loading: ratingsLoading, refetch: refetchRatings } = useQuery(GET_BARBER_SHOP_RATINGS, {
    variables: { entityId: id || '' },
    skip: !id
  });

  const { data: favoriteData, refetch: refetchFavorite } = useQuery(CHECK_IS_FAVORITE, {
    variables: { userId: userId || '', shopId: id || '' },
    skip: !userId || !id
  });

  // Mutations
  const [addToFavorites] = useMutation(ADD_TO_FAVORITES);
  const [removeFromFavorites] = useMutation(REMOVE_FROM_FAVORITES);
  const [createBooking] = useMutation(CREATE_BOOKING);
  const [createUserRating] = useMutation(CREATE_USER_RATING);
  const [updateRating] = useMutation(UPDATE_RATING);
  const [deleteRating] = useMutation(DELETE_RATING);

  if (shopLoading) return <CircularProgress />;
  if (shopError) return <Alert severity="error">Error loading shop details: {shopError.message}</Alert>;
  if (!shopData?.barberShop) return <Alert severity="error">Shop not found</Alert>;

  const shop = shopData.barberShop;
  const ratings = ratingsData?.ratingsByEntity || [];
  const isFavorite = favoriteData?.isFavorite || false;
  const userReview = ratings.find((rating: any) => rating.rater?.id === userId);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleToggleFavorite = async () => {
    if (!userId) {
      navigate('/login');
      return;
    }

    try {
      if (isFavorite) {
        await removeFromFavorites({ variables: { userId, shopId: id } });
      } else {
        await addToFavorites({ variables: { userId, shopId: id } });
      }
      refetchFavorite();
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleBookService = (service: any, barber?: any) => {
    if (!userId) {
      navigate('/login');
      return;
    }
    setSelectedService(service);
    setSelectedServices([]);
    setSelectedBarber(barber);
    setBookingDialogOpen(true);
  };

  const handleBookShop = () => {
    if (!userId) {
      navigate('/login');
      return;
    }
    setSelectedService(null);
    setSelectedServices([]);
    setSelectedBarber(null);
    setBookingDialogOpen(true);
  };

  const handleServiceSelection = (service: any, isChecked: boolean) => {
    if (isChecked) {
      setSelectedServices(prev => [...prev, service]);
    } else {
      setSelectedServices(prev => prev.filter(s => s.id !== service.id));
    }
  };

  const handleCreateBooking = async () => {
    const servicesToBook = selectedServices.length > 0 ? selectedServices : (selectedService ? [selectedService] : []);
    
    if (servicesToBook.length === 0 || !bookingDate || !bookingTime) return;

    try {
      const startTime = new Date(`${bookingDate}T${bookingTime}`).toISOString();
      
      // Find an available barber if none selected
      const barberId = selectedBarber?.id || shop.barbers.find((b: any) => b.isActive)?.id;
      
      if (!barberId) {
        alert('No available barber found. Please try again later.');
        return;
      }
      
      // Create bookings for all selected services
      for (const service of servicesToBook) {
        await createBooking({
          variables: {
            input: {
              userId: userId,
              barberId: barberId,
              barberShopId: id,
              managementServiceId: service.id,
              startTime,
              notes: bookingNotes
            }
          }
        });
      }
      
      // Show success message with all booked services
      const serviceNames = servicesToBook.map(s => s.name).join(', ');
      const totalPrice = servicesToBook.reduce((sum, s) => sum + s.price, 0);
      
      alert(`Booking confirmed for: ${serviceNames}\nTotal Price: $${totalPrice}`);
      
      setBookingDialogOpen(false);
      setSelectedService(null);
      setSelectedServices([]);
      setSelectedBarber(null);
      setBookingDate('');
      setBookingTime('');
      setBookingNotes('');
      
      // Navigate to bookings page
      navigate('/bookings');
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('Error creating booking. Please try again.');
    }
  };

  const handleAddReview = () => {
    setEditingReview(null);
    setNewRating(0);
    setNewComment('');
    setReviewDialogOpen(true);
  };

  const handleEditReview = (review: any) => {
    setEditingReview(review);
    setNewRating(review.rating);
    setNewComment(review.comment || '');
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!userId || !newRating) return;

    try {
      if (editingReview) {
        await updateRating({
          variables: {
            id: editingReview.id,
            rating: newRating,
            comment: newComment
          }
        });
      } else {
        await createUserRating({
          variables: {
            userId: userId,
            entityId: id,
            entityType: 'BARBERSHOP',
            rating: newRating,
            comment: newComment
          }
        });
      }
      
      setReviewDialogOpen(false);
      setEditingReview(null);
      setNewRating(0);
      setNewComment('');
      refetchRatings();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteRating({ variables: { id: reviewId } });
      refetchRatings();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const renderShopHeader = () => (
    <Box sx={{ position: 'relative', mb: 4 }}>
      {/* Cover Photo */}
      <Box
        sx={{
          height: 300,
          backgroundImage: `url(${shop.coverPhoto || '/api/placeholder/1200/300'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 2,
          position: 'relative',
          display: 'flex',
          alignItems: 'end',
          background: shop.coverPhoto ? undefined : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            borderRadius: 2
          }}
        />
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ p: 3, color: 'white' }}>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar
                src={shop.avatar}
                sx={{ width: 80, height: 80, mr: 3, border: '3px solid white' }}
              />
              <Box>
                <Typography variant="h3" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                  {shop.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Box display="flex" alignItems="center">
                    <Star sx={{ color: '#ffeb3b', mr: 0.5 }} />
                    <Typography variant="h6" sx={{ color: 'white' }}>
                      {shop.averageRating ? shop.averageRating.toFixed(1) : 'N/A'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', ml: 1 }}>
                      ({shop.totalRatings || 0} reviews)
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Favorite sx={{ color: '#f50057', mr: 0.5 }} />
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                      {shop.favoriteCount || 0} favorites
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Stack direction="row" spacing={1}>
          {userId && !userReview && (
            <Tooltip title="Write a review">
              <Button
                variant="contained"
                startIcon={<RateReview />}
                onClick={handleAddReview}
                sx={{ bgcolor: 'rgba(255,255,255,0.9)', color: 'primary.main' }}
              >
                Review
              </Button>
            </Tooltip>
          )}
          <Tooltip title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}>
            <IconButton 
              onClick={handleToggleFavorite}
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                color: isFavorite ? 'red' : 'gray',
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Share">
            <IconButton 
              sx={{ 
                bgcolor: 'rgba(255,255,255,0.9)', 
                '&:hover': { bgcolor: 'rgba(255,255,255,1)' }
              }}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
    </Box>
  );

  const renderShopInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
              About
            </Typography>
            <Typography variant="body1" paragraph>
              {shop.description || 'No description available.'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <LocationOn sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">
                    {shop.address}, {shop.city}, {shop.state} {shop.zipCode}
                  </Typography>
                </Box>
                {shop.phone && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{shop.phone}</Typography>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={6}>
                {shop.email && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{shop.email}</Typography>
                  </Box>
                )}
                {shop.website && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Language sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      <a href={shop.website} target="_blank" rel="noopener noreferrer">
                        {shop.website}
                      </a>
                    </Typography>
                  </Box>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Working Hours */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
              Working Hours
            </Typography>
            <Grid container spacing={2}>
              {shop.workingHours?.map((hours: any) => (
                <Grid item xs={12} sm={6} md={4} key={hours.id}>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      {hours.dayOfWeek}
                    </Typography>
                    <Typography variant="body2">
                      {hours.isActive ? `${hours.startTime} - ${hours.endTime}` : 'Closed'}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Groups sx={{ mr: 1, verticalAlign: 'middle' }} />
              Our Team
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {shop.barbers?.length || 0} Professional Barbers
            </Typography>
            
            <Stack spacing={2} sx={{ mt: 2 }}>
              {shop.barbers?.slice(0, 3).map((barber: any) => (
                <Box 
                  key={barber.id} 
                  display="flex" 
                  alignItems="center"
                  sx={{ 
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 1,
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                  onClick={() => navigate(`/barbers/${barber.id}`)}
                >
                  <Avatar src={barber.avatar} sx={{ mr: 2 }} />
                  <Box flex={1}>
                    <Typography variant="body2" fontWeight="bold">
                      {barber.firstName} {barber.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {barber.experienceYears} years experience
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Star sx={{ color: '#ffeb3b', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="caption">
                      {barber.averageRating ? barber.averageRating.toFixed(1) : 'N/A'}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Stack>
            
            {shop.barbers?.length > 3 && (
              <Button 
                variant="outlined" 
                fullWidth 
                sx={{ mt: 2 }}
                onClick={() => setTabValue(1)}
              >
                View All Barbers
              </Button>
            )}
            
            {userRole === Role.CUSTOMER && (
              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<BookOnline />}
                onClick={handleBookShop}
                sx={{ mt: 2 }}
              >
                Book Appointment
              </Button>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderBarbers = () => (
    <Grid container spacing={3}>
      {shop.barbers?.map((barber: any) => (
        <Grid item xs={12} md={6} key={barber.id}>
          <Card 
            sx={{ 
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.12)',
              }
            }}
            onClick={() => navigate(`/barbers/${barber.id}`)}
          >
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar src={barber.avatar} sx={{ width: 60, height: 60, mr: 2 }} />
                <Box flex={1}>
                  <Typography variant="h6">
                    {barber.firstName} {barber.lastName}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <Star sx={{ color: '#ffeb3b', fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2">
                      {barber.averageRating ? barber.averageRating.toFixed(1) : 'N/A'} ({barber.totalRatings || 0} reviews)
                    </Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {barber.experienceYears} years experience
                  </Typography>
                </Box>
              </Box>
              
              {barber.bio && (
                <Typography variant="body2" paragraph>
                  {barber.bio}
                </Typography>
              )}
              
              {barber.specialties && (
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Specialties:
                  </Typography>
                  <Typography variant="body2">{barber.specialties}</Typography>
                </Box>
              )}
              
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Chip 
                  label={barber.isActive ? 'Available' : 'Unavailable'} 
                  color={barber.isActive ? 'success' : 'default'}
                  size="small"
                />
                {userRole === Role.CUSTOMER && (
                  <Button 
                    variant="contained" 
                    size="small"
                    startIcon={<BookOnline />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookService(null, barber);
                    }}
                    disabled={!barber.isActive}
                  >
                    Book Now
                  </Button>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderServices = () => (
    <Grid container spacing={3}>
      {shop.services?.map((service: any) => (
        <Grid item xs={12} md={6} lg={4} key={service.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flex: 1 }}>
              <Box display="flex" alignItems="center" mb={2}>
                <ContentCut sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" component="h3">
                  {service.name}
                </Typography>
              </Box>
              
              {service.description && (
                <Typography variant="body2" color="text.secondary" paragraph>
                  {service.description}
                </Typography>
              )}
              
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <AttachMoney sx={{ mr: 0.5, color: 'success.main' }} />
                  <Typography variant="h6" color="success.main">
                    ${service.price}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <AccessTime sx={{ mr: 0.5, color: 'text.secondary' }} />
                  <Typography variant="body2" color="text.secondary">
                    {service.durationMinutes} min
                  </Typography>
                </Box>
              </Box>
              
              <Chip 
                label={service.category?.name || 'General'} 
                variant="outlined" 
                size="small"
                sx={{ mb: 2 }}
              />
              
              {service.barber && (
                <Box display="flex" alignItems="center" mb={2}>
                  <Person sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    Specialist: {service.barber.firstName} {service.barber.lastName}
                  </Typography>
                </Box>
              )}
            </CardContent>
            
            <CardActions>
              {userRole === Role.CUSTOMER && (
                <Button 
                  variant="contained" 
                  fullWidth
                  startIcon={<BookOnline />}
                  onClick={() => handleBookService(service, service.barber)}
                  disabled={!service.isActive}
                >
                  Book Service
                </Button>
              )}
            </CardActions>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderReviews = () => (
    <Box>
      {userId && userReview && (
        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" color="primary">Your Review</Typography>
              <Box>
                <IconButton onClick={() => handleEditReview(userReview)} size="small">
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDeleteReview(userReview.id)} size="small">
                  <Delete />
                </IconButton>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar src={userReview.rater?.avatar} sx={{ mr: 2 }} />
              <Box flex={1}>
                <Typography variant="body1" fontWeight="bold">
                  {userReview.rater?.firstName} {userReview.rater?.lastName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {format(parseISO(userReview.createdAt), 'MMM dd, yyyy')}
                </Typography>
              </Box>
              <Rating value={userReview.rating} readOnly size="small" />
            </Box>
            {userReview.comment && (
              <Typography variant="body2">
                {userReview.comment}
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {ratingsLoading ? (
        <CircularProgress />
      ) : (
        <Stack spacing={3}>
          {ratings.filter((rating: any) => rating.rater?.id !== userId).map((rating: any) => (
            <Card key={rating.id}>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar src={rating.rater?.avatar} sx={{ mr: 2 }} />
                  <Box flex={1}>
                    <Typography variant="body1" fontWeight="bold">
                      {rating.rater?.firstName} {rating.rater?.lastName}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {format(parseISO(rating.createdAt), 'MMM dd, yyyy')}
                    </Typography>
                  </Box>
                  <Rating value={rating.rating} readOnly size="small" />
                </Box>
                {rating.comment && (
                  <Typography variant="body2">
                    {rating.comment}
                  </Typography>
                )}
              </CardContent>
            </Card>
          ))}
          {ratings.length === 0 && (
            <Alert severity="info">No reviews yet.</Alert>
          )}
        </Stack>
      )}
    </Box>
  );

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {renderShopHeader()}
      
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="shop details tabs">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Our Team" {...a11yProps(1)} />
            <Tab label="Services" {...a11yProps(2)} />
            <Tab label="Reviews" {...a11yProps(3)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderShopInfo()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderBarbers()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderServices()}
        </TabPanel>
        <TabPanel value={tabValue} index={3}>
          {renderReviews()}
        </TabPanel>
      </Container>

      {/* Floating Action Button */}
      {userRole === Role.CUSTOMER && !userReview && (
        <Fab
          color="primary"
          aria-label="add review"
          sx={{ 
            position: 'fixed', 
            bottom: 16, 
            right: 16,
            '& .MuiSvgIcon-root': { fontSize: 28 }
          }}
          onClick={handleAddReview}
        >
          <Add />
        </Fab>
      )}

      {/* Enhanced Booking Dialog */}
      <Dialog open={bookingDialogOpen} onClose={() => setBookingDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Book Appointment at {shop.name}
          <IconButton
            aria-label="close"
            onClick={() => setBookingDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3}>
            {/* Service Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <ContentCut sx={{ mr: 1, verticalAlign: 'middle' }} />
                Select Services
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Choose one or more services for your appointment
              </Typography>
              
              <Paper sx={{ p: 2, maxHeight: 300, overflow: 'auto' }}>
                {shop.services?.filter((service: any) => service.isActive).map((service: any) => (
                  <FormControlLabel
                    key={service.id}
                    control={
                      <Checkbox
                        checked={selectedServices.some(s => s.id === service.id)}
                        onChange={(e) => handleServiceSelection(service, e.target.checked)}
                      />
                    }
                    label={
                      <Box sx={{ ml: 1 }}>
                        <Typography variant="body1">{service.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {service.description}
                        </Typography>
                        <Typography variant="body2" color="success.main">
                          ${service.price} • {service.durationMinutes} min
                        </Typography>
                      </Box>
                    }
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      width: '100%',
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      '&:hover': {
                        bgcolor: 'action.hover'
                      }
                    }}
                  />
                ))}
              </Paper>
              
              {selectedServices.length > 0 && (
                <Card sx={{ mt: 2, bgcolor: 'primary.50' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Selected Services ({selectedServices.length})
                    </Typography>
                    {selectedServices.map((service: any) => (
                      <Box key={service.id} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">{service.name}</Typography>
                        <Typography variant="body2" color="success.main">
                          ${service.price}
                        </Typography>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="h6">Total Price:</Typography>
                      <Typography variant="h6" color="success.main">
                        ${selectedServices.reduce((sum, s) => sum + s.price, 0)}
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Total Duration: {selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0)} minutes
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>

            {/* Barber Selection */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                Select Barber (Optional)
              </Typography>
              <FormControl fullWidth>
                <InputLabel>Choose a barber or leave blank for any available</InputLabel>
                <Select
                  value={selectedBarber?.id || ''}
                  onChange={(e) => {
                    const barber = shop.barbers?.find((b: any) => b.id === e.target.value);
                    setSelectedBarber(barber);
                  }}
                  label="Choose a barber or leave blank for any available"
                >
                  <MenuItem value="">
                    <Box>
                      <Typography variant="body1">Any Available Barber</Typography>
                      <Typography variant="body2" color="text.secondary">
                        We'll assign the best available barber for your appointment
                      </Typography>
                    </Box>
                  </MenuItem>
                  {shop.barbers?.filter((barber: any) => barber.isActive).map((barber: any) => (
                    <MenuItem key={barber.id} value={barber.id}>
                      <Box display="flex" alignItems="center">
                        <Avatar src={barber.avatar} sx={{ width: 32, height: 32, mr: 2 }} />
                        <Box>
                          <Typography variant="body1">
                            {barber.firstName} {barber.lastName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {barber.experienceYears} years experience • ⭐ {barber.averageRating ? barber.averageRating.toFixed(1) : 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Date and Time */}
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date"
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
                inputProps={{ min: new Date().toISOString().split('T')[0] }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Time"
                type="time"
                value={bookingTime}
                onChange={(e) => setBookingTime(e.target.value)}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            
            {/* Notes */}
            <Grid item xs={12}>
              <TextField
                label="Notes (Optional)"
                multiline
                rows={3}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                fullWidth
                placeholder="Any special requests or notes for your appointment"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBookingDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleCreateBooking} 
            variant="contained"
            disabled={selectedServices.length === 0 || !bookingDate || !bookingTime}
            startIcon={<Check />}
          >
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onClose={() => setReviewDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingReview ? 'Edit Review' : 'Write a Review'}
          <IconButton
            aria-label="close"
            onClick={() => setReviewDialogOpen(false)}
            sx={{ position: 'absolute', right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              {shop.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rate your experience with this barber shop
            </Typography>
          </Box>
          
          <Box mb={3}>
            <Typography component="legend" gutterBottom>Rating</Typography>
            <Rating
              name="rating"
              value={newRating}
              onChange={(event, newValue) => {
                setNewRating(newValue);
              }}
              size="large"
            />
          </Box>
          
          <TextField
            label="Comment (Optional)"
            multiline
            rows={4}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            fullWidth
            placeholder="Share your experience..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitReview} 
            variant="contained"
            disabled={!newRating}
            startIcon={<Check />}
          >
            {editingReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BarberShopDetail;