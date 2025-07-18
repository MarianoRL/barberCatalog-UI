import React, { useState, useEffect } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Grid, 
  Tabs, 
  Tab, 
  CircularProgress, 
  Alert,
  Avatar,
  IconButton,
  Divider,
  Chip
} from '@mui/material';
import { 
  Person, 
  Business, 
  Edit, 
  Save, 
  Cancel, 
  PhotoCamera 
} from '@mui/icons-material';
import { Barber, Category, ManagementService } from '../types';
import { updateCurrentUser } from '../utils/auth';

// GraphQL Queries
const GET_BARBER_PROFILE = gql`
  query GetBarberProfile($id: ID!) {
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
      barberShops {
        id
        name
        address
        city
        state
        country
        zipCode
        phone
        email
        website
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
        }
      }
    }
  }
`;

const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
      description
      isActive
    }
  }
`;

// GraphQL Mutations
const UPDATE_BARBER = gql`
  mutation UpdateBarber($id: ID!, $input: UpdateBarberInput!) {
    updateBarber(id: $id, input: $input) {
      id
      firstName
      lastName
      phone
      avatar
      bio
      experienceYears
      specialties
    }
  }
`;

const UPDATE_BARBER_SHOP = gql`
  mutation UpdateBarberShop($id: ID!, $input: UpdateBarberShopInput!) {
    updateBarberShop(id: $id, input: $input) {
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
    }
  }
`;

const CREATE_MANAGEMENT_SERVICE = gql`
  mutation CreateManagementService($input: CreateManagementServiceInput!) {
    createManagementService(input: $input) {
      id
      name
      description
      price
      durationMinutes
      isActive
      category {
        id
        name
      }
    }
  }
`;

const UPDATE_MANAGEMENT_SERVICE = gql`
  mutation UpdateManagementService($id: ID!, $input: UpdateManagementServiceInput!) {
    updateManagementService(id: $id, input: $input) {
      id
      name
      description
      price
      durationMinutes
    }
  }
