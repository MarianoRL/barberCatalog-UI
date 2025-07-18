import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Paper,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Divider,
  Stack,
  Rating,
  IconButton,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import {
  TrendingUp,
  AttachMoney,
  Schedule,
  Star,
  Person,
  CalendarToday,
  Assessment,
  BusinessCenter,
  Timeline,
  ShowChart,
  BarChart,
  PieChart,
  Refresh,
  Download,
  DateRange,
  Today,
  CheckCircle,
  Cancel,
  AccessTime,
  Group
} from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';
import { Role, BookingStatus } from '../types';

// GraphQL Queries
const GET_BARBER_STATS = gql`
  query GetBarberStats($barberId: ID!) {
    barberStats(barberId: $barberId) {
      totalBookings
      completedBookings
      averageRating
      totalRatings
      totalManagementServices
    }
  }
`;

const GET_BARBER_BOOKINGS = gql`
  query GetBarberBookings($barberId: ID!) {
    bookingsByBarber(barberId: $barberId) {
      id
      startTime
      endTime
      status
      totalPrice
      notes
      createdAt
      user {
        id
        firstName
        lastName
        avatar
        email
      }
      managementService {
        id
        name
        description
        price
        durationMinutes
        category {
          name
          icon
        }
      }
    }
  }
`;

const GET_BARBER_PROFILE = gql`
  query GetBarberProfile($id: ID!) {
    barber(id: $id) {
      id
      firstName
      lastName
      email
      phone
      avatar
      bio
      experienceYears
      specialties
      isActive
      averageRating
      totalRatings
      barberShops {
        id
        name
        address
        city
        state
      }
      services {
        id
        name
        description
        price
        durationMinutes
        isActive
        category {
          name
          icon
        }
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
      rater {
        id
        firstName
        lastName
        avatar
      }
      booking {
        id
        managementService {
          name
        }
      }
    }
  }
`;

