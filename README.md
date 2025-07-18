# BarberCatalog Frontend

A React TypeScript frontend for the BarberCatalog application.

## Tech Stack

- **React 18** with TypeScript
- **Apollo Client** for GraphQL
- **Material-UI (MUI)** for UI components
- **React Router** for navigation
- **React Hook Form** for form handling

## Color Scheme

- Primary: Blue (#1976d2)
- Secondary: Black (#000000)
- Background: White (#ffffff)

## Features

- **Home Page**: Landing page with search and feature highlights
- **Barber Shops**: Browse and search barber shops
- **Barbers**: Browse and search individual barbers
- **Authentication**: Login and registration
- **Bookings**: View and manage appointments
- **Profile**: User profile management

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Development Notes

- The app uses a proxy configuration to connect to the backend GraphQL API at `http://localhost:8080`
- Authentication tokens are stored in localStorage
- The app is fully responsive and mobile-friendly