`;

const CHANGE_BARBER_PASSWORD = gql`
  mutation ChangeBarberPassword($id: ID!, $currentPassword: String!, $newPassword: String!) {
    changeBarberPassword(id: $id, currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

interface BarberProfileEditProps {
  barberId: string;
  onProfileUpdated?: () => void;
}

export const BarberProfileEdit: React.FC<BarberProfileEditProps> = ({ barberId, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'shop' | 'services' | 'password'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    price: 0,
    durationMinutes: 30,
    categoryId: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Queries
  const { data: barberData, loading: barberLoading, error: barberError, refetch } = useQuery(GET_BARBER_PROFILE, {
    variables: { id: barberId },
    fetchPolicy: 'cache-and-network'
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Mutations
  const [updateBarber, { loading: updateBarberLoading }] = useMutation(UPDATE_BARBER);
  const [updateBarberShop, { loading: updateShopLoading }] = useMutation(UPDATE_BARBER_SHOP);
  const [createService, { loading: createServiceLoading }] = useMutation(CREATE_MANAGEMENT_SERVICE);
  const [updateService, { loading: updateServiceLoading }] = useMutation(UPDATE_MANAGEMENT_SERVICE);
  const [changePassword, { loading: changePasswordLoading }] = useMutation(CHANGE_BARBER_PASSWORD);

  const [barberForm, setBarberForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: '',
    bio: '',
    experienceYears: 0,
    specialties: ''
  });

  const [shopForm, setShopForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    avatar: '',
    coverPhoto: ''
  });

  // Initialize forms when data loads
  useEffect(() => {
    if (barberData?.barber) {
      const barber = barberData.barber;
      setBarberForm({
        firstName: barber.firstName || '',
        lastName: barber.lastName || '',
        phone: barber.phone || '',
        avatar: barber.avatar || '',
        bio: barber.bio || '',
        experienceYears: barber.experienceYears || 0,
        specialties: barber.specialties || ''
      });

      if (barber.barberShops?.[0]) {
        const shop = barber.barberShops[0];
        setShopForm({
          name: shop.name || '',
          description: shop.description || '',
          address: shop.address || '',
          city: shop.city || '',
          state: shop.state || '',
          country: shop.country || '',
          zipCode: shop.zipCode || '',
          phone: shop.phone || '',
          email: shop.email || '',
          website: shop.website || '',
          avatar: shop.avatar || '',
          coverPhoto: shop.coverPhoto || ''
        });
      }
    }
  }, [barberData]);

  const handleUpdateBarber = async () => {
    try {
      const result = await updateBarber({
        variables: {
          id: barberId,
          input: barberForm
        }
      });
      
      // Update localStorage with the new data
      if (result.data?.updateBarber) {
        updateCurrentUser(result.data.updateBarber);
      }
      
      setIsEditing(false);
      onProfileUpdated?.();
      refetch();
    } catch (error) {
      console.error('Error updating barber:', error);
    }
  };

  const handleUpdateShop = async () => {
    try {
      if (barberData?.barber?.barberShops?.[0]?.id) {
        await updateBarberShop({
          variables: {
            id: barberData.barber.barberShops[0].id,
            input: shopForm
          }
        });
        setIsEditing(false);
        onProfileUpdated?.();
        refetch();
      }
    } catch (error) {
      console.error('Error updating barber shop:', error);
    }
  };

  const handleCreateService = async () => {
    try {
      if (barberData?.barber?.barberShops?.[0]?.id && newService.categoryId) {
        await createService({
          variables: {
            input: {
              ...newService,
              barberShopId: barberData.barber.barberShops[0].id,
              barberId: barberId
            }
          }
        });
        setNewService({
          name: '',
          description: '',
          price: 0,
          durationMinutes: 30,
          categoryId: ''
        });
        refetch();
      }
    } catch (error) {
      console.error('Error creating service:', error);
    }
  };

  const handleUpdateService = async (serviceId: string, updates: any) => {
    try {
      await updateService({
        variables: {
          id: serviceId,
          input: updates
        }
      });
      refetch();
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    try {
      await changePassword({
        variables: {
          id: barberId,
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        }
      });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      alert('Password changed successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please check your current password.');
    }
  };

  if (barberLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );
  
  if (barberError) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Alert severity="error">Error loading profile</Alert>
    </Box>
  );

  const barber = barberData?.barber;
  if (!barber) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Alert severity="error">Barber not found</Alert>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Edit Profile
        </Typography>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="personal" label="Personal Info" icon={<Person />} />
          <Tab value="shop" label="Shop Details" icon={<Business />} />
          <Tab value="services" label="Services" icon={<Edit />} />
          <Tab value="password" label="Change Password" icon={<Save />} />
        </Tabs>
      </Box>

      {/* Personal Information Tab */}
      {activeTab === 'personal' && (
        <Card>
          <CardContent>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Typography variant="h5" component="h2">
                Personal Information
              </Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Avatar src={barberForm.avatar} sx={{ width: 48, height: 48 }}>
                  {barberForm.firstName?.charAt(0)}{barberForm.lastName?.charAt(0)}
                </Avatar>
                <IconButton onClick={() => alert('Upload avatar functionality would go here')}>
                  <PhotoCamera />
                </IconButton>
              </Box>
            </Box>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={barberForm.firstName}
                  onChange={(e) => setBarberForm({...barberForm, firstName: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={barberForm.lastName}
                  onChange={(e) => setBarberForm({...barberForm, lastName: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  type="tel"
                  value={barberForm.phone}
                  onChange={(e) => setBarberForm({...barberForm, phone: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Experience Years"
                  type="number"
                  value={barberForm.experienceYears}
                  onChange={(e) => setBarberForm({...barberForm, experienceYears: parseInt(e.target.value)})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Bio"
                  value={barberForm.bio}
                  onChange={(e) => setBarberForm({...barberForm, bio: e.target.value})}
                  disabled={!isEditing}
                  multiline
                  rows={4}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Specialties"
                  value={barberForm.specialties}
                  onChange={(e) => setBarberForm({...barberForm, specialties: e.target.value})}
                  disabled={!isEditing}
                  placeholder="e.g., Beard styling, Hair cutting, Straight razor shaves"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Avatar URL"
                  type="url"
                  value={barberForm.avatar}
                  onChange={(e) => setBarberForm({...barberForm, avatar: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" gap={2} justifyContent="flex-end">
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleUpdateBarber}
                    disabled={updateBarberLoading}
                  >
                    {updateBarberLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Shop Details Tab */}
      {activeTab === 'shop' && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Shop Information
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Shop Name"
                  value={shopForm.name}
                  onChange={(e) => setShopForm({...shopForm, name: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  type="tel"
                  value={shopForm.phone}
                  onChange={(e) => setShopForm({...shopForm, phone: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  value={shopForm.description}
                  onChange={(e) => setShopForm({...shopForm, description: e.target.value})}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address"
                  value={shopForm.address}
                  onChange={(e) => setShopForm({...shopForm, address: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="City"
                  value={shopForm.city}
                  onChange={(e) => setShopForm({...shopForm, city: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="State"
                  value={shopForm.state}
                  onChange={(e) => setShopForm({...shopForm, state: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Zip Code"
                  value={shopForm.zipCode}
                  onChange={(e) => setShopForm({...shopForm, zipCode: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={shopForm.email}
                  onChange={(e) => setShopForm({...shopForm, email: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Website"
                  type="url"
                  value={shopForm.website}
                  onChange={(e) => setShopForm({...shopForm, website: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box display="flex" gap={2} justifyContent="flex-end">
              {!isEditing ? (
                <Button
                  variant="contained"
                  startIcon={<Edit />}
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleUpdateShop}
                    disabled={updateShopLoading}
                  >
                    {updateShopLoading ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<Cancel />}
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Add New Service
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Service Name"
                    value={newService.name}
                    onChange={(e) => setNewService({...newService, name: e.target.value})}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Category"
                    select
                    value={newService.categoryId}
                    onChange={(e) => setNewService({...newService, categoryId: e.target.value})}
                    fullWidth
                  >
                    <option value="">Select Category</option>
                    {categoriesData?.categories?.map((category: Category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Price ($)"
                    type="number"
                    inputProps={{ step: "0.01" }}
                    value={newService.price}
                    onChange={(e) => setNewService({...newService, price: parseFloat(e.target.value)})}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    value={newService.durationMinutes}
                    onChange={(e) => setNewService({...newService, durationMinutes: parseInt(e.target.value)})}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    value={newService.description}
                    onChange={(e) => setNewService({...newService, description: e.target.value})}
                    multiline
                    rows={3}
                    fullWidth
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleCreateService}
                  disabled={createServiceLoading}
                  startIcon={createServiceLoading ? <CircularProgress size={20} /> : <Save />}
                >
                  {createServiceLoading ? 'Adding...' : 'Add Service'}
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h5" component="h2" gutterBottom>
                Existing Services
              </Typography>
              
              {barber.services?.length === 0 ? (
                <Alert severity="info">No services added yet. Add your first service above!</Alert>
              ) : (
                <Grid container spacing={2}>
                  {barber.services?.map((service: ManagementService) => (
                    <Grid item xs={12} key={service.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                            <Box flex={1}>
                              <Typography variant="h6" gutterBottom>
                                {service.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" paragraph>
                                {service.description}
                              </Typography>
                              <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip label={`$${service.price}`} color="primary" size="small" />
                                <Chip label={`${service.durationMinutes} min`} color="secondary" size="small" />
                                <Chip label={service.category.name} variant="outlined" size="small" />
                              </Box>
                            </Box>
                            <IconButton
                              onClick={() => {
                                const updates = {
                                  name: prompt('New name:', service.name) || service.name,
                                  description: prompt('New description:', service.description) || service.description,
                                  price: parseFloat(prompt('New price:', service.price.toString()) || service.price.toString()),
                                  durationMinutes: parseInt(prompt('New duration (minutes):', service.durationMinutes.toString()) || service.durationMinutes.toString())
                                };
                                handleUpdateService(service.id, updates);
                              }}
                            >
                              <Edit />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Change Password Tab */}
      {activeTab === 'password' && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Change Password
            </Typography>
            
            <Grid container spacing={3} sx={{ maxWidth: 600 }}>
              <Grid item xs={12}>
                <TextField
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  fullWidth
                  error={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== ''}
                  helperText={passwordData.newPassword !== passwordData.confirmPassword && passwordData.confirmPassword !== '' ? 'Passwords do not match' : ''}
                />
              </Grid>
            </Grid>
            
            <Divider sx={{ my: 3 }} />
            
            <Box>
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={changePasswordLoading || passwordData.newPassword !== passwordData.confirmPassword}
                startIcon={changePasswordLoading ? <CircularProgress size={20} /> : <Save />}
              >
                {changePasswordLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default BarberProfileEdit;