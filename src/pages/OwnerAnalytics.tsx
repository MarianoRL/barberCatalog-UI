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
  TablePagination,
  Fab,
  Zoom,
  useTheme,
  alpha,
  Collapse,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
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
  Group,
  Store,
  MonetizationOn,
  AccountBalance,
  Receipt,
  Business,
  Analytics,
  InsertChart,
  TrendingDown,
  ExpandMore,
  ExpandLess,
  FilterList,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, startOfWeek, endOfWeek, startOfMonth, endOfMonth, subDays, subMonths } from 'date-fns';
import { Role, BookingStatus } from '../types';

// GraphQL Queries
const GET_OWNER_BARBER_SHOPS = gql`
  query GetOwnerBarberShops($ownerId: ID!) {
    getOwnerBarberShops(ownerId: $ownerId) {
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
    }
  }
`;

const GET_OWNER_APPOINTMENTS = gql`
  query GetOwnerAppointments($ownerId: ID!) {
    ownerAppointments(ownerId: $ownerId) {
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
      barber {
        id
        firstName
        lastName
        avatar
        email
      }
      barberShop {
        id
        name
        city
        state
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

const GET_OWNER_APPOINTMENT_STATS = gql`
  query GetOwnerAppointmentStats($ownerId: ID!) {
    ownerAppointmentStats(ownerId: $ownerId) {
      totalAppointments
      pendingAppointments
      confirmedAppointments
      completedAppointments
      cancelledAppointments
      noShowAppointments
      totalRevenue
      averageAppointmentValue
    }
  }
`;

const GET_SHOP_BARBERS = gql`
  query GetShopBarbers($ownerId: ID!, $barberShopId: ID!) {
    getShopBarbers(ownerId: $ownerId, barberShopId: $barberShopId) {
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
    }
  }
