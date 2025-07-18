# BarberCatalog

A full-stack barber shop management system built with Spring Boot (backend) and React (frontend) that allows customers to find barbers, book appointments, and manage their profiles, while enabling barbers and shop owners to manage their services and bookings.

## 🚀 Quick Start

### Prerequisites

- **Java 17+**
- **Node.js 18+**
- **Maven 3.6+**
- **Git**

### 🏃‍♂️ Running the Project

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/barberCatalog.git
cd barberCatalog
```

#### 2. Start the Backend (Spring Boot)
```bash
# Build and run the Spring Boot application
mvn spring-boot:run

# Or using Maven wrapper
./mvnw spring-boot:run        # Linux/Mac
mvnw.cmd spring-boot:run      # Windows
```

The backend will start at `http://localhost:8080`

#### 3. Start the Frontend (React)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm start
```

The frontend will start at `http://localhost:3000`

#### 4. Access the Application
Open your browser and navigate to `http://localhost:3000`

## 🏗️ Project Structure

```
barberCatalog/
├── src/main/java/                 # Spring Boot backend
│   └── com/mlprojects/barberCatalog/
│       ├── entity/               # JPA entities
│       ├── repository/           # Data repositories
│       ├── service/              # Business logic
│       ├── resolver/             # GraphQL resolvers
│       ├── dto/                  # Data transfer objects
│       ├── security/             # Security configuration
│       └── config/               # Application configuration
├── src/main/resources/
│   ├── graphql/                  # GraphQL schema definitions
│   └── application.properties    # Application configuration
├── frontend/                     # React frontend
│   ├── src/
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Page components
│   │   ├── services/             # API services
│   │   ├── utils/                # Utility functions
│   │   └── types/                # TypeScript type definitions
│   ├── public/                   # Static assets
│   └── package.json             # Frontend dependencies
└── README.md
```

## 🎨 UI Functionality

### 🔐 Authentication & Authorization

#### Login & Registration
- **Login Page**: Modern glassmorphism design with gradient backgrounds
- **Registration**: Separate forms for customers and barbers
- **Role-based Access**: Different dashboards for customers, barbers, and owners

#### User Roles
- **Customer**: Browse barbers, book appointments, manage favorites
- **Barber**: Manage profile, services, view schedule and analytics
- **Owner**: Manage barber shops, view analytics, manage multiple locations
- **Admin**: Full system access and management

### 🏠 Dashboard Features

#### Customer Dashboard
- **Personalized Greeting**: "Good morning/afternoon/evening, [Name]!"
- **Quick Stats**: Total bookings, completed appointments, pending bookings, total spent
- **Upcoming Appointments**: Next 5 upcoming bookings with barber details
- **Favorite Shops**: Quick access to favorited barber shops with ratings
- **Quick Actions**: Book appointment, find barbershops, browse barbers

#### Barber Dashboard
- **Professional Overview**: Booking statistics, earnings, client metrics
- **Today's Schedule**: Upcoming appointments with client details
- **Performance Metrics**: Ratings, reviews, and analytics
- **Quick Actions**: View schedule, access analytics

#### Owner Dashboard
- **Multi-location Management**: Overview of all owned barber shops
- **Business Analytics**: Revenue, bookings, performance across locations
- **Shop Management**: Edit shop details, manage barbers, services

### 🔍 Discovery & Browsing

#### Barber Shop Listings
- **Grid Layout**: Modern card-based design with shop images
- **Search & Filter**: Find shops by location, services, ratings
- **Shop Details**: Address, phone, ratings, available services
- **Responsive Design**: Optimized for mobile and desktop

#### Barber Profiles
- **Professional Listings**: Barber photos, experience, specialties
- **Ratings & Reviews**: Customer feedback and star ratings
- **Service Offerings**: Available services with pricing and duration
- **Booking Integration**: Direct booking from barber profiles

### 📅 Booking Management

#### Appointment Booking
- **Service Selection**: Choose from available services
- **Time Slot Selection**: Visual calendar with available times
- **Barber Preference**: Select specific barbers or auto-assign
- **Booking Confirmation**: Email/SMS confirmations

