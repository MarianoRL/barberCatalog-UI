import React from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useMutation, gql } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { Role } from '../types';

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      token
      refreshToken
      user {
        id
        email
        firstName
        lastName
        role
      }
      barber {
        id
        email
        firstName
        lastName
        role
      }
      expiresIn
    }
  }
`;

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [registerMutation, { loading, error }] = useMutation(REGISTER_MUTATION);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: Role.CUSTOMER,
    },
  });

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerMutation({
        variables: {
          input: {
            email: data.email,
            password: data.password,
            firstName: data.firstName,
            lastName: data.lastName,
            phone: data.phone,
            role: data.role,
          },
        },
      });

      if (result.data?.register) {
        const { token, refreshToken, user, barber } = result.data.register;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        }
        
        if (barber) {
          localStorage.setItem('barber', JSON.stringify(barber));
        }
        
        navigate('/');
      }
    } catch (error) {
      console.error('Register error:', error);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="60vh"
    >
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom textAlign="center">
            Register
          </Typography>
          
          <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 3 }}>
            Create your account to start booking appointments.
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error.message}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box display="flex" gap={2}>
              <TextField
                {...register('firstName', {
                  required: 'First name is required',
                })}
                label="First Name"
                fullWidth
                margin="normal"
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
              />

              <TextField
                {...register('lastName', {
                  required: 'Last name is required',
                })}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>

            <TextField
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              {...register('phone')}
              label="Phone Number (Optional)"
              type="tel"
              fullWidth
              margin="normal"
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel>Account Type</InputLabel>
              <Select
                {...register('role', { required: 'Account type is required' })}
                label="Account Type"
                error={!!errors.role}
              >
                <MenuItem value={Role.CUSTOMER}>Customer</MenuItem>
                <MenuItem value={Role.BARBER}>Barber</MenuItem>
              </Select>
            </FormControl>

            <TextField
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters',
                },
              })}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match',
              })}
              label="Confirm Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
          </form>

          <Box textAlign="center">
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate('/login')}
              >
                Sign in
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;