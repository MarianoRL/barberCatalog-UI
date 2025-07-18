import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Avatar,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Rating,
  IconButton,
  Badge,
  Fab
} from '@mui/material';
import {
  CalendarToday,
  Schedule,
  Person,
  Store,
  Star,
  TrendingUp,
  Notifications,
  Add,
  BookOnline,
  Dashboard as DashboardIcon,
  Analytics,
  Today,
  Upcoming,
  History,
  AttachMoney,
  Group,
  Assessment
} from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfWeek, endOfWeek, isToday, isTomorrow } from 'date-fns';
import { Role, BookingStatus } from '../types';
import { getCurrentUser } from '../utils/auth';

// GraphQL Queries
const GET_DASHBOARD_DATA = gql`
  query GetDashboardData {
    barberShops {
      id
      name
      avatar
      city
      state
      averageRating
      totalRatings
    }
    
    barbers {
      id
      firstName
      lastName
      avatar
      experienceYears
      specialties
      averageRating
      totalRatings
      barberShops {
        name
        city
        state
      }
    }
  }
`;

const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: ID!) {
    bookingsByUser(userId: $userId) {
      id
      status
      totalPrice
      createdAt
    }
    
    upcomingBookings(userId: $userId) {
      id
      startTime
      endTime
      status
      totalPrice
      barber {
        id
        firstName
        lastName
        avatar
        barberShops {
          name
        }
      }
      managementService {
        id
        name
        category {
          name
          icon
        }
      }
    }
  }
`;

const GET_BARBER_BOOKINGS = gql`
  query GetBarberBookings($barberId: ID!) {
    bookingsByBarber(barberId: $barberId) {
      id
      status
      totalPrice
      createdAt
    }
    
    upcomingBookingsByBarber(barberId: $barberId) {
      id
      startTime
      endTime
      status
      totalPrice
      user {
        id
        firstName
        lastName
        avatar
      }
      managementService {
        id
        name
        category {
          name
          icon
        }
      }
    }
  }
`;

const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: ID!) {
    favorites(userId: $userId) {
      id
      barberShops {
        id
        name
        avatar
        city
        state
        averageRating
      }
    }
  }
`;