#### Booking Status Tracking
- **Status Types**: Pending, Confirmed, In Progress, Completed, Cancelled, No Show
- **Real-time Updates**: Status changes reflected immediately
- **Booking History**: Complete history with service details and costs

### 👤 Profile Management

#### Customer Profiles
- **Personal Information**: Name, email, phone, avatar
- **Booking History**: Past appointments with details and receipts
- **Favorite Shops**: Saved barber shops for quick access
- **Password Management**: Secure password change functionality

#### Barber Profiles
- **Professional Details**: Bio, experience years, specialties
- **Shop Association**: Linked barber shop information
- **Service Management**: Add, edit, remove services with pricing
- **Portfolio**: Showcase work and specialties

#### Material-UI Enhanced Profile Editor
- **Modern Interface**: Tabbed layout with icons
- **Real-time Validation**: Form validation with helpful error messages
- **Image Upload**: Avatar and cover photo management
- **Responsive Design**: Works seamlessly on all devices

### 🎨 Design System

#### Modern UI Components
- **Material-UI Framework**: Consistent, professional design language
- **Glassmorphism Effects**: Semi-transparent backgrounds with blur effects
- **Gradient Backgrounds**: Beautiful color transitions
- **Smooth Animations**: Hover effects, transitions, and micro-interactions

#### Navigation
- **Sliding Header**: Hides on scroll, shows on scroll up
- **Responsive Menu**: Mobile-friendly navigation with drawer
- **User Menu**: Avatar-based dropdown with user actions
- **Breadcrumbs**: Clear navigation hierarchy

#### Cards & Layouts
- **Elevation**: Proper shadow effects for depth
- **Consistent Spacing**: Grid system with proper gutters
- **Typography**: Clear hierarchy with Material-UI typography
- **Color Scheme**: Professional color palette with brand consistency

## 🔌 API Endpoints

### 🔐 Authentication Endpoints

