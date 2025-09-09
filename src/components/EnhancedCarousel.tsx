import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectCoverflow, Parallax, EffectFade } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import {
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Avatar,
  Rating,
  Container,
  Chip,
  Button
} from '@mui/material';
import {
  ArrowBackIos,
  ArrowForwardIos,
  Star,
  LocationOn,
  ContentCut,
  Schedule,
  Verified,
  TrendingUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-coverflow';
import 'swiper/css/parallax';
import 'swiper/css/effect-fade';

interface CarouselItem {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  location?: string;
  badge?: string;
  type?: 'barber' | 'shop' | 'service' | 'testimonial';
}

interface EnhancedCarouselProps {
  items: CarouselItem[];
  title: string;
  subtitle?: string;
  type?: 'featured' | 'testimonials' | 'services' | 'barbers';
  autoplay?: boolean;
  effect?: 'slide' | 'coverflow' | 'fade' | 'cards';
}

const EnhancedCarousel: React.FC<EnhancedCarouselProps> = ({
  items,
  title,
  subtitle,
  type = 'featured',
  autoplay = true,
  effect = 'coverflow'
}) => {
  const navigate = useNavigate();
  const swiperRef = useRef<any>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2
  });

  // Spring animations
  const titleSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { 
      opacity: inView ? 1 : 0, 
      transform: inView ? 'translateY(0px)' : 'translateY(50px)' 
    },
    config: { tension: 280, friction: 60 }
  });

  const carouselSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { 
      opacity: inView ? 1 : 0, 
      transform: inView ? 'scale(1)' : 'scale(0.95)' 
    },
    delay: 200,
    config: { tension: 200, friction: 25 }
  });

  const getSwiperConfig = () => {
    const baseConfig = {
      modules: [Navigation, Pagination, Autoplay, EffectCoverflow, Parallax, EffectFade],
      spaceBetween: 30,
      grabCursor: true,
      onSlideChange: (swiper: any) => setActiveSlide(swiper.activeIndex),
      onSwiper: (swiper: any) => {
        swiperRef.current = swiper;
      },
    };

    switch (effect) {
      case 'coverflow':
        return {
          ...baseConfig,
          effect: 'coverflow',
          centeredSlides: true,
          slidesPerView: 'auto' as const,
          coverflowEffect: {
            rotate: 15,
            stretch: 0,
            depth: 200,
            modifier: 2,
            slideShadows: true,
          },
          breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          },
        };
      
      case 'fade':
        return {
          ...baseConfig,
          effect: 'fade',
          slidesPerView: 1,
          fadeEffect: { crossFade: true },
        };
      
      case 'cards':
        return {
          ...baseConfig,
          slidesPerView: 'auto' as const,
          centeredSlides: true,
          effect: 'slide',
          breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          },
        };
      
      default:
        return {
          ...baseConfig,
          slidesPerView: 'auto' as const,
          breakpoints: {
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          },
        };
    }
  };

  const renderSlideContent = (item: CarouselItem, index: number) => {
    const isActive = index === activeSlide;
    
    if (type === 'testimonials') {
      return (
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -5 }}
        >
          <Card
            sx={{
              height: 320,
              p: 4,
              textAlign: 'center',
              background: `
                linear-gradient(135deg, 
                  rgba(201, 169, 110, 0.1) 0%, 
                  rgba(22, 22, 22, 0.95) 100%
                ),
                url(${item.image})
              `,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '24px',
              border: '1px solid rgba(201, 169, 110, 0.2)',
              position: 'relative',
              overflow: 'hidden',
              transform: isActive ? 'scale(1.05)' : 'scale(1)',
              transition: 'all 0.4s ease',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(22, 22, 22, 0.8)',
                pointerEvents: 'none'
              }
            }}
          >
            <CardContent sx={{ position: 'relative', zIndex: 2, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ mb: 3 }}>
                <Rating
                  value={item.rating || 5}
                  readOnly
                  sx={{
                    '& .MuiRating-iconFilled': { color: '#C9A96E' },
                    '& .MuiRating-iconEmpty': { color: 'rgba(201, 169, 110, 0.3)' }
                  }}
                />
              </Box>
              
              <Typography
                variant="h6"
                sx={{
                  color: '#FAFAFA',
                  fontStyle: 'italic',
                  lineHeight: 1.6,
                  mb: 3,
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                "{item.description}"
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                <Avatar
                  src={item.avatar}
                  sx={{
                    width: 50,
                    height: 50,
                    border: '2px solid #C9A96E'
                  }}
                />
                <Box>
                  <Typography variant="body1" sx={{ color: '#FAFAFA', fontWeight: 600 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                    {item.location}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      );
    }

    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ scale: 1.02, y: -8 }}
      >
        <Card
          sx={{
            height: 400,
            cursor: 'pointer',
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
            border: '1px solid rgba(201, 169, 110, 0.15)',
            position: 'relative',
            transform: isActive ? 'scale(1.05)' : 'scale(1)',
            boxShadow: isActive 
              ? '0 32px 80px rgba(201, 169, 110, 0.3), 0 16px 64px rgba(0,0,0,0.6)'
              : '0 16px 64px rgba(0,0,0,0.4)',
            transition: 'all 0.6s cubic-bezier(0.25, 0.8, 0.25, 1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #C9A96E, #E4C49A, #C9A96E, transparent)',
              opacity: isActive ? 1 : 0,
              transition: 'opacity 0.3s ease',
              pointerEvents: 'none'
            }
          }}
          onClick={() => navigate(`/${type}/${item.id}`)}
        >
          {/* Image Section */}
          <Box
            sx={{
              height: 200,
              background: `linear-gradient(135deg, rgba(0,0,0,0.3), rgba(201, 169, 110, 0.2)), url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              display: 'flex',
              alignItems: 'flex-end',
              p: 2
            }}
          >
            {item.badge && (
              <Chip
                label={item.badge}
                size="small"
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                  color: '#121212',
                  fontWeight: 600,
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}
              />
            )}
            
            {item.avatar && (
              <Avatar
                src={item.avatar}
                sx={{
                  width: 60,
                  height: 60,
                  border: '3px solid #C9A96E',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
                }}
              />
            )}
          </Box>

          {/* Content Section */}
          <CardContent sx={{ flex: 1, p: 3 }}>
            <Typography
              variant="h6"
              sx={{
                color: '#FAFAFA',
                fontWeight: 700,
                mb: 1,
                background: isActive 
                  ? 'linear-gradient(135deg, #C9A96E, #E4C49A)'
                  : 'none',
                backgroundClip: isActive ? 'text' : 'unset',
                WebkitBackgroundClip: isActive ? 'text' : 'unset',
                WebkitTextFillColor: isActive ? 'transparent' : '#FAFAFA',
                transition: 'all 0.3s ease'
              }}
            >
              {item.title}
            </Typography>

            {item.subtitle && (
              <Typography variant="body2" sx={{ color: '#B8B8B8', mb: 2 }}>
                {item.subtitle}
              </Typography>
            )}

            {item.location && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <LocationOn fontSize="small" sx={{ color: '#C9A96E' }} />
                <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                  {item.location}
                </Typography>
              </Box>
            )}

            {item.rating && (
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <Rating
                  value={item.rating}
                  readOnly
                  precision={0.1}
                  size="small"
                  sx={{
                    '& .MuiRating-iconFilled': { color: '#C9A96E' },
                    '& .MuiRating-iconEmpty': { color: 'rgba(201, 169, 110, 0.3)' }
                  }}
                />
                <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                  ({item.reviewCount} reviews)
                </Typography>
              </Box>
            )}

            <Typography
              variant="body2"
              sx={{
                color: '#B8B8B8',
                lineHeight: 1.6,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical'
              }}
            >
              {item.description}
            </Typography>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <Box ref={ref} sx={{ py: 8 }}>
      <Container maxWidth="lg">
        {/* Header */}
        <animated.div style={titleSpring}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 30 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h3"
                sx={{
                  color: '#FAFAFA',
                  fontWeight: 700,
                  mb: 2,
                  background: 'linear-gradient(135deg, #FAFAFA 0%, #C9A96E 50%, #E4C49A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {title}
              </Typography>
            </motion.div>

            {subtitle && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#B8B8B8',
                    fontWeight: 400,
                    maxWidth: 600,
                    mx: 'auto'
                  }}
                >
                  {subtitle}
                </Typography>
              </motion.div>
            )}
          </Box>
        </animated.div>

        {/* Carousel */}
        <animated.div style={carouselSpring}>
          <Box sx={{ position: 'relative' }}>
            {/* Custom Navigation Buttons */}
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: -60,
                transform: 'translateY(-50%)',
                zIndex: 10
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={() => swiperRef.current?.slidePrev()}
                  sx={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                    color: '#121212',
                    boxShadow: '0 8px 32px rgba(201, 169, 110, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #A8864C, #C9A96E)',
                      boxShadow: '0 12px 48px rgba(201, 169, 110, 0.6)'
                    }
                  }}
                >
                  <ArrowBackIos />
                </IconButton>
              </motion.div>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                right: -60,
                transform: 'translateY(-50%)',
                zIndex: 10
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <IconButton
                  onClick={() => swiperRef.current?.slideNext()}
                  sx={{
                    width: 50,
                    height: 50,
                    background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                    color: '#121212',
                    boxShadow: '0 8px 32px rgba(201, 169, 110, 0.4)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #A8864C, #C9A96E)',
                      boxShadow: '0 12px 48px rgba(201, 169, 110, 0.6)'
                    }
                  }}
                >
                  <ArrowForwardIos />
                </IconButton>
              </motion.div>
            </Box>

            {/* Swiper Component */}
            <Swiper
              {...getSwiperConfig()}
              autoplay={autoplay ? {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true
              } : false}
              pagination={{
                clickable: true,
                renderBullet: (index: number, className: string) =>
                  `<span class="${className}" style="
                    background: #C9A96E;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    display: inline-block;
                    margin: 0 4px;
                    transition: all 0.3s ease;
                    cursor: pointer;
                  "></span>`,
              }}
              style={{
                padding: '20px 0 60px 0',
              }}
            >
              {items.map((item, index) => (
                <SwiperSlide key={item.id} style={{ width: 'auto', maxWidth: effect === 'coverflow' ? '350px' : '100%' }}>
                  {renderSlideContent(item, index)}
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom Pagination Dots */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                gap: 1,
                mt: 4
              }}
            >
              {items.map((_, index) => (
                <motion.div
                  key={index}
                  onClick={() => swiperRef.current?.slideTo(index)}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === activeSlide ? '#C9A96E' : 'rgba(201, 169, 110, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                />
              ))}
            </Box>
          </Box>
        </animated.div>
      </Container>
    </Box>
  );
};

export default EnhancedCarousel;