interface TimeRange {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

const BarberAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [barberId, setBarberId] = useState<string | null>(null);
  const [barberName, setBarberName] = useState<string>('');
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Get barber info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === Role.BARBER) {
          setBarberId(payload.userId);
          setBarberName(`${payload.firstName || ''} ${payload.lastName || ''}`.trim());
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error parsing token:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const timeRanges: TimeRange[] = [
    {
      label: 'Today',
      value: 'today',
      startDate: new Date(),
      endDate: new Date()
    },
    {
      label: 'This Week',
      value: 'thisWeek',
      startDate: startOfWeek(new Date()),
      endDate: endOfWeek(new Date())
    },
    {
      label: 'This Month',
      value: 'thisMonth',
      startDate: startOfMonth(new Date()),
      endDate: endOfMonth(new Date())
    },
    {
      label: 'Last 30 Days',
      value: 'last30Days',
      startDate: subDays(new Date(), 30),
      endDate: new Date()
    },
    {
      label: 'Last 3 Months',
      value: 'last3Months',
      startDate: subMonths(new Date(), 3),
      endDate: new Date()
    }
  ];

  // Queries
  const { data: statsData, loading: statsLoading, error: statsError, refetch: refetchStats } = useQuery(GET_BARBER_STATS, {
    variables: { barberId: barberId || '' },
    skip: !barberId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: bookingsData, loading: bookingsLoading, refetch: refetchBookings } = useQuery(GET_BARBER_BOOKINGS, {
    variables: { barberId: barberId || '' },
    skip: !barberId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: profileData, loading: profileLoading } = useQuery(GET_BARBER_PROFILE, {
    variables: { id: barberId || '' },
    skip: !barberId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: ratingsData, loading: ratingsLoading } = useQuery(GET_BARBER_RATINGS, {
    variables: { entityId: barberId || '' },
    skip: !barberId,
    fetchPolicy: 'cache-and-network'
  });

  if (!barberId) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You must be a barber to access this page.
        </Typography>
      </Box>
    );
  }

  if (statsLoading || profileLoading) return <CircularProgress />;
  if (statsError) return <Alert severity="error">Error loading analytics: {statsError.message}</Alert>;

  const stats = statsData?.barberStats;
  const bookings = bookingsData?.bookingsByBarber || [];
  const profile = profileData?.barber;
  const ratings = ratingsData?.ratingsByEntity || [];

  // Filter bookings by selected time range
  const selectedRange = timeRanges.find(range => range.value === selectedTimeRange);
  const filteredBookings = bookings.filter((booking: any) => {
    const bookingDate = parseISO(booking.startTime);
    return selectedRange && bookingDate >= selectedRange.startDate && bookingDate <= selectedRange.endDate;
  });

  // Calculate analytics for the filtered period
  const completedBookings = filteredBookings.filter((b: any) => b.status === BookingStatus.COMPLETED);
  const cancelledBookings = filteredBookings.filter((b: any) => b.status === BookingStatus.CANCELLED);
  const totalRevenue = completedBookings.reduce((sum: number, booking: any) => sum + booking.totalPrice, 0);
  const averageServicePrice = completedBookings.length > 0 ? totalRevenue / completedBookings.length : 0;

  // Service popularity
  const serviceStats = completedBookings.reduce((acc: any, booking: any) => {
    const serviceName = booking.managementService.name;
    if (!acc[serviceName]) {
      acc[serviceName] = { count: 0, revenue: 0 };
    }
    acc[serviceName].count++;
    acc[serviceName].revenue += booking.totalPrice;
    return acc;
  }, {});

  const topServices = Object.entries(serviceStats)
    .map(([name, stats]: [string, any]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const handleRefresh = () => {
    refetchStats();
    refetchBookings();
  };

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.PENDING: return 'warning';
      case BookingStatus.CONFIRMED: return 'info';
      case BookingStatus.IN_PROGRESS: return 'primary';
      case BookingStatus.COMPLETED: return 'success';
      case BookingStatus.CANCELLED: return 'error';
      case BookingStatus.NO_SHOW: return 'default';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.COMPLETED: return <CheckCircle />;
      case BookingStatus.CANCELLED: return <Cancel />;
      case BookingStatus.IN_PROGRESS: return <AccessTime />;
      default: return <Schedule />;
    }
  };

  const renderQuickStats = () => (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Total Bookings
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {filteredBookings.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {selectedRange?.label}
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Completed
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {completedBookings.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {filteredBookings.length > 0 ? ((completedBookings.length / filteredBookings.length) * 100).toFixed(1) : 0}% success rate
                </Typography>
              </Box>
              <CheckCircle sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Revenue
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ${totalRevenue.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Avg: ${averageServicePrice.toFixed(2)}
                </Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Rating
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {profile?.averageRating ? profile.averageRating.toFixed(1) : 'N/A'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {profile?.totalRatings || 0} reviews
                </Typography>
              </Box>
              <Star sx={{ fontSize: 40, opacity: 0.8 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderTopServices = () => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            <BarChart sx={{ mr: 1, verticalAlign: 'middle' }} />
            Top Services ({selectedRange?.label})
          </Typography>
        </Box>
        
        <List>
          {topServices.map((service: any, index: number) => (
            <ListItem key={service.name} sx={{ px: 0 }}>
              <ListItemText
                primary={
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="body1" fontWeight="medium">
                      #{index + 1} {service.name}
                    </Typography>
                    <Chip 
                      label={`${service.count} bookings`} 
                      size="small" 
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                }
                secondary={
                  <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={1}>
                      <Typography variant="body2" color="text.secondary">
                        Revenue: ${service.revenue.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Avg: ${(service.revenue / service.count).toFixed(2)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(service.count / completedBookings.length) * 100} 
                      sx={{ mt: 1, height: 6, borderRadius: 3 }}
                    />
                  </Box>
                }
              />
            </ListItem>
          ))}
        </List>
        
        {topServices.length === 0 && (
          <Alert severity="info">
            No completed services in the selected time period.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderRecentRatings = () => (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <Star sx={{ mr: 1, verticalAlign: 'middle' }} />
          Recent Reviews
        </Typography>
        
        <Stack spacing={2}>
          {ratings.slice(0, 5).map((rating: any) => (
            <Paper key={rating.id} sx={{ p: 2 }}>
              <Box display="flex" alignItems="center" mb={1}>
                <Avatar src={rating.rater?.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight="medium">
                    {rating.rater?.firstName} {rating.rater?.lastName}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(parseISO(rating.createdAt), 'MMM dd, yyyy')} • {rating.booking?.managementService?.name}
                  </Typography>
                </Box>
                <Rating value={rating.rating} readOnly size="small" />
              </Box>
              {rating.comment && (
                <Typography variant="body2" color="text.secondary">
                  "{rating.comment}"
                </Typography>
              )}
            </Paper>
          ))}
        </Stack>
        
        {ratings.length === 0 && (
          <Alert severity="info">No reviews yet.</Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderBookingsTable = () => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Bookings
          </Typography>
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={handleRefresh}
            size="small"
          >
            Refresh
          </Button>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBookings
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((booking: any) => (
                  <TableRow key={booking.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={booking.user.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {booking.user.firstName} {booking.user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {booking.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {booking.managementService.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {booking.managementService.durationMinutes} min
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(parseISO(booking.startTime), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(parseISO(booking.startTime), 'h:mm a')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(booking.status)}
                        label={booking.status}
                        color={getStatusColor(booking.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        ${booking.totalPrice.toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBookings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {barberName}! Here's your performance overview.
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              label="Time Range"
            >
              {timeRanges.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Assessment sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
      </Box>

      {renderQuickStats()}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Stack spacing={3}>
            {renderTopServices()}
            {renderBookingsTable()}
          </Stack>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          {renderRecentRatings()}
        </Grid>
      </Grid>
    </Box>
  );
};

export default BarberAnalytics;