#### POST `/graphql` - Login
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
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
```

#### POST `/graphql` - Register User
```graphql
mutation RegisterUser($input: RegisterInput!) {
  registerUser(input: $input) {
    token
    user {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

#### POST `/graphql` - Register Barber
```graphql
mutation RegisterBarber($input: RegisterInput!) {
  registerBarber(input: $input) {
    token
    barber {
      id
      email
      firstName
      lastName
      role
    }
  }
}
```

### 👥 User Management

#### Query User Profile
```graphql
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
  }
}
```

#### Update User
```graphql
mutation UpdateUser($id: ID!, $input: UpdateUserInput!) {
  updateUser(id: $id, input: $input) {
    id
    firstName
    lastName
    phone
    avatar
  }
}
```

#### Change Password
```graphql
mutation ChangePassword($id: ID!, $currentPassword: String!, $newPassword: String!) {
  changePassword(id: $id, currentPassword: $currentPassword, newPassword: $newPassword)
}
```

### 💈 Barber Management

#### Query Barbers
```graphql
query GetBarbers {
  barbers {
    id
    firstName
    lastName
    email
    phone
    avatar
    bio
    experienceYears
    specialties
    averageRating
    totalRatings
    barberShops {
      id
      name
      city
      state
    }
  }
}
```

#### Query Barber Profile
```graphql
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
      phone
      email
    }
    services {
      id
      name
      description
      price
      durationMinutes
      category {
        id
        name
      }
    }
  }
}
```

#### Update Barber
```graphql
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
```

### 🏪 Barber Shop Management

#### Query Barber Shops
```graphql
query GetBarberShops {
  barberShops {
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
    averageRating
    totalRatings
    isActive
  }
}
```

#### Query Barber Shop Details
```graphql
query GetBarberShopDetail($id: ID!) {
  barberShop(id: $id) {
    id
    name
    description
    address
    city
    state
    phone
    email
    website
    avatar
    averageRating
    totalRatings
    barbers {
      id
      firstName
      lastName
      avatar
      experienceYears
      specialties
      averageRating
    }
    services {
      id
      name
      description
      price
      durationMinutes
      category {
        name
      }
    }
  }
}
```

#### Create Barber Shop
```graphql
mutation CreateBarberShop($input: CreateBarberShopInput!) {
  createBarberShop(input: $input) {
    id
    name
    description
    address
    city
    state
    phone
    email
  }
}
```

#### Update Barber Shop
```graphql
mutation UpdateBarberShop($id: ID!, $input: UpdateBarberShopInput!) {
  updateBarberShop(id: $id, input: $input) {
    id
    name
    description
    address
    city
    state
    phone
    email
    website
  }
}
```

### 📅 Booking Management

#### Query User Bookings
```graphql
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
```

#### Query Upcoming Bookings
```graphql
query GetUpcomingBookings($userId: ID!) {
  upcomingBookings(userId: $userId) {
    id
    startTime
    endTime
    status
    totalPrice
    barber {
      id
      firstName
      lastName
      avatar
      barberShops {
        name
      }
    }
    managementService {
      id
      name
      category {
        name
        icon
      }
    }
  }
}
```

#### Query Barber Bookings
```graphql
query GetBarberBookings($barberId: ID!) {
  bookingsByBarber(barberId: $barberId) {
    id
    startTime
    endTime
    status
    totalPrice
    user {
      id
      firstName
      lastName
      avatar
    }
    managementService {
      id
      name
      category {
        name
      }
    }
  }
}
```

#### Create Booking
```graphql
mutation CreateBooking($input: CreateBookingInput!) {
  createBooking(input: $input) {
    id
    startTime
    endTime
    status
    totalPrice
    notes
  }
}
```

#### Update Booking Status
```graphql
mutation UpdateBookingStatus($id: ID!, $status: BookingStatus!) {
  updateBookingStatus(id: $id, status: $status) {
    id
    status
  }
}
```

### 🛠️ Service Management

#### Query Categories
```graphql
query GetCategories {
  categories {
    id
    name
    description
    isActive
  }
}
```

#### Query Services
```graphql
query GetServices {
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
    barber {
      id
      firstName
      lastName
    }
    barberShop {
      id
      name
    }
  }
}
```

#### Create Service
```graphql
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
```

#### Update Service
```graphql
mutation UpdateManagementService($id: ID!, $input: UpdateManagementServiceInput!) {
  updateManagementService(id: $id, input: $input) {
    id
    name
    description
    price
    durationMinutes
  }
}
```

### ⭐ Favorites Management

#### Query User Favorites
```graphql
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
```

#### Add to Favorites
```graphql
mutation AddToFavorites($userId: ID!, $shopId: ID!) {
  addToFavorites(userId: $userId, shopId: $shopId)
}
```

#### Remove from Favorites
```graphql
mutation RemoveFavorite($userId: ID!, $shopId: ID!) {
  removeFromFavorites(userId: $userId, shopId: $shopId)
}
```

### 📊 Rating System

#### Query Ratings
```graphql
query GetRatingsByEntity($entityId: ID!, $entityType: String!) {
  ratingsByEntity(entityId: $entityId, entityType: $entityType) {
    id
    rating
    comment
    createdAt
    rater {
      id
      firstName
      lastName
      avatar
    }
  }
}
```

#### Create Rating
```graphql
mutation CreateRating($input: CreateRatingInput!) {
  createRating(input: $input) {
    id
    rating
    comment
    createdAt
  }
}
```

## 🗄️ Database Schema

### Core Entities

- **User**: Customer accounts with personal information
- **Barber**: Professional barber profiles with experience and specialties  
- **BarberShop**: Physical locations with address and contact details
- **Booking**: Appointment records with status tracking
- **ManagementService**: Services offered by barbers with pricing
- **Category**: Service categories for organization
- **Rating**: Review system for barbers and shops
- **Favorite**: User's saved barber shops
- **WorkingHours**: Barber availability schedules

### Relationships

- Users can have multiple Bookings
- Barbers belong to BarberShops
- Barbers offer multiple ManagementServices
- Services belong to Categories
- Users can favorite BarberShops
- Entities can have multiple Ratings

## 🔧 Development

### Backend Development
```bash
# Run tests
mvn test

# Build the project
mvn clean compile

# Generate GraphQL types
mvn generate-sources

# Package the application
mvn package
```

### Frontend Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Build the JAR file: `mvn package`
2. Run with: `java -jar target/barberCatalog-*.jar`
3. Configure `application.properties` for production

### Frontend Deployment
1. Build the app: `npm run build`
2. Serve the `build` folder with a web server
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request
