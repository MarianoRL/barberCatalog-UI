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
  Divider,
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
  Tabs,
  Tab,
  Paper,
  IconButton,
  Tooltip,
  Rating,
  Stack
} from '@mui/material';
import {
  CalendarToday,
  AccessTime,
  Person,
  Store,
  AttachMoney,
  Phone,
  Email,
  Edit,
  Cancel,
  CheckCircle,
  Schedule,
  Star,
  Info
} from '@mui/icons-material';
import { useQuery, useMutation, gql } from '@apollo/client';
import { format, parseISO, isAfter, isBefore, addDays } from 'date-fns';
import { Booking, BookingStatus, Role } from '../types';

// GraphQL Queries
const GET_BOOKINGS_BY_USER = gql`
  query GetBookingsByUser($userId: ID!) {
    bookingsByUser(userId: $userId) {
      id
      startTime
      endTime
      status
      totalPrice
      notes
      cancelReason
      createdAt
      updatedAt
      barber {
        id
        firstName
        lastName
        email
        phone
        avatar
        bio
        experienceYears
        specialties
      }
      barberShop {
        id
        name
        address
        city
        state
        phone
        email
        avatar
      }
      managementService {
        id
        name
        description
        price
        durationMinutes
        category {
          id
          name
          icon
        }
      }
    }
  }
`;

const GET_BOOKINGS_BY_BARBER = gql`
  query GetBookingsByBarber($barberId: ID!) {
    bookingsByBarber(barberId: $barberId) {
      id
      startTime
      endTime
      status
      totalPrice
      notes
      cancelReason
      createdAt
      updatedAt
      user {
        id
        firstName
        lastName
        email
        phone
        avatar
      }
      barberShop {
        id
        name
        address
        city
        state
        phone
        email
        avatar
      }
      managementService {
        id
        name
        description
        price
        durationMinutes
        category {
          id
          name
          icon
        }
      }
    }
  }
`;

const GET_UPCOMING_BOOKINGS = gql`
  query GetUpcomingBookings($userId: ID!) {
    upcomingBookings(userId: $userId) {
      id
      startTime
      endTime
      status
      totalPrice
      notes
      createdAt
      updatedAt
      barber {
        id
        firstName
        lastName
        email
        phone
        avatar
        bio
        experienceYears
        specialties
      }
      barberShop {
        id
        name
        address
        city
        state
        phone
        email
        avatar
      }
      managementService {
        id
        name
        description
        price
        durationMinutes
        category {
          id
          name
          icon
        }
      }
    }
  }
`;

const UPDATE_BOOKING_STATUS = gql`
  mutation UpdateBookingStatus($id: ID!, $status: BookingStatus!, $reason: String) {
    updateBookingStatus(id: $id, status: $status, reason: $reason) {
      id
      status
      cancelReason
      updatedAt
    }
  }
`;

const RESCHEDULE_BOOKING = gql`
  mutation RescheduleBooking($id: ID!, $newStartTime: String!) {
    rescheduleBooking(id: $id, newStartTime: $newStartTime) {
      id
      startTime
      endTime
      status
      updatedAt
    }
  }
`;