const GET_RECENT_RATINGS = gql`
  query GetRecentRatings($entityId: ID!, $entityType: String!) {
    ratingsByEntity(entityId: $entityId, entityType: $entityType) {
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

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');

  // Get user info from localStorage
  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUserRole(currentUser.role);
      setUserId(currentUser.id);
      setUserName(`${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim() || 'User');
      
      // Redirect owners to their specific dashboard
      if (currentUser.role === Role.OWNER) {
        navigate('/owner/dashboard');
      }
      
      // Redirect barbers to their analytics dashboard
      if (currentUser.role === Role.BARBER) {
        navigate('/barber/analytics');
      }
    }
  }, [navigate]);

  // Queries
  const { data: generalData, loading: generalLoading, error: generalError } = useQuery(GET_DASHBOARD_DATA, {
    fetchPolicy: 'cache-and-network'
  });

  const { data: userBookingsData, loading: userBookingsLoading } = useQuery(GET_USER_BOOKINGS, {
    variables: { userId: userId || '' },
    skip: !userId || userRole !== Role.CUSTOMER,
    fetchPolicy: 'cache-and-network'
  });

  const { data: barberBookingsData, loading: barberBookingsLoading } = useQuery(GET_BARBER_BOOKINGS, {
    variables: { barberId: userId || '' },
    skip: !userId || userRole !== Role.BARBER,
    fetchPolicy: 'cache-and-network'
  });

  const { data: favoritesData, loading: favoritesLoading } = useQuery(GET_USER_FAVORITES, {
    variables: { userId: userId || '' },
    skip: !userId || userRole !== Role.CUSTOMER,
    fetchPolicy: 'cache-and-network'
  });

  if (!userId) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Please log in to access the dashboard
        </Typography>
        <Button variant="contained" onClick={() => navigate('/login')}>
          Login
        </Button>
      </Box>
    );
  }

  if (generalLoading) return <CircularProgress />;
  if (generalError) return <Alert severity="error">Error loading dashboard: {generalError.message}</Alert>;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getBookingStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING:
        return 'warning';
      case BookingStatus.CONFIRMED:
        return 'info';
      case BookingStatus.IN_PROGRESS:
        return 'primary';
      case BookingStatus.COMPLETED:
        return 'success';
      case BookingStatus.CANCELLED:
        return 'error';
      case BookingStatus.NO_SHOW:
        return 'secondary';
      default:
        return 'default';
    }
  };

  const getTimeDisplay = (dateTime: string) => {
    const date = parseISO(dateTime);
    if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
    if (isTomorrow(date)) return `Tomorrow at ${format(date, 'h:mm a')}`;
    return format(date, 'MMM dd, h:mm a');
  };

  const renderQuickStats = () => {
    const bookings = userRole === Role.CUSTOMER ? userBookingsData?.bookingsByUser : barberBookingsData?.bookingsByBarber;
    const completedBookings = bookings?.filter((b: any) => b.status === BookingStatus.COMPLETED) || [];
    const pendingBookings = bookings?.filter((b: any) => b.status === BookingStatus.PENDING) || [];
    const totalRevenue = completedBookings.reduce((sum: number, booking: any) => sum + booking.totalPrice, 0);

    return (
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Total Bookings
                  </Typography>
                  <Typography variant="h5">
                    {bookings?.length || 0}
                  </Typography>
                </Box>
                <CalendarToday color="primary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Completed
                  </Typography>
                  <Typography variant="h5">
                    {completedBookings.length}
                  </Typography>
                </Box>
                <Schedule color="success" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    Pending
                  </Typography>
                  <Typography variant="h5">
                    {pendingBookings.length}
                  </Typography>
                </Box>
                <Notifications color="warning" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2">
                    {userRole === Role.CUSTOMER ? 'Total Spent' : 'Total Earned'}
                  </Typography>
                  <Typography variant="h5">
                    ${totalRevenue.toFixed(2)}
                  </Typography>
                </Box>
                <AttachMoney color="secondary" />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const renderUpcomingBookings = () => {
    const upcomingBookings = userRole === Role.CUSTOMER ? userBookingsData?.upcomingBookings : barberBookingsData?.upcomingBookingsByBarber;
    
    if (!upcomingBookings || upcomingBookings.length === 0) {
      return (
        <Alert severity="info" sx={{ mb: 2 }}>
          {userRole === Role.CUSTOMER ? 'No upcoming bookings. Book your next appointment!' : 'No upcoming appointments.'}
        </Alert>
      );
    }

    return (
      <List>
        {upcomingBookings.slice(0, 5).map((booking: any) => (
          <ListItem key={booking.id} sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <ListItemAvatar>
              <Avatar 
                src={userRole === Role.CUSTOMER ? booking.barber.avatar : booking.user.avatar}
                sx={{ width: 40, height: 40 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2">
                    {userRole === Role.CUSTOMER 
                      ? `${booking.barber.firstName} ${booking.barber.lastName}`
                      : `${booking.user.firstName} ${booking.user.lastName}`
                    }
                  </Typography>
                  <Chip 
                    label={booking.status} 
                    size="small" 
                    color={getBookingStatusColor(booking.status)}
                  />
                </Box>
              }
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {booking.managementService.name} • ${booking.totalPrice}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {getTimeDisplay(booking.startTime)}
                  </Typography>
                  {userRole === Role.CUSTOMER && booking.barber.barberShops && booking.barber.barberShops.length > 0 && (
                    <Typography variant="caption" color="text.secondary">
                      at {booking.barber.barberShops[0].name}
                    </Typography>
                  )}
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderFavorites = () => {
    if (userRole !== Role.CUSTOMER || !favoritesData?.favorites || favoritesData.favorites.length === 0) {
      return (
        <Alert severity="info">
          No favorite barbershops yet. Start exploring and add your favorites!
        </Alert>
      );
    }

    return (
      <List>
        {favoritesData.favorites.slice(0, 5).map((favorite: any) => (
          <ListItem key={favorite.id} sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <ListItemAvatar>
              <Avatar 
                src={favorite.barberShop.avatar}
                sx={{ width: 40, height: 40 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={favorite.barberShop.name}
              secondary={
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {favorite.barberShop.city}, {favorite.barberShop.state}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <Rating value={favorite.barberShop.averageRating || 0} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary" ml={1}>
                      ({favorite.barberShop.totalRatings || 0} reviews)
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderTopBarbers = () => {
    const topBarbers = generalData?.barbers
      ?.filter((barber: any) => barber.averageRating > 0)
      ?.sort((a: any, b: any) => (b.averageRating || 0) - (a.averageRating || 0))
      ?.slice(0, 5) || [];

    return (
      <List>
        {topBarbers.map((barber: any) => (
          <ListItem key={barber.id} sx={{ mb: 1, border: 1, borderColor: 'divider', borderRadius: 1 }}>
            <ListItemAvatar>
              <Avatar 
                src={barber.avatar}
                sx={{ width: 40, height: 40 }}
              />
            </ListItemAvatar>
            <ListItemText
              primary={
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Typography variant="subtitle2">
                    {barber.firstName} {barber.lastName}
                  </Typography>
                  <Chip 
                    label={`${barber.experienceYears}y exp`} 
                    size="small" 
                    variant="outlined"
                  />
                </Box>
              }
              secondary={
                <Box>
                  {barber.barberShops && barber.barberShops.length > 0 && (
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {barber.barberShops[0].name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {barber.barberShops[0].city}, {barber.barberShops[0].state}
                      </Typography>
                    </>
                  )}
                  <Box display="flex" alignItems="center" mt={0.5}>
                    <Rating value={barber.averageRating || 0} readOnly size="small" />
                    <Typography variant="caption" color="text.secondary" ml={1}>
                      ({barber.totalRatings || 0} reviews)
                    </Typography>
                  </Box>
                </Box>
              }
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderQuickActions = () => {
    return (
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        {userRole === Role.CUSTOMER && (
          <>
            <Button
              variant="contained"
              startIcon={<BookOnline />}
              onClick={() => navigate('/barbershops')}
              size="large"
            >
              Book Appointment
            </Button>
            <Button
              variant="outlined"
              startIcon={<Store />}
              onClick={() => navigate('/barbershops')}
              size="large"
            >
              Find Barbershops
            </Button>
            <Button
              variant="outlined"
              startIcon={<Person />}
              onClick={() => navigate('/barbers')}
              size="large"
            >
              Browse Barbers
            </Button>
          </>
        )}
        
        {userRole === Role.BARBER && (
          <>
            <Button
              variant="contained"
              startIcon={<Schedule />}
              onClick={() => navigate('/bookings')}
              size="large"
            >
              My Schedule
            </Button>
            <Button
              variant="outlined"
              startIcon={<Assessment />}
              onClick={() => navigate('/analytics')}
              size="large"
            >
              Analytics
            </Button>
          </>
        )}
        
        <Button
          variant="outlined"
          startIcon={<CalendarToday />}
          onClick={() => navigate('/bookings')}
          size="large"
        >
          My Bookings
        </Button>
      </Stack>
    );
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {getGreeting()}, {userName}!
          </Typography>
          <Typography variant="h6" color="text.secondary">
            {userRole === Role.CUSTOMER ? 'Ready for your next appointment?' : 'Here\'s your schedule overview'}
          </Typography>
        </Box>
        <DashboardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>

      {renderQuickActions()}
      {renderQuickStats()}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Upcoming sx={{ mr: 1, verticalAlign: 'middle' }} />
                {userRole === Role.CUSTOMER ? 'Upcoming Appointments' : 'Today\'s Schedule'}
              </Typography>
              {renderUpcomingBookings()}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate('/bookings')}
                startIcon={<CalendarToday />}
              >
                View All
              </Button>
            </CardActions>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
                {userRole === Role.CUSTOMER ? 'My Favorites' : 'Top Rated Barbers'}
              </Typography>
              {userRole === Role.CUSTOMER ? renderFavorites() : renderTopBarbers()}
            </CardContent>
            <CardActions>
              <Button 
                size="small" 
                onClick={() => navigate(userRole === Role.CUSTOMER ? '/favorites' : '/barbers')}
                startIcon={userRole === Role.CUSTOMER ? <Star /> : <Person />}
              >
                {userRole === Role.CUSTOMER ? 'View Favorites' : 'View All Barbers'}
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {/* Floating Action Button */}
      {userRole === Role.CUSTOMER && (
        <Fab
          color="primary"
          aria-label="book appointment"
          sx={{ position: 'fixed', bottom: 16, right: 16 }}
          onClick={() => navigate('/barbershops')}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
};

export default Dashboard;