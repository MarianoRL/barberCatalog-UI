import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Typography, Box, Button, Card, CardContent, Avatar, Grid, Chip } from '@mui/material';
import { Edit, Person, Business, Settings } from '@mui/icons-material';
import { BarberProfileEdit } from '../components/BarberProfileEdit';
import { UserProfileEdit } from '../components/UserProfileEdit';
import { Role } from '../types';
import { getCurrentUser, updateCurrentUser, CurrentUser } from '../utils/auth';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  // Check if we're on the edit route
  useEffect(() => {
    setIsEditing(location.pathname.includes('/edit'));
  }, [location.pathname]);

  // Get current user data from localStorage
  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      // If no user is logged in, redirect to login
      navigate('/login');
      return;
    }
    setCurrentUser(user);
  }, [navigate]);

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const handleBackToProfile = () => {
    navigate('/profile');
  };

  const handleProfileUpdated = () => {
    // Handle successful profile update
    console.log('Profile updated successfully!');
    
    // Refresh the current user data from localStorage
    const updatedUser = getCurrentUser();
    if (updatedUser) {
      setCurrentUser(updatedUser);
    }
    
    navigate('/profile');
  };

  if (!currentUser) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  // If in edit mode, show the appropriate edit component
  if (isEditing) {
    return (
      <Box>
        <Box display="flex" alignItems="center" mb={3}>
          <Button 
            onClick={handleBackToProfile} 
            startIcon={<Person />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            Back to Profile
          </Button>
          <Typography variant="h4" component="h1">
            Edit Profile
          </Typography>
        </Box>
        
        {currentUser.role === Role.BARBER ? (
          <BarberProfileEdit 
            barberId={currentUser.id}
            onProfileUpdated={handleProfileUpdated}
          />
        ) : (
          <UserProfileEdit 
            userId={currentUser.id}
            onProfileUpdated={handleProfileUpdated}
          />
        )}
      </Box>
    );
  }

  // Profile view mode
  return (
    <Box>
      <Box display="flex" justifyContent="between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Profile
        </Typography>
        <Button
          variant="contained"
          startIcon={<Edit />}
          onClick={handleEditProfile}
          sx={{ ml: 'auto' }}
        >
          Edit Profile
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Profile Summary Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Avatar
                  src={currentUser.avatar}
                  sx={{ width: 100, height: 100, mb: 2 }}
                >
                  {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
                </Avatar>
                <Typography variant="h5" gutterBottom>
                  {currentUser.firstName} {currentUser.lastName}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {currentUser.email}
                </Typography>
                <Chip 
                  label={currentUser.role} 
                  color={currentUser.role === Role.BARBER ? 'primary' : 'secondary'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Profile Details Card */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    First Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentUser.firstName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Last Name
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentUser.lastName}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentUser.email}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Phone
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {currentUser.phone || 'Not provided'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Member Since
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    {new Date(currentUser.createdAt).toLocaleDateString()}
                  </Typography>
                </Grid>
              </Grid>

              {/* Show barber-specific info if user is a barber */}
              {currentUser.role === Role.BARBER && (
                <Box mt={3}>
                  <Typography variant="h6" gutterBottom>
                    Professional Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Experience
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {currentUser.experienceYears || 0} years
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Specialties
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {currentUser.specialties || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Bio
                      </Typography>
                      <Typography variant="body1" gutterBottom>
                        {currentUser.bio || 'No bio provided'}
                      </Typography>
                    </Grid>
                    {currentUser.barberShop && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Barber Shop
                        </Typography>
                        <Typography variant="body1" gutterBottom>
                          {currentUser.barberShop.name} - {currentUser.barberShop.city}, {currentUser.barberShop.state}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Box mt={4}>
        <Typography variant="h6" gutterBottom>
          Quick Actions
        </Typography>
        <Box display="flex" gap={2} flexWrap="wrap">
          <Button
            variant="outlined"
            startIcon={<Edit />}
            onClick={handleEditProfile}
          >
            Edit Profile
          </Button>
          <Button
            variant="outlined"
            startIcon={<Settings />}
            onClick={() => navigate('/profile/edit')}
          >
            Account Settings
          </Button>
          {currentUser.role === Role.BARBER && (
            <Button
              variant="outlined"
              startIcon={<Business />}
              onClick={() => navigate('/profile/edit')}
            >
              Manage Services
            </Button>
          )}
        </Box>
      </Box>

      {/* Instructions */}
      <Box mt={4} p={3} bgcolor="background.paper" borderRadius={2}>
        <Typography variant="h6" gutterBottom>
          Profile Features
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {currentUser.role === Role.BARBER ? (
            <>
              • Edit your personal information and professional details<br />
              • Update your barber shop information<br />
              • Manage your services and pricing<br />
              • Change your password securely
            </>
          ) : (
            <>
              • Edit your personal information<br />
              • View and manage your bookings<br />
              • Manage your favorite barber shops<br />
              • Change your password securely
            </>
          )}
        </Typography>
      </Box>
    </Box>
  );
};

export default Profile;