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
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemSecondaryAction
} from '@mui/material';
import {
  Person,
  BookmarkBorder,
  Event,
  Lock,
  Edit,
  Save,
  Cancel,
  PhotoCamera,
  Delete,
  Phone,
  LocationOn,
  Star,
  AccessTime
} from '@mui/icons-material';
import { User, Booking } from '../types';
import { updateCurrentUser } from '../utils/auth';

// GraphQL Queries
const GET_USER_PROFILE = gql`
  query GetUserProfile($id: ID!) {
    user(id: $id) {
      id
      email
      firstName
      lastName
      phone
      avatar
      role
      isActive
      createdAt
      updatedAt
    }
  }
`;

const GET_USER_BOOKINGS = gql`
  query GetUserBookings($userId: ID!) {
    bookingsByUser(userId: $userId) {
      id
      startTime
      endTime
      status
      totalPrice
      notes
      createdAt
      barber {
        id
        firstName
        lastName
        barberShops {
          name
          city
          state
        }
      }
      managementService {
        id
        name
        description
        price
        durationMinutes
      }
    }
  }
`;

const GET_USER_FAVORITES = gql`
  query GetUserFavorites($userId: ID!) {
    favorites(userId: $userId) {
      id
      createdAt
      barberShop {
        id
        name
        description
        address
        city
        state
        phone
        avatar
        averageRating
        totalRatings
      }
    }
  }
`;

// GraphQL Mutations
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
    updateUser(id: $id, input: $input) {
      id
      firstName
      lastName
      phone
      avatar
    }
  }
`;

const CHANGE_PASSWORD = gql`
  mutation ChangePassword($id: ID!, $currentPassword: String!, $newPassword: String!) {
    changePassword(id: $id, currentPassword: $currentPassword, newPassword: $newPassword)
  }
`;

const REMOVE_FAVORITE = gql`
  mutation RemoveFavorite($userId: ID!, $shopId: ID!) {
    removeFromFavorites(userId: $userId, shopId: $shopId)
  }
