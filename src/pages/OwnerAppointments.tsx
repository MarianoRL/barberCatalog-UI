import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
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
  Chip,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Avatar,
  Collapse,
  Autocomplete
} from '@mui/material';
import {
  Search,
  FilterList,
  Clear,
  Visibility,
  Phone,
  Email,
  Event,
  AccessTime,
  AttachMoney,
  Person,
  Store,
  CalendarToday,
  ExpandMore,
  ExpandLess,
  Download,
  Refresh
} from '@mui/icons-material';
import { useQuery, gql } from '@apollo/client';
import { format, parseISO } from 'date-fns';
import { getCurrentUser } from '../utils/auth';

// GraphQL Queries
const GET_OWNER_APPOINTMENTS_WITH_FILTERS = gql`
  query GetOwnerAppointmentsWithFilters(
    $ownerId: ID!
    $barberShopId: ID
    $barberId: ID
    $status: BookingStatus
    $startDate: String
    $endDate: String
  ) {
    ownerAppointmentsWithFilters(
      ownerId: $ownerId
      barberShopId: $barberShopId
      barberId: $barberId
      status: $status
      startDate: $startDate
      endDate: $endDate
    ) {
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
      barber {
        id
        firstName
        lastName
        email
        phone
        avatar
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

const GET_OWNER_BARBERSHOPS = gql`
  query GetOwnerBarberShops($ownerId: ID!) {
    getOwnerBarberShops(ownerId: $ownerId) {
      id
      name
      address
      city
      state
      avatar
      barbers {
        id
        firstName
        lastName
        avatar
        experienceYears
        specialties
      }
    }
  }
