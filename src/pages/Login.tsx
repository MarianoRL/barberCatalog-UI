import React, { useEffect } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { Box } from '@mui/material';
import { useQuery, gql } from '@apollo/client';
import { BarberShop } from '../types';
import EnhancedHero from '../components/EnhancedHero';
import EnhancedCarousel from '../components/EnhancedCarousel';
import AOS from 'aos';
import 'aos/dist/aos.css';

const GET_FEATURED_BARBERSHOPS = gql`
  query GetBarberShops {
    barberShops {
      id
      name
      description
      address
      city
      state
      phone
      email
      avatar
      coverPhoto
      isActive
      averageRating
      totalRatings
      favoriteCount
    }
  }
`;

const Login: React.FC = () => {
  // Intersection observer for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.1 });
  
  // Initialize AOS animations
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 100
    });
  }, []);
  
  // Load featured barbershops data for carousel
  const { data: barbershopsData } = useQuery(GET_FEATURED_BARBERSHOPS);
  const barberShops: BarberShop[] = barbershopsData?.barberShops || [];

  // Spring animations
  const heroSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { 
      opacity: heroInView ? 1 : 0, 
      transform: heroInView ? 'translateY(0px)' : 'translateY(-50px)' 
    },
    config: { tension: 280, friction: 60 }
  });
  
  // Mock featured data for carousel
  const featuredItems = barberShops.slice(0, 6).map(shop => ({
    id: shop.id,
    title: shop.name,
    description: shop.description || 'Premium barber services with expert stylists.',
    image: shop.coverPhoto || shop.avatar || '/api/placeholder/400/300',
    avatar: shop.avatar,
    rating: shop.averageRating,
    reviewCount: shop.totalRatings,
    location: `${shop.city}, ${shop.state}`,
    badge: shop.isActive ? 'Open Now' : 'Closed',
    type: 'shop' as const
  }));


  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Enhanced Hero Section */}
      <Box ref={heroRef}>
        <animated.div style={heroSpring}>
          <EnhancedHero />
        </animated.div>
      </Box>
      
      {/* Featured Carousel */}
      {featuredItems.length > 0 && (
        <Box sx={{ py: 4 }}>
          <EnhancedCarousel
            items={featuredItems}
            title="Featured Barber Shops"
            subtitle="Discover the most popular and highly-rated barber shops in your area"
            type="featured"
            effect="coverflow"
            autoplay={true}
          />
        </Box>
      )}
    </Box>
  );
};

export default Login;