`;

interface UserProfileEditProps {
  userId: string;
  onProfileUpdated?: () => void;
}

export const UserProfileEdit: React.FC<UserProfileEditProps> = ({ userId, onProfileUpdated }) => {
  const [activeTab, setActiveTab] = useState<'personal' | 'bookings' | 'favorites' | 'password'>('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Queries
  const { data: userData, loading: userLoading, error: userError, refetch } = useQuery(GET_USER_PROFILE, {
    variables: { id: userId },
    fetchPolicy: 'cache-and-network'
  });

  const { data: bookingsData, loading: bookingsLoading } = useQuery(GET_USER_BOOKINGS, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  const { data: favoritesData, loading: favoritesLoading, refetch: refetchFavorites } = useQuery(GET_USER_FAVORITES, {
    variables: { userId },
    fetchPolicy: 'cache-and-network'
  });

  // Mutations
  const [updateUser, { loading: updateUserLoading }] = useMutation(UPDATE_USER);
  const [changePassword, { loading: changePasswordLoading }] = useMutation(CHANGE_PASSWORD);
  const [removeFavorite, { loading: removeFavoriteLoading }] = useMutation(REMOVE_FAVORITE);

  const [userForm, setUserForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    avatar: ''
  });

  // Initialize form when data loads
  useEffect(() => {
    if (userData?.user) {
      const user = userData.user;
      setUserForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      });
    }
  }, [userData]);

  const handleUpdateUser = async () => {
    try {
      const result = await updateUser({
        variables: {
          id: userId,
          input: userForm
        }
      });
      
      // Update localStorage with the new data
      if (result.data?.updateUser) {
        updateCurrentUser(result.data.updateUser);
      }
      
      setIsEditing(false);
      onProfileUpdated?.();
      refetch();
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long');
      return;
    }

    try {
      await changePassword({
        variables: {
          id: userId,
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

  const handleRemoveFavorite = async (shopId: string) => {
    try {
      await removeFavorite({
        variables: { userId, shopId }
      });
      refetchFavorites();
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Error removing favorite. Please try again.');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'green';
      case 'PENDING': return 'orange';
      case 'COMPLETED': return 'blue';
      case 'CANCELLED': return 'red';
      case 'NO_SHOW': return 'gray';
      default: return 'black';
    }
  };

  if (userLoading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <CircularProgress />
    </Box>
  );
  
  if (userError) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Alert severity="error">Error loading profile</Alert>
    </Box>
  );

  const user = userData?.user;
  if (!user) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
      <Alert severity="error">User not found</Alert>
    </Box>
  );

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box display="flex" alignItems="center" gap={3}>
          <Avatar
            src={user.avatar}
            sx={{ width: 80, height: 80 }}
          >
            {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
          </Avatar>
          <Box flex={1}>
            <Typography variant="h4" gutterBottom>
              {user.firstName} {user.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {user.email}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Member since {formatDate(user.createdAt)}
            </Typography>
          </Box>
        </Box>
      </Paper>
      
      <Box sx={{ mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab value="personal" label="Personal Info" icon={<Person />} />
          <Tab value="bookings" label="My Bookings" icon={<Event />} />
          <Tab value="favorites" label="Favorites" icon={<BookmarkBorder />} />
          <Tab value="password" label="Change Password" icon={<Lock />} />
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
                <Avatar src={userForm.avatar} sx={{ width: 48, height: 48 }}>
                  {userForm.firstName?.charAt(0)}{userForm.lastName?.charAt(0)}
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
                  value={userForm.firstName}
                  onChange={(e) => setUserForm({...userForm, firstName: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={userForm.lastName}
                  onChange={(e) => setUserForm({...userForm, lastName: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone"
                  type="tel"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  disabled={!isEditing}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  type="email"
                  value={user.email}
                  disabled
                  fullWidth
                  helperText="Email cannot be changed"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Avatar URL"
                  type="url"
                  value={userForm.avatar}
                  onChange={(e) => setUserForm({...userForm, avatar: e.target.value})}
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
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    variant="contained"
                    startIcon={<Save />}
                    onClick={handleUpdateUser}
                    disabled={updateUserLoading}
                  >
                    {updateUserLoading ? 'Saving...' : 'Save Changes'}
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

      {/* Bookings Tab */}
      {activeTab === 'bookings' && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              My Bookings
            </Typography>
            
            {bookingsLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {bookingsData?.bookingsByUser?.length === 0 ? (
                  <Alert severity="info">No bookings found.</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {bookingsData?.bookingsByUser?.map((booking: Booking) => (
                      <Grid item xs={12} key={booking.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                              <Typography variant="h6" component="h3">
                                {booking.managementService.name}
                              </Typography>
                              <Chip
                                label={booking.status}
                                size="small"
                                color={
                                  booking.status === 'CONFIRMED' ? 'success' :
                                  booking.status === 'PENDING' ? 'warning' :
                                  booking.status === 'COMPLETED' ? 'info' :
                                  booking.status === 'CANCELLED' ? 'error' : 'default'
                                }
                              />
                            </Box>
                            
                            <Grid container spacing={2}>
                              <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <Person fontSize="small" />
                                  <Typography variant="body2">
                                    <strong>Barber:</strong> {booking.barber.firstName} {booking.barber.lastName}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <LocationOn fontSize="small" />
                                  <Typography variant="body2">
                                    <strong>Shop:</strong> {booking.barber.barberShops?.[0]?.name || 'No shop assigned'}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <Typography variant="body2">
                                    <strong>Location:</strong> {booking.barber.barberShops?.[0]?.city || 'N/A'}, {booking.barber.barberShops?.[0]?.state || 'N/A'}
                                  </Typography>
                                </Box>
                              </Grid>
                              
                              <Grid item xs={12} sm={6}>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <Event fontSize="small" />
                                  <Typography variant="body2">
                                    <strong>Date:</strong> {formatDate(booking.startTime)}
                                  </Typography>
                                </Box>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <AccessTime fontSize="small" />
                                  <Typography variant="body2">
                                    <strong>Duration:</strong> {booking.managementService.durationMinutes} minutes
                                  </Typography>
                                </Box>
                                <Typography variant="body2">
                                  <strong>Price:</strong> ${booking.totalPrice}
                                </Typography>
                              </Grid>
                            </Grid>
                            
                            {booking.notes && (
                              <Typography variant="body2" sx={{ mt: 2 }}>
                                <strong>Notes:</strong> {booking.notes}
                              </Typography>
                            )}
                            
                            <Box display="flex" gap={1} mt={2}>
                              {booking.status === 'PENDING' && (
                                <Button size="small" variant="outlined" color="error">
                                  Cancel Booking
                                </Button>
                              )}
                              {booking.status === 'CONFIRMED' && (
                                <Button size="small" variant="outlined">
                                  Reschedule
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Favorites Tab */}
      {activeTab === 'favorites' && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              My Favorite Shops
            </Typography>
            
            {favoritesLoading ? (
              <Box display="flex" justifyContent="center" py={4}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                {favoritesData?.favorites?.length === 0 ? (
                  <Alert severity="info">No favorite shops yet.</Alert>
                ) : (
                  <Grid container spacing={2}>
                    {favoritesData?.favorites?.map((favorite: any) => (
                      <Grid item xs={12} key={favorite.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Box display="flex" gap={2}>
                              <Avatar
                                src={favorite.barberShop.avatar}
                                sx={{ width: 60, height: 60 }}
                              >
                                {favorite.barberShop.name.charAt(0)}
                              </Avatar>
                              
                              <Box flex={1}>
                                <Typography variant="h6" gutterBottom>
                                  {favorite.barberShop.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                  {favorite.barberShop.description}
                                </Typography>
                                
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                  <LocationOn fontSize="small" />
                                  <Typography variant="body2">
                                    {favorite.barberShop.address}
                                  </Typography>
                                </Box>
                                
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  {favorite.barberShop.city}, {favorite.barberShop.state}
                                </Typography>
                                
                                {favorite.barberShop.phone && (
                                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Phone fontSize="small" />
                                    <Typography variant="body2">
                                      {favorite.barberShop.phone}
                                    </Typography>
                                  </Box>
                                )}
                                
                                {favorite.barberShop.averageRating && (
                                  <Box display="flex" alignItems="center" gap={1}>
                                    <Star fontSize="small" color="warning" />
                                    <Typography variant="body2">
                                      {favorite.barberShop.averageRating.toFixed(1)} ({favorite.barberShop.totalRatings} reviews)
                                    </Typography>
                                  </Box>
                                )}
                              </Box>
                              
                              <Box>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  color="error"
                                  startIcon={<Delete />}
                                  onClick={() => handleRemoveFavorite(favorite.barberShop.id)}
                                  disabled={removeFavoriteLoading}
                                >
                                  Remove
                                </Button>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </>
            )}
          </CardContent>
        </Card>
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
                  placeholder="Enter your current password"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  placeholder="Enter new password (min 6 characters)"
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  placeholder="Confirm new password"
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
                disabled={
                  changePasswordLoading || 
                  !passwordData.currentPassword || 
                  !passwordData.newPassword || 
                  !passwordData.confirmPassword ||
                  passwordData.newPassword !== passwordData.confirmPassword
                }
                startIcon={changePasswordLoading ? <CircularProgress size={20} /> : <Lock />}
              >
                {changePasswordLoading ? 'Changing Password...' : 'Change Password'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default UserProfileEdit;