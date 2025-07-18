import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Avatar,
  Chip,
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Fab,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemIcon
} from '@mui/material';
import {
  Store,
  Person,
  Edit,
  Delete,
  Add,
  PersonAdd,
  PersonRemove,
  Settings,
  Business,
  Group,
  Assignment,
  LocationOn,
  Phone,
  Email,
  Star,
  Visibility,
  Save,
  Cancel,
  AttachMoney
} from '@mui/icons-material';
import { useQuery, useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';

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

const GET_AVAILABLE_BARBERS = gql`
  query GetAvailableBarbers($ownerId: ID!, $barberShopId: ID!) {
    getAvailableBarbers(ownerId: $ownerId, barberShopId: $barberShopId) {
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

// GraphQL Mutations
const UPDATE_BARBER_SHOP = gql`
  mutation UpdateOwnedBarberShop(
    $ownerId: ID!
    $barberShopId: ID!
    $name: String
    $description: String
    $address: String
    $city: String
    $state: String
    $country: String
    $zipCode: String
    $phone: String
    $email: String
    $website: String
  ) {
    updateOwnedBarberShop(
      ownerId: $ownerId
      barberShopId: $barberShopId
      name: $name
      description: $description
      address: $address
      city: $city
      state: $state
      country: $country
      zipCode: $zipCode
      phone: $phone
      email: $email
      website: $website
    ) {
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
      updatedAt
    }
  }
`;

const ASSIGN_BARBER_TO_SHOP = gql`
  mutation AssignBarberToShop($ownerId: ID!, $barberId: ID!, $barberShopId: ID!) {
    assignBarberToShop(ownerId: $ownerId, barberId: $barberId, barberShopId: $barberShopId)
  }
`;

const UNASSIGN_BARBER_FROM_SHOP = gql`
  mutation UnassignBarberFromShop($ownerId: ID!, $barberId: ID!, $barberShopId: ID!) {
    unassignBarberFromShop(ownerId: $ownerId, barberId: $barberId, barberShopId: $barberShopId)
  }
`;

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

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<BarberShop | null>(null);
  const [editShopOpen, setEditShopOpen] = useState(false);
  const [manageBarbersOpen, setManageBarbersOpen] = useState(false);
  const [assignBarberOpen, setAssignBarberOpen] = useState(false);
  const [editShopForm, setEditShopForm] = useState<Partial<BarberShop>>({});

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

  // Queries
  const { data: shopsData, loading: shopsLoading, error: shopsError, refetch: refetchShops } = useQuery(GET_OWNER_BARBER_SHOPS, {
    variables: { ownerId: ownerId || '' },
    skip: !ownerId,
    fetchPolicy: 'cache-and-network'
  });

  const { data: shopBarbersData, loading: shopBarbersLoading, refetch: refetchShopBarbers } = useQuery(GET_SHOP_BARBERS, {
    variables: { ownerId: ownerId || '', barberShopId: selectedShop?.id || '' },
    skip: !ownerId || !selectedShop,
    fetchPolicy: 'cache-and-network'
  });

  const { data: availableBarbersData, loading: availableBarbersLoading } = useQuery(GET_AVAILABLE_BARBERS, {
    variables: { ownerId: ownerId || '', barberShopId: selectedShop?.id || '' },
    skip: !ownerId || !selectedShop || !assignBarberOpen,
    fetchPolicy: 'cache-and-network'
  });

  // Mutations
  const [updateBarberShop] = useMutation(UPDATE_BARBER_SHOP);
  const [assignBarberToShop] = useMutation(ASSIGN_BARBER_TO_SHOP);
  const [unassignBarberFromShop] = useMutation(UNASSIGN_BARBER_FROM_SHOP);

  if (!ownerId) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <Typography variant="h5" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You must be an owner to access this page.
        </Typography>
      </Box>
    );
  }

  if (shopsLoading) return <CircularProgress />;
  if (shopsError) return <Alert severity="error">Error loading shops: {shopsError.message}</Alert>;

  const barberShops = shopsData?.getOwnerBarberShops || [];
  const shopBarbers = shopBarbersData?.getShopBarbers || [];
  const availableBarbers = availableBarbersData?.getAvailableBarbers || [];

  const handleEditShop = (shop: BarberShop) => {
    setSelectedShop(shop);
    setEditShopForm(shop);
    setEditShopOpen(true);
  };

  const handleUpdateShop = async () => {
    if (!selectedShop || !ownerId) return;

    try {
      await updateBarberShop({
        variables: {
          ownerId,
          barberShopId: selectedShop.id,
          ...editShopForm
        }
      });
      setEditShopOpen(false);
      refetchShops();
    } catch (error) {
      console.error('Error updating shop:', error);
    }
  };

  const handleManageBarbers = (shop: BarberShop) => {
    setSelectedShop(shop);
    setManageBarbersOpen(true);
  };

  const handleAssignBarber = async (barberId: string) => {
    if (!selectedShop || !ownerId) return;

    try {
      await assignBarberToShop({
        variables: {
          ownerId,
          barberId,
          barberShopId: selectedShop.id
        }
      });
      setAssignBarberOpen(false);
      refetchShopBarbers();
    } catch (error) {
      console.error('Error assigning barber:', error);
    }
  };

  const handleUnassignBarber = async (barberId: string) => {
    if (!selectedShop || !ownerId) return;

    try {
      await unassignBarberFromShop({
        variables: {
          ownerId,
          barberId,
          barberShopId: selectedShop.id
        }
      });
      refetchShopBarbers();
    } catch (error) {
      console.error('Error unassigning barber:', error);
    }
  };

  const renderShopCard = (shop: BarberShop) => (
    <Card sx={{ 
      height: '100%', 
      width: '100%',
      display: 'flex', 
      flexDirection: 'column',
      transition: 'all 0.3s ease-in-out',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: (theme) => theme.shadows[8],
      }
    }}>
      {/* Header with gradient background */}
      <Box
        sx={{
          height: 120,
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          color: 'white'
        }}
      >
        <Avatar 
          src={shop.avatar} 
          sx={{ 
            width: 80, 
            height: 80, 
            border: '3px solid white',
            boxShadow: 2
          }}
        />
        <Chip 
          label={shop.isActive ? 'Active' : 'Inactive'} 
          color={shop.isActive ? 'success' : 'default'}
          size="small"
          sx={{ 
            position: 'absolute', 
            top: 12, 
            right: 12,
            fontWeight: 'bold'
          }}
        />
      </Box>
      
      <CardContent sx={{ flex: 1, p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom fontWeight="bold" textAlign="center">
          {shop.name}
        </Typography>
        
        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Star sx={{ color: '#ffeb3b', mr: 0.5 }} />
          <Typography variant="body2" fontWeight="medium">
            {shop.averageRating ? shop.averageRating.toFixed(1) : 'N/A'}
          </Typography>
          <Typography variant="body2" color="text.secondary" ml={1}>
            ({shop.totalRatings || 0} reviews)
          </Typography>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        <Stack spacing={1.5}>
          <Box display="flex" alignItems="center">
            <LocationOn sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />
            <Typography variant="body2" flex={1}>
              {shop.city}, {shop.state}
            </Typography>
          </Box>
          
          {shop.phone && (
            <Box display="flex" alignItems="center">
              <Phone sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />
              <Typography variant="body2">{shop.phone}</Typography>
            </Box>
          )}
          
          {shop.email && (
            <Box display="flex" alignItems="center">
              <Email sx={{ mr: 1, color: 'primary.main', fontSize: 18 }} />
              <Typography variant="body2" noWrap>{shop.email}</Typography>
            </Box>
          )}
        </Stack>
        
        {shop.description && (
          <Box mt={2}>
            <Typography variant="body2" color="text.secondary" sx={{ 
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4
            }}>
              {shop.description}
            </Typography>
          </Box>
        )}
        
        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center">
            <Star sx={{ color: '#f50057', mr: 0.5, fontSize: 16 }} />
            <Typography variant="caption" color="text.secondary">
              {shop.favoriteCount || 0} favorites
            </Typography>
          </Box>
          <Typography variant="caption" color="text.secondary">
            Updated {new Date(shop.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>
      </CardContent>
      
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button 
          fullWidth
          variant="outlined"
          startIcon={<Edit />}
          onClick={() => handleEditShop(shop)}
          sx={{ mr: 1 }}
        >
          Edit Shop
        </Button>
        <Button 
          fullWidth
          variant="contained"
          startIcon={<Group />}
          onClick={() => handleManageBarbers(shop)}
        >
          Manage Team
        </Button>
      </CardActions>
    </Card>
  );

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            Owner Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Manage your barber shops and employees
          </Typography>
        </Box>
        <Business sx={{ fontSize: 48, color: 'primary.main' }} />
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                    Total Shops
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {barberShops.length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {barberShops.filter((shop: BarberShop) => shop.isActive).length} active
                  </Typography>
                </Box>
                <Store sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                    Active Shops
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {barberShops.filter((shop: BarberShop) => shop.isActive).length}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {barberShops.length > 0 ? ((barberShops.filter((shop: BarberShop) => shop.isActive).length / barberShops.length) * 100).toFixed(0) : 0}% active rate
                  </Typography>
                </Box>
                <Settings sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                    Avg Rating
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {barberShops.length > 0 
                      ? (barberShops.reduce((sum: number, shop: BarberShop) => sum + (shop.averageRating || 0), 0) / barberShops.length).toFixed(1)
                      : 'N/A'
                    }
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {barberShops.reduce((sum: number, shop: BarberShop) => sum + (shop.totalRatings || 0), 0)} total reviews
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white', height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                    Total Favorites
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {barberShops.reduce((sum: number, shop: BarberShop) => sum + (shop.favoriteCount || 0), 0)}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Customer favorites
                  </Typography>
                </Box>
                <Star sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={2.4}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)', 
              color: 'white', 
              height: '100%',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 8,
              }
            }}
            onClick={() => navigate('/owner/earnings')}
          >
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="inherit" variant="body2" sx={{ opacity: 0.8 }}>
                    Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    View
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    Track performance
                  </Typography>
                </Box>
                <AttachMoney sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Barber Shops */}
      <Typography variant="h4" gutterBottom>
        Your Barber Shops
      </Typography>
      
      {barberShops.length === 0 ? (
        <Alert severity="info" sx={{ mb: 2 }}>
          You don't have any barber shops yet. Contact an administrator to create one.
        </Alert>
      ) : (
        <Grid container spacing={3} sx={{ alignItems: 'stretch' }}>
          {barberShops.map((shop: BarberShop) => (
            <Grid item xs={12} sm={6} md={4} key={shop.id} sx={{ display: 'flex' }}>
              {renderShopCard(shop)}
            </Grid>
          ))}
        </Grid>
      )}

      {/* Edit Shop Dialog */}
      <Dialog open={editShopOpen} onClose={() => setEditShopOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Barber Shop</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Shop Name"
                value={editShopForm.name || ''}
                onChange={(e) => setEditShopForm({...editShopForm, name: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone"
                value={editShopForm.phone || ''}
                onChange={(e) => setEditShopForm({...editShopForm, phone: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Description"
                value={editShopForm.description || ''}
                onChange={(e) => setEditShopForm({...editShopForm, description: e.target.value})}
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Address"
                value={editShopForm.address || ''}
                onChange={(e) => setEditShopForm({...editShopForm, address: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="City"
                value={editShopForm.city || ''}
                onChange={(e) => setEditShopForm({...editShopForm, city: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="State"
                value={editShopForm.state || ''}
                onChange={(e) => setEditShopForm({...editShopForm, state: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                label="Zip Code"
                value={editShopForm.zipCode || ''}
                onChange={(e) => setEditShopForm({...editShopForm, zipCode: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                value={editShopForm.email || ''}
                onChange={(e) => setEditShopForm({...editShopForm, email: e.target.value})}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Website"
                value={editShopForm.website || ''}
                onChange={(e) => setEditShopForm({...editShopForm, website: e.target.value})}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditShopOpen(false)} startIcon={<Cancel />}>
            Cancel
          </Button>
          <Button onClick={handleUpdateShop} variant="contained" startIcon={<Save />}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Manage Barbers Dialog */}
      <Dialog open={manageBarbersOpen} onClose={() => setManageBarbersOpen(false)} maxWidth="lg" fullWidth>
        <DialogTitle>
          Manage Barbers - {selectedShop?.name}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Current Barbers</Typography>
            <Button 
              variant="contained" 
              startIcon={<PersonAdd />}
              onClick={() => setAssignBarberOpen(true)}
            >
              Assign Barber
            </Button>
          </Box>
          
          {shopBarbersLoading ? (
            <CircularProgress />
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Barber</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Experience</TableCell>
                    <TableCell>Rating</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shopBarbers.map((barber: Barber) => (
                    <TableRow key={barber.id}>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Avatar src={barber.avatar} sx={{ mr: 2 }} />
                          <Box>
                            <Typography variant="body2">
                              {barber.firstName} {barber.lastName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {barber.specialties || 'No specialties'}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{barber.email}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {barber.phone || 'No phone'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {barber.experienceYears || 0} years
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box display="flex" alignItems="center">
                          <Star sx={{ color: 'gold', mr: 0.5, fontSize: 16 }} />
                          <Typography variant="body2">
                            {barber.averageRating ? barber.averageRating.toFixed(1) : 'N/A'} ({barber.totalRatings || 0})
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Tooltip title="Remove from shop">
                          <IconButton 
                            color="error" 
                            onClick={() => handleUnassignBarber(barber.id)}
                          >
                            <PersonRemove />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setManageBarbersOpen(false)}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Assign Barber Dialog */}
      <Dialog open={assignBarberOpen} onClose={() => setAssignBarberOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign Barber to {selectedShop?.name}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Select a barber to assign to this shop:
          </Typography>
          
          {availableBarbersLoading ? (
            <CircularProgress />
          ) : (
            <List>
              {availableBarbers.map((barber: Barber) => (
                <ListItem 
                  key={barber.id} 
                  button 
                  onClick={() => handleAssignBarber(barber.id)}
                  sx={{ border: 1, borderColor: 'divider', borderRadius: 1, mb: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar src={barber.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={`${barber.firstName} ${barber.lastName}`}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {barber.email}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {barber.experienceYears || 0} years experience
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
              {availableBarbers.length === 0 && (
                <Alert severity="info">
                  No available barbers to assign.
                </Alert>
              )}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignBarberOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default OwnerDashboard;