export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Barber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  experienceYears?: number;
  specialties?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  barberShops: BarberShop[];
  averageRating?: number;
  totalRatings?: number;
}

export interface BarberShop {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  phone?: string;
  email?: string;
  website?: string;
  avatar?: string;
  coverPhoto?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  barbers: Barber[];
  services: ManagementService[];
  averageRating?: number;
  totalRatings?: number;
  favoriteCount?: number;
}

export interface ManagementService {
  id: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  barberShop: BarberShop;
  category: Category;
  barber?: Barber;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  totalPrice: number;
  notes?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  user: User;
  barber: Barber;
  barberShop: BarberShop;
  managementService: ManagementService;
}

export interface Rating {
  id: string;
  rating: number;
  comment?: string;
  ratedId: string;
  ratedType: RatedType;
  createdAt: string;
  updatedAt: string;
  rater?: User;
  barberRater?: Barber;
}

export interface Favorite {
  id: string;
  createdAt: string;
  user: User;
  barberShop: BarberShop;
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface AuthPayload {
  token: string;
  refreshToken: string;
  user?: User;
  barber?: Barber;
  expiresIn: number;
}

export enum Role {
  CUSTOMER = 'CUSTOMER',
  BARBER = 'BARBER',
  OWNER = 'OWNER',
  ADMIN = 'ADMIN'
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW'
}

export enum RatedType {
  USER = 'USER',
  BARBER = 'BARBER',
  BARBERSHOP = 'BARBERSHOP'
}

export enum DayOfWeek {
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
  SUNDAY = 'SUNDAY'
}