const Bookings: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<'cancel' | 'reschedule' | 'confirm' | 'start' | 'complete' | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rescheduleDateTime, setRescheduleDateTime] = useState('');
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

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
  const { data: userBookingsData, loading: userBookingsLoading, refetch: refetchUserBookings } = useQuery(
    GET_BOOKINGS_BY_USER,
    { 
      variables: { userId: userId || '' },
      skip: !userId || userRole !== Role.CUSTOMER
    }
  );

  const { data: barberBookingsData, loading: barberBookingsLoading, refetch: refetchBarberBookings } = useQuery(
    GET_BOOKINGS_BY_BARBER,
    { 
      variables: { barberId: userId || '' },
      skip: !userId || userRole !== Role.BARBER
    }
  );

  const { data: upcomingBookingsData, loading: upcomingBookingsLoading } = useQuery(
    GET_UPCOMING_BOOKINGS,
    { 
      variables: { userId: userId || '' },
      skip: !userId || userRole !== Role.CUSTOMER
    }
  );

  // Mutations
  const [updateBookingStatus] = useMutation(UPDATE_BOOKING_STATUS, {
    onCompleted: () => {
      setDialogOpen(false);
      setSelectedBooking(null);
      setActionType(null);
      setCancelReason('');
      if (userRole === Role.CUSTOMER) {
        refetchUserBookings();
      } else {
        refetchBarberBookings();
      }
    },
    onError: (error) => {
      console.error('Error updating booking status:', error);
    }
  });

  const [rescheduleBooking] = useMutation(RESCHEDULE_BOOKING, {
    onCompleted: () => {
      setDialogOpen(false);
      setSelectedBooking(null);
      setActionType(null);
      setRescheduleDateTime('');
      if (userRole === Role.CUSTOMER) {
        refetchUserBookings();
      } else {
        refetchBarberBookings();
      }
    },
    onError: (error) => {
      console.error('Error rescheduling booking:', error);
    }
  });

  const getStatusColor = (status: BookingStatus) => {
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

  const canCancelBooking = (booking: Booking) => {
    const now = new Date();
    const bookingTime = parseISO(booking.startTime);
    const timeDiff = bookingTime.getTime() - now.getTime();
    const hoursUntilBooking = timeDiff / (1000 * 60 * 60);
    
    return (
      (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) &&
      hoursUntilBooking > 24
    );
  };

  const canRescheduleBooking = (booking: Booking) => {
    const now = new Date();
    const bookingTime = parseISO(booking.startTime);
    const timeDiff = bookingTime.getTime() - now.getTime();
    const hoursUntilBooking = timeDiff / (1000 * 60 * 60);
    
    return (
      (booking.status === BookingStatus.PENDING || booking.status === BookingStatus.CONFIRMED) &&
      hoursUntilBooking > 24
    );
  };

  const handleAction = (booking: Booking, action: 'cancel' | 'reschedule' | 'confirm' | 'start' | 'complete') => {
    setSelectedBooking(booking);
    setActionType(action);
    setDialogOpen(true);
  };

  const handleConfirmAction = () => {
    if (!selectedBooking || !actionType) return;

    if (actionType === 'cancel') {
      updateBookingStatus({
        variables: {
          id: selectedBooking.id,
          status: BookingStatus.CANCELLED,
          reason: cancelReason
        }
      });
    } else if (actionType === 'reschedule') {
      rescheduleBooking({
        variables: {
          id: selectedBooking.id,
          newStartTime: rescheduleDateTime
        }
      });
    } else if (actionType === 'confirm') {
      updateBookingStatus({
        variables: {
          id: selectedBooking.id,
          status: BookingStatus.CONFIRMED
        }
      });
    } else if (actionType === 'start') {
      updateBookingStatus({
        variables: {
          id: selectedBooking.id,
          status: BookingStatus.IN_PROGRESS
        }
      });
    } else if (actionType === 'complete') {
      updateBookingStatus({
        variables: {
          id: selectedBooking.id,
          status: BookingStatus.COMPLETED
        }
      });
    }
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.id} sx={{ mb: 2 }}>
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Box display="flex" alignItems="center" mb={1}>
              <CalendarToday sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                {format(parseISO(booking.startTime), 'MMM dd, yyyy')}
              </Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <AccessTime sx={{ mr: 1, color: 'text.secondary' }} />
              <Typography variant="body2">
                {format(parseISO(booking.startTime), 'h:mm a')} - {format(parseISO(booking.endTime), 'h:mm a')}
              </Typography>
            </Box>
            <Chip
              label={booking.status}
              color={getStatusColor(booking.status)}
              size="small"
              sx={{ mt: 1 }}
            />
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Box display="flex" alignItems="center" mb={1}>
              <Avatar 
                src={userRole === Role.CUSTOMER ? booking.barber.avatar : booking.user?.avatar}
                sx={{ mr: 1, width: 32, height: 32 }}
              />
              <Box>
                <Typography variant="body2" fontWeight="bold">
                  {userRole === Role.CUSTOMER 
                    ? `${booking.barber.firstName} ${booking.barber.lastName}`
                    : `${booking.user?.firstName} ${booking.user?.lastName}`
                  }
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {userRole === Role.CUSTOMER ? 'Barber' : 'Customer'}
                </Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Store sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
              <Box>
                <Typography variant="caption" fontWeight="medium">
                  {booking.barberShop?.name || 'No shop assigned'}
                </Typography>
                {booking.barberShop?.city && booking.barberShop?.state && (
                  <Typography variant="caption" color="text.secondary" display="block">
                    {booking.barberShop.city}, {booking.barberShop.state}
                  </Typography>
                )}
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Typography variant="body2" fontWeight="bold" mb={1}>
              {booking.managementService.name}
            </Typography>
            <Typography variant="caption" color="text.secondary" mb={1}>
              {booking.managementService.category?.name}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <AttachMoney sx={{ mr: 1, color: 'text.secondary', fontSize: 16 }} />
              <Typography variant="body2">
                ${booking.totalPrice}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={2}>
            <Stack spacing={1}>
              {userRole === Role.BARBER && booking.status === BookingStatus.PENDING && (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAction(booking, 'confirm')}
                  startIcon={<CheckCircle />}
                >
                  Confirm
                </Button>
              )}
              {userRole === Role.BARBER && booking.status === BookingStatus.CONFIRMED && (
                <Button
                  size="small"
                  variant="outlined"
                  color="primary"
                  onClick={() => handleAction(booking, 'start')}
                  startIcon={<Schedule />}
                >
                  Start
                </Button>
              )}
              {userRole === Role.BARBER && booking.status === BookingStatus.IN_PROGRESS && (
                <Button
                  size="small"
                  variant="outlined"
                  color="success"
                  onClick={() => handleAction(booking, 'complete')}
                  startIcon={<CheckCircle />}
                >
                  Complete
                </Button>
              )}
              {canCancelBooking(booking) && (
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  onClick={() => handleAction(booking, 'cancel')}
                  startIcon={<Cancel />}
                >
                  Cancel
                </Button>
              )}
              {canRescheduleBooking(booking) && userRole === Role.CUSTOMER && (
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleAction(booking, 'reschedule')}
                  startIcon={<Edit />}
                >
                  Reschedule
                </Button>
              )}
            </Stack>
          </Grid>
        </Grid>
        
        {booking.notes && (
          <Box mt={2}>
            <Typography variant="caption" color="text.secondary">Notes:</Typography>
            <Typography variant="body2">{booking.notes}</Typography>
          </Box>
        )}
        
        {booking.cancelReason && (
          <Box mt={2}>
            <Typography variant="caption" color="error">Cancel Reason:</Typography>
            <Typography variant="body2" color="error">{booking.cancelReason}</Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  const renderContent = () => {
    if (userRole === Role.CUSTOMER) {
      if (activeTab === 0) {
        // All Bookings
        if (userBookingsLoading) return <CircularProgress />;
        const bookings = userBookingsData?.bookingsByUser || [];
        if (bookings.length === 0) {
          return (
            <Alert severity="info" sx={{ mt: 2 }}>
              You don't have any bookings yet. Book your first appointment!
            </Alert>
          );
        }
        return bookings.map(renderBookingCard);
      } else {
        // Upcoming Bookings
        if (upcomingBookingsLoading) return <CircularProgress />;
        const upcomingBookings = upcomingBookingsData?.upcomingBookings || [];
        if (upcomingBookings.length === 0) {
          return (
            <Alert severity="info" sx={{ mt: 2 }}>
              You don't have any upcoming bookings.
            </Alert>
          );
        }
        return upcomingBookings.map(renderBookingCard);
      }
    } else {
      // Barber view
      if (barberBookingsLoading) return <CircularProgress />;
      const bookings = barberBookingsData?.bookingsByBarber || [];
      if (bookings.length === 0) {
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            You don't have any bookings yet.
          </Alert>
        );
      }
      return bookings.map(renderBookingCard);
    }
  };

  return (
    <Box>
      <Typography variant="h2" component="h1" gutterBottom>
        {userRole === Role.CUSTOMER ? 'My Bookings' : 'My Appointments'}
      </Typography>
      
      {userRole === Role.CUSTOMER && (
        <Paper sx={{ mb: 3 }}>
          <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value)}>
            <Tab label="All Bookings" />
            <Tab label="Upcoming" />
          </Tabs>
        </Paper>
      )}
      
      {renderContent()}
      
      {/* Action Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {actionType === 'cancel' && 'Cancel Booking'}
          {actionType === 'reschedule' && 'Reschedule Booking'}
          {actionType === 'confirm' && 'Confirm Booking'}
          {actionType === 'start' && 'Start Appointment'}
          {actionType === 'complete' && 'Complete Appointment'}
        </DialogTitle>
        <DialogContent>
          {actionType === 'cancel' && (
            <TextField
              fullWidth
              label="Reason for cancellation"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              multiline
              rows={3}
              sx={{ mt: 2 }}
            />
          )}
          {actionType === 'reschedule' && (
            <TextField
              fullWidth
              label="New Date and Time"
              type="datetime-local"
              value={rescheduleDateTime}
              onChange={(e) => setRescheduleDateTime(e.target.value)}
              sx={{ mt: 2 }}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}
          {actionType === 'confirm' && (
            <Typography>
              Are you sure you want to confirm this booking?
            </Typography>
          )}
          {actionType === 'start' && (
            <Typography>
              Are you sure you want to start this appointment?
            </Typography>
          )}
          {actionType === 'complete' && (
            <Typography>
              Are you sure you want to mark this appointment as completed?
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmAction} variant="contained">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Bookings;