`;

interface AppointmentFilters {
  barberShopId: string;
  barberId: string;
  status: string;
  startDate: string;
  endDate: string;
}

interface Appointment {
  id: string;
  startTime: string;
  endTime: string;
  status: string;
  totalPrice: number;
  notes?: string;
  cancelReason?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    avatar?: string;
  };
  barber: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string;
    experienceYears?: number;
    specialties?: string;
  };
  barberShop: {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    avatar?: string;
  };
  managementService: {
    id: string;
    name: string;
    price: number;
    durationMinutes: number;
    category: {
      name: string;
      icon?: string;
    };
  };
}

const OwnerAppointments: React.FC = () => {
  const currentUser = getCurrentUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filters, setFilters] = useState<AppointmentFilters>({
    barberShopId: '',
    barberId: '',
    status: '',
    startDate: '',
    endDate: ''
  });

  // Get user ID from current user
  const ownerId = currentUser?.id;

  // Queries
  const { data: appointmentsData, loading: appointmentsLoading, error: appointmentsError, refetch } = useQuery(
    GET_OWNER_APPOINTMENTS_WITH_FILTERS,
    {
      variables: {
        ownerId,
        barberShopId: filters.barberShopId || undefined,
        barberId: filters.barberId || undefined,
        status: filters.status || undefined,
        startDate: filters.startDate || undefined,
        endDate: filters.endDate || undefined
      },
      skip: !ownerId,
      fetchPolicy: 'cache-and-network'
    }
  );

  const { data: statsData, loading: statsLoading } = useQuery(GET_OWNER_APPOINTMENT_STATS, {
    variables: { ownerId },
    skip: !ownerId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: barberShopsData } = useQuery(GET_OWNER_BARBERSHOPS, {
    variables: { ownerId },
    skip: !ownerId,
    fetchPolicy: 'cache-and-network'
  });

  const appointments: Appointment[] = appointmentsData?.ownerAppointmentsWithFilters || [];
  const stats = statsData?.ownerAppointmentStats;
  const barberShops = barberShopsData?.getOwnerBarberShops || [];

  // Get all barbers from all shops
  const allBarbers = barberShops.flatMap((shop: any) => 
    shop.barbers.map((barber: any) => ({
      ...barber,
      shopName: shop.name
    }))
  );

  // Filter appointments by search term
  const filteredAppointments = appointments.filter((appointment) => {
    const searchString = `${appointment.user.firstName} ${appointment.user.lastName} ${appointment.barber.firstName} ${appointment.barber.lastName} ${appointment.barberShop.name} ${appointment.managementService.name}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  // Paginated appointments
  const paginatedAppointments = filteredAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleFilterChange = (key: keyof AppointmentFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(0); // Reset to first page when filters change
  };

  const clearFilters = () => {
    setFilters({
      barberShopId: '',
      barberId: '',
      status: '',
      startDate: '',
      endDate: ''
    });
    setSearchTerm('');
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'info';
      case 'IN_PROGRESS': return 'primary';
      case 'COMPLETED': return 'success';
      case 'CANCELLED': return 'error';
      case 'NO_SHOW': return 'error';
      default: return 'default';
    }
  };

  const formatDateTime = (dateTimeString: string) => {
    return format(parseISO(dateTimeString), 'MMM dd, yyyy • h:mm a');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailsOpen(true);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.barberShopId) count++;
    if (filters.barberId) count++;
    if (filters.status) count++;
    if (filters.startDate) count++;
    if (filters.endDate) count++;
    return count;
  };

  if (!ownerId) {
    return (
      <Alert severity="error">
        You must be logged in as an owner to view this page.
      </Alert>
    );
  }

  if (appointmentsLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (appointmentsError) {
    return (
      <Alert severity="error">
        Error loading appointments: {appointmentsError.message}
      </Alert>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h2" component="h1">
          Appointment Management
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => refetch()}
        >
          Refresh
        </Button>
      </Box>

      {/* Stats Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <Event color="primary" sx={{ mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4">{stats.totalAppointments}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Appointments</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoney color="success" sx={{ mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4">{formatCurrency(stats.totalRevenue)}</Typography>
                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <CalendarToday color="info" sx={{ mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4">{stats.completedAppointments}</Typography>
                    <Typography variant="body2" color="text.secondary">Completed</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center">
                  <AttachMoney color="primary" sx={{ mr: 2, fontSize: 32 }} />
                  <Box>
                    <Typography variant="h4">{formatCurrency(stats.averageAppointmentValue)}</Typography>
                    <Typography variant="body2" color="text.secondary">Avg. Value</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
          <Button
            variant="outlined"
            startIcon={<Clear />}
            onClick={clearFilters}
          >
            Clear
          </Button>
        </Box>

        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Barber Shop</InputLabel>
                <Select
                  value={filters.barberShopId}
                  label="Barber Shop"
                  onChange={(e) => handleFilterChange('barberShopId', e.target.value)}
                >
                  <MenuItem value="">All Shops</MenuItem>
                  {barberShops.map((shop: any) => (
                    <MenuItem key={shop.id} value={shop.id}>
                      {shop.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Barber</InputLabel>
                <Select
                  value={filters.barberId}
                  label="Barber"
                  onChange={(e) => handleFilterChange('barberId', e.target.value)}
                >
                  <MenuItem value="">All Barbers</MenuItem>
                  {allBarbers.map((barber: any) => (
                    <MenuItem key={barber.id} value={barber.id}>
                      {barber.firstName} {barber.lastName} ({barber.shopName})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.status}
                  label="Status"
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  <MenuItem value="PENDING">Pending</MenuItem>
                  <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                  <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                  <MenuItem value="COMPLETED">Completed</MenuItem>
                  <MenuItem value="CANCELLED">Cancelled</MenuItem>
                  <MenuItem value="NO_SHOW">No Show</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="Start Date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange('startDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <TextField
                fullWidth
                type="date"
                label="End Date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange('endDate', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* Appointments Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Appointments ({filteredAppointments.length})
            </Typography>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Customer</TableCell>
                  <TableCell>Barber</TableCell>
                  <TableCell>Shop</TableCell>
                  <TableCell>Service</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedAppointments.map((appointment) => (
                  <TableRow key={appointment.id} hover>
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar src={appointment.user.avatar} sx={{ mr: 2 }}>
                          {appointment.user.firstName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
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
                        <Avatar src={appointment.barber.avatar} sx={{ mr: 2 }}>
                          {appointment.barber.firstName[0]}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {appointment.barber.firstName} {appointment.barber.lastName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {appointment.barber.experienceYears} years exp.
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{appointment.barberShop.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.barberShop.city}, {appointment.barberShop.state}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{appointment.managementService.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {appointment.managementService.durationMinutes} min
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {formatDateTime(appointment.startTime)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={appointment.status}
                        color={getStatusColor(appointment.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(appointment.totalPrice)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      {selectedAppointment && (
        <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    <Person sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Customer Information
                  </Typography>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar src={selectedAppointment.user.avatar} sx={{ mr: 2, width: 56, height: 56 }}>
                      {selectedAppointment.user.firstName[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">
                        {selectedAppointment.user.firstName} {selectedAppointment.user.lastName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAppointment.user.email}
                      </Typography>
                    </Box>
                  </Box>
                  {selectedAppointment.user.phone && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Phone sx={{ mr: 1, fontSize: 18 }} />
                      <Typography variant="body2">{selectedAppointment.user.phone}</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    <Store sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Service Details
                  </Typography>
                  <Typography variant="body1" fontWeight="bold" gutterBottom>
                    {selectedAppointment.managementService.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {selectedAppointment.managementService.category.name}
                  </Typography>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Duration:</Typography>
                    <Typography variant="body2">{selectedAppointment.managementService.durationMinutes} minutes</Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Price:</Typography>
                    <Typography variant="body2" fontWeight="bold">
                      {formatCurrency(selectedAppointment.managementService.price)}
                    </Typography>
                  </Box>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">Status:</Typography>
                    <Chip
                      label={selectedAppointment.status}
                      color={getStatusColor(selectedAppointment.status) as any}
                      size="small"
                    />
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    <AccessTime sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Schedule & Location
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Date & Time:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {formatDateTime(selectedAppointment.startTime)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">Barber:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedAppointment.barber.firstName} {selectedAppointment.barber.lastName}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="body2" color="text.secondary">Location:</Typography>
                      <Typography variant="body1" gutterBottom>
                        {selectedAppointment.barberShop.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAppointment.barberShop.address}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {selectedAppointment.barberShop.city}, {selectedAppointment.barberShop.state}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  {selectedAppointment.notes && (
                    <Box mt={2}>
                      <Typography variant="body2" color="text.secondary">Notes:</Typography>
                      <Typography variant="body1">{selectedAppointment.notes}</Typography>
                    </Box>
                  )}
                  
                  {selectedAppointment.cancelReason && (
                    <Box mt={2}>
                      <Typography variant="body2" color="error">Cancel Reason:</Typography>
                      <Typography variant="body1" color="error">{selectedAppointment.cancelReason}</Typography>
                    </Box>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDetailsOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default OwnerAppointments;