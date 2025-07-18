import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  CircularProgress,
  Paper,
  Divider,
  Stack,
  Tabs,
  Tab,
  Container,
  Fab,
  Tooltip,
  Rating as MuiRating,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar
} from '@mui/material';
import {
  Phone,
  Email,
  Star,
  ContentCut,
  BookOnline,
  Share,
  Schedule,
  AttachMoney,
  Info,
  CalendarMonth,
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
import { getCurrentUser } from '../utils/auth';
import { Role } from '../types';

// GraphQL Queries
const GET_BARBER_DETAILS = gql`
  query GetBarberDetails($id: ID!) {
    barber(id: $id) {
      id
      email
      firstName
      lastName
      phone
      avatar
      bio
      experienceYears
      specialties
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
        avatar
        phone
        email
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
        barberShop {
          id
          name
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

const GET_BARBER_RATINGS = gql`
  query GetBarberRatings($entityId: ID!) {
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
      booking {
        id
        startTime
        managementService {
          id
          name
        }
      }
    }
  }
`;

const GET_RATING_STATS = gql`
  query GetRatingStats($entityId: ID!) {
    ratingStats(entityId: $entityId, entityType: BARBER) {
      averageRating
      totalRatings
      ratingDistribution {
        rating
        count
        percentage
      }
      recentRatings {
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

const BarberDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [tabValue, setTabValue] = useState(0);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [newRating, setNewRating] = useState<number | null>(0);
  const [newComment, setNewComment] = useState('');

  // Queries
  const { data: barberData, loading: barberLoading, error: barberError } = useQuery(GET_BARBER_DETAILS, {
    variables: { id: id || '' },
    skip: !id
  });

  const { data: ratingsData, loading: ratingsLoading, refetch: refetchRatings } = useQuery(GET_BARBER_RATINGS, {
    variables: { entityId: id || '' },
    skip: !id
  });

  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useQuery(GET_RATING_STATS, {
    variables: { entityId: id || '' },
    skip: !id
  });

  // Mutations
  const [createUserRating] = useMutation(CREATE_USER_RATING);
  const [updateRating] = useMutation(UPDATE_RATING);
  const [deleteRating] = useMutation(DELETE_RATING);

  if (barberLoading) return <CircularProgress />;
  if (barberError) return <Alert severity="error">Error loading barber details: {barberError.message}</Alert>;
  if (!barberData?.barber) return <Alert severity="error">Barber not found</Alert>;

  const barber = barberData.barber;
  const ratings = ratingsData?.ratingsByEntity || [];
  const stats = statsData?.ratingStats;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
    if (!currentUser || !newRating) return;

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
            userId: currentUser.id,
            entityId: id,
            entityType: 'BARBER',
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
      refetchStats();
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await deleteRating({ variables: { id: reviewId } });
      refetchRatings();
      refetchStats();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const userReview = ratings.find((rating: any) => rating.rater?.id === currentUser?.id);

  const renderBarberHeader = () => (
    <Box sx={{ position: 'relative', mb: 4 }}>
      <Paper
        sx={{
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          borderRadius: 2
        }}
      >
        <Container maxWidth="lg">
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              src={barber.avatar}
              sx={{ width: 120, height: 120, mr: 4, border: '4px solid white' }}
            />
            <Box flex={1}>
              <Typography variant="h2" component="h1" gutterBottom sx={{ color: 'white', fontWeight: 'bold' }}>
                {barber.firstName} {barber.lastName}
              </Typography>
              <Box display="flex" alignItems="center" gap={3} mb={2}>
                <Box display="flex" alignItems="center">
                  <Star sx={{ color: '#ffeb3b', mr: 0.5, fontSize: 28 }} />
                  <Typography variant="h5" sx={{ color: 'white' }}>
                    {barber.averageRating ? barber.averageRating.toFixed(1) : 'N/A'}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)', ml: 1 }}>
                    ({barber.totalRatings || 0} reviews)
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Schedule sx={{ color: 'white', mr: 0.5 }} />
                  <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                    {barber.experienceYears} years experience
                  </Typography>
                </Box>
              </Box>
              <Chip 
                label={barber.isActive ? 'Available' : 'Unavailable'} 
                color={barber.isActive ? 'success' : 'default'}
                sx={{ fontSize: '1rem', py: 1, px: 2 }}
              />
            </Box>
          </Box>
          
          {barber.specialties && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ color: 'rgba(255,255,255,0.9)' }}>
                Specialties:
              </Typography>
              <Typography variant="body1" sx={{ color: 'white' }}>
                {barber.specialties}
              </Typography>
            </Box>
          )}
        </Container>
      </Paper>

      {/* Action Buttons */}
      <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
        <Stack direction="row" spacing={1}>
          {currentUser && !userReview && (
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

  const renderBarberInfo = () => (
    <Grid container spacing={3}>
      <Grid item xs={12} md={8}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Info sx={{ mr: 1, verticalAlign: 'middle' }} />
              About
            </Typography>
            <Typography variant="body1" paragraph>
              {barber.bio || 'No bio available.'}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h6" gutterBottom>
              <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
              Contact Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Email sx={{ mr: 1, color: 'text.secondary' }} />
                  <Typography variant="body2">{barber.email}</Typography>
                </Box>
                {barber.phone && (
                  <Box display="flex" alignItems="center" mb={1}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{barber.phone}</Typography>
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
              <Schedule sx={{ mr: 1, verticalAlign: 'middle' }} />
              Working Hours
            </Typography>
            <Grid container spacing={2}>
              {barber.workingHours?.map((hours: any) => (
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
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
              Barber Shops
            </Typography>
            <Stack spacing={2}>
              {barber.barberShops?.map((shop: any) => (
                <Paper key={shop.id} sx={{ p: 2, cursor: 'pointer' }} onClick={() => navigate(`/barbershops/${shop.id}`)}>
                  <Box display="flex" alignItems="center">
                    <Avatar src={shop.avatar} sx={{ mr: 2 }} />
                    <Box flex={1}>
                      <Typography variant="body1" fontWeight="bold">
                        {shop.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {shop.city}, {shop.state}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Rating Stats */}
        {stats && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                Rating Overview
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Typography variant="h3" color="primary" mr={2}>
                  {stats.averageRating.toFixed(1)}
                </Typography>
                <Box>
                  <MuiRating value={stats.averageRating} readOnly precision={0.1} />
                  <Typography variant="body2" color="text.secondary">
                    Based on {stats.totalRatings} reviews
                  </Typography>
                </Box>
              </Box>
              
              {stats.ratingDistribution.map((dist: any) => (
                <Box key={dist.rating} display="flex" alignItems="center" mb={1}>
                  <Typography variant="body2" sx={{ minWidth: '20px' }}>
                    {dist.rating}
                  </Typography>
                  <Star sx={{ fontSize: 16, color: '#ffeb3b', mx: 0.5 }} />
                  <LinearProgress
                    variant="determinate"
                    value={dist.percentage}
                    sx={{ flex: 1, mx: 1, height: 8, borderRadius: 4 }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ minWidth: '40px' }}>
                    {dist.count}
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        )}
      </Grid>
    </Grid>
  );

  const renderServices = () => (
    <Grid container spacing={3}>
      {barber.services?.map((service: any) => (
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
                  <Schedule sx={{ mr: 0.5, color: 'text.secondary' }} />
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
              
              <Typography variant="caption" color="text.secondary">
                Available at: {service.barberShop?.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );

  const renderReviews = () => (
    <Box>
      {currentUser && userReview && (
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
              <MuiRating value={userReview.rating} readOnly size="small" />
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
          {ratings.filter((rating: any) => rating.rater?.id !== currentUser?.id).map((rating: any) => (
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
                    {rating.booking && (
                      <Typography variant="caption" color="text.secondary" display="block">
                        Service: {rating.booking.managementService?.name}
                      </Typography>
                    )}
                  </Box>
                  <MuiRating value={rating.rating} readOnly size="small" />
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
      {renderBarberHeader()}
      
      <Container maxWidth="lg">
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="barber details tabs">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Services" {...a11yProps(1)} />
            <Tab label="Reviews" {...a11yProps(2)} />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          {renderBarberInfo()}
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          {renderServices()}
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          {renderReviews()}
        </TabPanel>
      </Container>

      {/* Floating Action Button */}
      {currentUser && currentUser.role === Role.CUSTOMER && !userReview && (
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
              {barber.firstName} {barber.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Rate your experience with this barber
            </Typography>
          </Box>
          
          <Box mb={3}>
            <Typography component="legend" gutterBottom>Rating</Typography>
            <MuiRating
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

export default BarberDetail;