`;

interface TimeRange {
  label: string;
  value: string;
  startDate: Date;
  endDate: Date;
}

interface BarberShop {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  avatar?: string;
  coverPhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  averageRating?: number;
  totalRatings?: number;
  favoriteCount?: number;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  barber: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    email: string;
  };
  barberShop: {
    id: string;
    name: string;
    city: string;
    state: string;
  };
  managementService: {
    id: string;
    name: string;
    description?: string;
    price: number;
    durationMinutes: number;
    category: {
      name: string;
      icon?: string;
    };
  };
}

interface AppointmentStats {
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  noShowAppointments: number;
  totalRevenue: number;
  averageAppointmentValue: number;
}

interface Barber {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  experienceYears?: number;
  specialties?: string;
  isActive: boolean;
  averageRating?: number;
  totalRatings?: number;
}

const OwnerAnalytics: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('thisMonth');
  const [selectedShop, setSelectedShop] = useState<string>('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedShop, setExpandedShop] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [customDateOpen, setCustomDateOpen] = useState(false);

  // Get owner info from localStorage
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.role === Role.OWNER) {
          setOwnerId(payload.userId);
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
    },
    {
      label: 'Custom Range',
      value: 'custom',
      startDate: new Date(),
      endDate: new Date()
    }
  ];

  // Queries
  const { data: shopsData, loading: shopsLoading, error: shopsError, refetch: refetchShops } = useQuery(GET_OWNER_BARBER_SHOPS, {
    variables: { ownerId: ownerId || '' },
    skip: !ownerId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: appointmentsData, loading: appointmentsLoading, refetch: refetchAppointments } = useQuery(GET_OWNER_APPOINTMENTS, {
    variables: { ownerId: ownerId || '' },
    skip: !ownerId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: statsData, loading: statsLoading, refetch: refetchStats } = useQuery(GET_OWNER_APPOINTMENT_STATS, {
    variables: { ownerId: ownerId || '' },
    skip: !ownerId,
    fetchPolicy: 'cache-and-network'
  });

  if (!ownerId) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You must be an owner to access this page.
        </Typography>
      </Box>
    );
  }

  if (shopsLoading || appointmentsLoading || statsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (shopsError) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        Error loading data: {shopsError.message}
      </Alert>
    );
  }

  const shops: BarberShop[] = shopsData?.getOwnerBarberShops || [];
  const appointments: Appointment[] = appointmentsData?.ownerAppointments || [];
  const stats: AppointmentStats = statsData?.ownerAppointmentStats || {};

  // Filter appointments by selected time range
  const selectedRange = timeRanges.find(range => range.value === selectedTimeRange);
  const filteredAppointments = selectedTimeRange === 'custom' && startDate && endDate
    ? appointments.filter((appointment) => {
        const appointmentDate = parseISO(appointment.startTime);
        return appointmentDate >= startDate && appointmentDate <= endDate;
      })
    : appointments.filter((appointment) => {
        const appointmentDate = parseISO(appointment.startTime);
        return selectedRange && appointmentDate >= selectedRange.startDate && appointmentDate <= selectedRange.endDate;
      });

  // Filter by selected shop
  const finalFilteredAppointments = selectedShop === 'all' 
    ? filteredAppointments 
    : filteredAppointments.filter(app => app.barberShop.id === selectedShop);

  // Calculate analytics for the filtered period
  const completedAppointments = finalFilteredAppointments.filter((a) => a.status === BookingStatus.COMPLETED);
  const cancelledAppointments = finalFilteredAppointments.filter((a) => a.status === BookingStatus.CANCELLED);
  const pendingAppointments = finalFilteredAppointments.filter((a) => a.status === BookingStatus.PENDING);
  const totalRevenue = completedAppointments.reduce((sum, appointment) => sum + appointment.totalPrice, 0);
  const averageAppointmentPrice = completedAppointments.length > 0 ? totalRevenue / completedAppointments.length : 0;

  // Service popularity
  const serviceStats = completedAppointments.reduce((acc: any, appointment) => {
    const serviceName = appointment.managementService.name;
    if (!acc[serviceName]) {
      acc[serviceName] = { count: 0, revenue: 0 };
    }
    acc[serviceName].count++;
    acc[serviceName].revenue += appointment.totalPrice;
    return acc;
  }, {});

  const topServices = Object.entries(serviceStats)
    .map(([name, stats]: [string, any]) => ({ name, ...stats }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // Shop-specific analytics
  const shopAnalytics = shops.map(shop => {
    const shopAppointments = finalFilteredAppointments.filter(app => app.barberShop.id === shop.id);
    const shopCompleted = shopAppointments.filter(app => app.status === BookingStatus.COMPLETED);
    const shopRevenue = shopCompleted.reduce((sum, app) => sum + app.totalPrice, 0);
    const shopCancelled = shopAppointments.filter(app => app.status === BookingStatus.CANCELLED);
    const shopPending = shopAppointments.filter(app => app.status === BookingStatus.PENDING);

    return {
      ...shop,
      appointments: shopAppointments.length,
      completed: shopCompleted.length,
      cancelled: shopCancelled.length,
      pending: shopPending.length,
      revenue: shopRevenue,
      averagePrice: shopCompleted.length > 0 ? shopRevenue / shopCompleted.length : 0,
      successRate: shopAppointments.length > 0 ? (shopCompleted.length / shopAppointments.length) * 100 : 0
    };
  });

  const handleRefresh = () => {
    refetchShops();
    refetchAppointments();
    refetchStats();
  };

  const handleCustomDateRange = () => {
    if (startDate && endDate) {
      setCustomDateOpen(false);
    }
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
        <Card sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          color: 'white',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ zIndex: 1 }}>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Total Appointments
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {finalFilteredAppointments.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {selectedRange?.label || 'Custom Range'}
                </Typography>
              </Box>
              <CalendarToday sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', 
          color: 'white',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ zIndex: 1 }}>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Completed
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {completedAppointments.length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  {finalFilteredAppointments.length > 0 ? ((completedAppointments.length / finalFilteredAppointments.length) * 100).toFixed(1) : 0}% success rate
                </Typography>
              </Box>
              <CheckCircle sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', 
          color: 'white',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ zIndex: 1 }}>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Revenue
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  ${totalRevenue.toFixed(2)}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Avg: ${averageAppointmentPrice.toFixed(2)}
                </Typography>
              </Box>
              <AttachMoney sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} sm={6} md={3}>
        <Card sx={{ 
          background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', 
          color: 'white',
          height: '100%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: -50,
            right: -50,
            width: 100,
            height: 100,
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
          }
        }}>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between">
              <Box sx={{ zIndex: 1 }}>
                <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                  Active Shops
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {shops.filter(s => s.isActive).length}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.8 }}>
                  Total: {shops.length}
                </Typography>
              </Box>
              <Store sx={{ fontSize: 50, opacity: 0.3 }} />
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );

  const renderShopAnalytics = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <BarChart sx={{ mr: 1, verticalAlign: 'middle' }} />
          Shop Performance Analytics ({selectedRange?.label || 'Custom Range'})
        </Typography>
        
        <Grid container spacing={3}>
          {shopAnalytics.map((shop) => (
            <Grid item xs={12} md={6} key={shop.id}>
              <Paper 
                sx={{ 
                  p: 3, 
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.shadows[8]
                  }
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <Store />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" fontWeight="bold">
                        {shop.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {shop.city}, {shop.state}
                      </Typography>
                    </Box>
                  </Box>
                  <Chip 
                    label={shop.isActive ? 'Active' : 'Inactive'}
                    color={shop.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Appointments
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {shop.appointments}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="success.main">
                      {shop.completed}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Revenue
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" color="info.main">
                      ${shop.revenue.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Success Rate
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      {shop.successRate.toFixed(1)}%
                    </Typography>
                  </Grid>
                </Grid>
                
                <Box mt={2}>
                  <LinearProgress 
                    variant="determinate" 
                    value={shop.successRate} 
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>
                
                {shop.averageRating && (
                  <Box display="flex" alignItems="center" mt={2}>
                    <Star sx={{ color: 'gold', mr: 0.5, fontSize: 16 }} />
                    <Typography variant="body2">
                      {shop.averageRating.toFixed(1)} ({shop.totalRatings || 0} reviews)
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  const renderTopServices = () => (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          <PieChart sx={{ mr: 1, verticalAlign: 'middle' }} />
          Top Services ({selectedRange?.label || 'Custom Range'})
        </Typography>
        
        <Stack spacing={2}>
          {topServices.map((service: any, index: number) => (
            <Paper key={service.name} sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
                <Typography variant="subtitle1" fontWeight="bold">
                  #{index + 1} {service.name}
                </Typography>
                <Chip 
                  label={`${service.count} bookings`} 
                  size="small" 
                  color="primary"
                  variant="outlined"
                />
              </Box>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Revenue: ${service.revenue.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Avg: ${(service.revenue / service.count).toFixed(2)}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={completedAppointments.length > 0 ? (service.count / completedAppointments.length) * 100 : 0} 
                sx={{ mt: 1, height: 6, borderRadius: 3 }}
              />
            </Paper>
          ))}
        </Stack>
        
        {topServices.length === 0 && (
          <Alert severity="info">
            No completed services in the selected time period.
          </Alert>
        )}
      </CardContent>
    </Card>
  );

  const renderAppointmentsTable = () => (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
          <Typography variant="h6">
            <Timeline sx={{ mr: 1, verticalAlign: 'middle' }} />
            Recent Appointments
          </Typography>
          <Box display="flex" gap={1}>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Time Range</InputLabel>
              <Select
                value={selectedTimeRange}
                onChange={(e) => {
                  setSelectedTimeRange(e.target.value);
                  if (e.target.value === 'custom') {
                    setCustomDateOpen(true);
                  }
                }}
                label="Time Range"
              >
                {timeRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Shop</InputLabel>
              <Select
                value={selectedShop}
                onChange={(e) => setSelectedShop(e.target.value)}
                label="Shop"
              >
                <MenuItem value="all">All Shops</MenuItem>
                {shops.map((shop) => (
                  <MenuItem key={shop.id} value={shop.id}>
                    {shop.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button
              variant="outlined"
              startIcon={<Refresh />}
              onClick={handleRefresh}
              size="small"
            >
              Refresh
            </Button>
          </Box>
        </Box>
        
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Client</TableCell>
                <TableCell>Barber</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Shop</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {finalFilteredAppointments
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((appointment) => (
                  <TableRow 
                    key={appointment.id}
                    sx={{ 
                      '&:hover': { 
                        backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        cursor: 'pointer'
                      }
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={appointment.user.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {appointment.user.firstName} {appointment.user.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={appointment.barber.avatar} sx={{ mr: 2, width: 32, height: 32 }} />
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {appointment.barber.firstName} {appointment.barber.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.barber.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {appointment.managementService.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appointment.managementService.durationMinutes} min
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {appointment.barberShop.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {appointment.barberShop.city}, {appointment.barberShop.state}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(parseISO(appointment.startTime), 'MMM dd, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(parseISO(appointment.startTime), 'h:mm a')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(appointment.status)}
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium" color="success.main">
                        ${appointment.totalPrice.toFixed(2)}
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
          count={finalFilteredAppointments.length}
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
            Comprehensive analytics across all your barber shops
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={2}>
          <Zoom in timeout={1000}>
            <Fab 
              color="primary" 
              size="medium"
              onClick={() => window.print()}
              sx={{ boxShadow: 6 }}
            >
              <Download />
            </Fab>
          </Zoom>
          <DashboardIcon sx={{ fontSize: 48, color: 'primary.main' }} />
        </Box>
      </Box>

      {renderQuickStats()}
      {renderShopAnalytics()}
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={8}>
          {renderTopServices()}
        </Grid>
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                <Business sx={{ mr: 1, verticalAlign: 'middle' }} />
                Overall Statistics
              </Typography>
              
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Total Revenue (All Time)
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    ${stats.totalRevenue?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Average Appointment Value
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    ${stats.averageAppointmentValue?.toFixed(2) || '0.00'}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Total Appointments
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {stats.totalAppointments || 0}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="body2" color="text.secondary">
                    Success Rate
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" color="success.main">
                    {stats.totalAppointments > 0 ? ((stats.completedAppointments / stats.totalAppointments) * 100).toFixed(1) : 0}%
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {renderAppointmentsTable()}

      {/* Custom Date Range Dialog */}
      <Dialog open={customDateOpen} onClose={() => setCustomDateOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent>
          <Box display="flex" gap={2} mt={2}>
            <TextField
              label="Start Date"
              type="date"
              value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : null)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
              onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : null)}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomDateOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomDateRange} variant="contained" disabled={!startDate || !endDate}>
            Apply
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerAnalytics;