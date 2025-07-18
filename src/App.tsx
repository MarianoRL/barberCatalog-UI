import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ApolloProvider } from '@apollo/client';
import { client } from './services/apollo';
import { theme } from './theme';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';
import Home from './pages/Home';
import BarberShops from './pages/BarberShops';
import BarberShopDetail from './pages/BarberShopDetail';
import Barbers from './pages/Barbers';
import BarberDetail from './pages/BarberDetail';
import Bookings from './pages/Bookings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerAppointments from './pages/OwnerAppointments';
import OwnerAnalytics from './pages/OwnerAnalytics';
import BarberAnalytics from './pages/BarberAnalytics';

function App() {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            {/* Public routes without Layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes with Layout */}
            <Route path="/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/barbershops" element={<BarberShops />} />
                    <Route path="/barbershops/:id" element={<BarberShopDetail />} />
                    <Route path="/barbers" element={<Barbers />} />
                    <Route path="/barbers/:id" element={<BarberDetail />} />
                    <Route path="/bookings" element={<Bookings />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<Profile />} />
                    <Route path="/owner/dashboard" element={<OwnerDashboard />} />
                    <Route path="/owner/appointments" element={<OwnerAppointments />} />
                    <Route path="/owner/analytics" element={<OwnerAnalytics />} />
                    <Route path="/barber/analytics" element={<BarberAnalytics />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;