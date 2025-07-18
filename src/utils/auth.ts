import { Role } from '../types';

export interface CurrentUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  // Barber-specific fields
  bio?: string;
  experienceYears?: number;
  specialties?: string;
  barberShop?: {
    id: string;
    name: string;
    city: string;
    state: string;
    address?: string;
    description?: string;
    phone?: string;
    email?: string;
    website?: string;
    avatar?: string;
  };
}

/**
 * Gets the current logged-in user from localStorage
 * Returns null if no user is logged in
 */
export const getCurrentUser = (): CurrentUser | null => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    // Check for regular user first
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        isActive: user.isActive !== undefined ? user.isActive : true,
        createdAt: user.createdAt || new Date().toISOString(),
        updatedAt: user.updatedAt
      };
    }

    // Check for barber
    const barberStr = localStorage.getItem('barber');
    if (barberStr) {
      const barber = JSON.parse(barberStr);
      return {
        id: barber.id,
        email: barber.email,
        firstName: barber.firstName,
        lastName: barber.lastName,
        phone: barber.phone,
        avatar: barber.avatar,
        role: barber.role,
        isActive: barber.isActive !== undefined ? barber.isActive : true,
        createdAt: barber.createdAt || new Date().toISOString(),
        updatedAt: barber.updatedAt,
        bio: barber.bio,
        experienceYears: barber.experienceYears,
        specialties: barber.specialties,
        barberShop: barber.barberShop
      };
    }

    return null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Updates the current user data in localStorage
 * Used after profile updates to keep localStorage in sync
 */
export const updateCurrentUser = (updatedUser: Partial<CurrentUser>): void => {
  try {
    const currentUser = getCurrentUser();
    if (!currentUser) return;

    const mergedUser = { ...currentUser, ...updatedUser };
    
    // Update the appropriate localStorage key based on role
    if (mergedUser.role === Role.BARBER) {
      localStorage.setItem('barber', JSON.stringify(mergedUser));
    } else {
      localStorage.setItem('user', JSON.stringify(mergedUser));
    }
  } catch (error) {
    console.error('Error updating current user:', error);
  }
};

/**
 * Checks if the user is logged in
 */
export const isAuthenticated = (): boolean => {
  return localStorage.getItem('token') !== null;
};

/**
 * Logs out the current user
 */
export const logout = (): void => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('barber');
};

/**
 * Gets the user's role
 */
export const getUserRole = (): Role | null => {
  const user = getCurrentUser();
  return user?.role || null;
};