import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';
import { Box, Typography, Button, Container, Grid, Avatar, Card, CardContent } from '@mui/material';
import { LocationOn, Star, Verified, TrendingUp, Schedule, ContentCut } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';

// Lottie animation data for scissors (you can replace with actual Lottie files)
const scissorsAnimation = {
  v: "5.5.7",
  fr: 29.9700012207031,
  ip: 0,
  op: 90.0000036657751,
  w: 1920,
  h: 1080,
  nm: "Scissors",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Shape Layer",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] }, { t: 89.0000036657751, s: [360] }] },
      p: { a: 0, k: [960, 540, 0] },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [],
    ip: 0,
    op: 90.0000036657751,
    st: 0,
    bm: 0
  }]
};

const EnhancedHero: React.FC = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const [mounted, setMounted] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Parallax transforms
  const y1 = useTransform(scrollY, [0, 300], [0, 100]);
  const y2 = useTransform(scrollY, [0, 300], [0, -50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  // Intersection observers for animations
  const [heroRef, heroInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [statsRef, statsInView] = useInView({ triggerOnce: true, threshold: 0.3 });
  const [testimonialsRef, testimonialsInView] = useInView({ triggerOnce: true, threshold: 0.3 });

  // Spring animations
  const heroSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(100px) scale(0.9)' },
    to: { 
      opacity: heroInView ? 1 : 0, 
      transform: heroInView ? 'translateY(0px) scale(1)' : 'translateY(100px) scale(0.9)' 
    },
    config: { tension: 280, friction: 60 }
  });

  const statsSpring = useSpring({
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { 
      opacity: statsInView ? 1 : 0, 
      transform: statsInView ? 'translateX(0px)' : 'translateX(-50px)' 
    },
    config: { tension: 300, friction: 80 }
  });

  // Mock data for statistics
  const stats = [
    { icon: <ContentCut sx={{ fontSize: 40, color: '#C9A96E' }} />, number: '1000+', label: 'Happy Customers' },
    { icon: <Verified sx={{ fontSize: 40, color: '#C9A96E' }} />, number: '50+', label: 'Expert Barbers' },
    { icon: <LocationOn sx={{ fontSize: 40, color: '#C9A96E' }} />, number: '15+', label: 'Premium Locations' },
    { icon: <Star sx={{ fontSize: 40, color: '#C9A96E' }} />, number: '4.9', label: 'Average Rating' }
  ];

  // Mock testimonials data
  const testimonials = [
    {
      name: "Marcus Johnson",
      avatar: "/api/placeholder/60/60",
      rating: 5,
      text: "Absolutely incredible service! The attention to detail is unmatched.",
      location: "New York"
    },
    {
      name: "David Chen", 
      avatar: "/api/placeholder/60/60",
      rating: 5,
      text: "Best haircut I've ever had. The atmosphere is amazing!",
      location: "Los Angeles"
    },
    {
      name: "Alex Rivera",
      avatar: "/api/placeholder/60/60", 
      rating: 5,
      text: "Professional, clean, and stylish. Highly recommend!",
      location: "Chicago"
    }
  ];

  useEffect(() => {
    setMounted(true);
    
    // Auto-rotate testimonials
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (!mounted) return null;

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `
        linear-gradient(135deg, 
          rgba(10, 10, 10, 0.95) 0%, 
          rgba(22, 22, 22, 0.9) 25%,
          rgba(201, 169, 110, 0.15) 50%,
          rgba(22, 22, 22, 0.9) 75%, 
          rgba(10, 10, 10, 0.95) 100%
        ),
        radial-gradient(ellipse at 20% 50%, rgba(201, 169, 110, 0.3) 0%, transparent 50%),
        radial-gradient(ellipse at 80% 20%, rgba(228, 196, 154, 0.2) 0%, transparent 50%),
        linear-gradient(135deg, #0A0A0A 0%, #161616 100%)
      `,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Elements */}
      <motion.div
        style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          width: 200,
          height: 200,
          y: y1,
          opacity: 0.1,
        }}
      >
        <Lottie 
          animationData={scissorsAnimation}
          style={{ width: '100%', height: '100%' }}
        />
      </motion.div>

      <motion.div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: 150,
          height: 150,
          y: y2,
          opacity: 0.05,
        }}
      >
        <Box
          sx={{
            width: '100%',
            height: '100%',
            background: 'linear-gradient(45deg, #C9A96E, #E4C49A)',
            borderRadius: '50%',
            filter: 'blur(20px)',
            animation: 'float 6s ease-in-out infinite'
          }}
        />
      </motion.div>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        {/* Hero Section */}
        <animated.div ref={heroRef} style={heroSpring}>
          <Box
            sx={{
              pt: { xs: 8, md: 12 },
              pb: { xs: 6, md: 8 },
              textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                  fontWeight: 800,
                  mb: 3,
                  background: 'linear-gradient(135deg, #FAFAFA 0%, #C9A96E 50%, #E4C49A 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 4px 20px rgba(201, 169, 110, 0.3)',
                  letterSpacing: '-0.02em',
                  lineHeight: { xs: 1.1, md: 1.05 }
                }}
              >
                Discover Your Perfect
                <Box component="span" sx={{ display: 'block', mt: 1 }}>
                  <motion.span
                    animate={{ 
                      background: [
                        'linear-gradient(135deg, #C9A96E 0%, #E4C49A 100%)',
                        'linear-gradient(135deg, #E4C49A 0%, #C9A96E 100%)',
                        'linear-gradient(135deg, #C9A96E 0%, #E4C49A 100%)'
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent'
                    }}
                  >
                    Barber Experience
                  </motion.span>
                </Box>
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Typography
                variant="h5"
                sx={{
                  color: '#B8B8B8',
                  mb: 4,
                  maxWidth: 600,
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.3rem' },
                  fontWeight: 400,
                  lineHeight: 1.6
                }}
              >
                Connect with premium barbers, book appointments instantly, and transform your style with our cutting-edge platform
              </Typography>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap', mb: 6 }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/barbershops')}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #C9A96E 0%, #E4C49A 50%, #C9A96E 100%)',
                      boxShadow: '0 12px 48px rgba(201, 169, 110, 0.4), 0 0 0 1px rgba(201, 169, 110, 0.2)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                        transition: 'left 0.6s ease',
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #A8864C 0%, #C9A96E 50%, #A8864C 100%)',
                        boxShadow: '0 20px 64px rgba(201, 169, 110, 0.6)',
                        transform: 'translateY(-4px)',
                        '&::before': {
                          left: '100%',
                        }
                      }
                    }}
                  >
                    Explore Barbers
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      px: 4,
                      py: 2,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: '50px',
                      borderWidth: '2px',
                      borderColor: '#C9A96E',
                      color: '#C9A96E',
                      backgroundColor: 'rgba(201, 169, 110, 0.1)',
                      backdropFilter: 'blur(20px)',
                      '&:hover': {
                        borderColor: '#E4C49A',
                        backgroundColor: 'rgba(201, 169, 110, 0.2)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 48px rgba(201, 169, 110, 0.3)'
                      }
                    }}
                  >
                    Join Now
                  </Button>
                </motion.div>
              </Box>
            </motion.div>
          </Box>
        </animated.div>

        {/* Statistics Section */}
        <animated.div ref={statsRef} style={statsSpring}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: statsInView ? 1 : 0, y: statsInView ? 0 : 50 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Grid container spacing={4} sx={{ mb: 8 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ 
                      opacity: statsInView ? 1 : 0, 
                      scale: statsInView ? 1 : 0.8 
                    }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card
                      sx={{
                        textAlign: 'center',
                        p: 3,
                        background: 'rgba(201, 169, 110, 0.05)',
                        border: '1px solid rgba(201, 169, 110, 0.2)',
                        borderRadius: '20px',
                        backdropFilter: 'blur(20px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(201, 169, 110, 0.1)',
                          border: '1px solid rgba(201, 169, 110, 0.3)',
                          boxShadow: '0 16px 64px rgba(201, 169, 110, 0.2)',
                        }
                      }}
                    >
                      <Box sx={{ mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          color: '#FAFAFA',
                          fontWeight: 700,
                          mb: 1
                        }}
                      >
                        {stat.number}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: '#B8B8B8',
                          fontWeight: 500
                        }}
                      >
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </animated.div>

        {/* Testimonials Section */}
        <Box ref={testimonialsRef} sx={{ mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ 
              opacity: testimonialsInView ? 1 : 0, 
              y: testimonialsInView ? 0 : 30 
            }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                mb: 6,
                color: '#FAFAFA',
                fontWeight: 600
              }}
            >
              What Our Clients Say
            </Typography>

            <Box sx={{ maxWidth: 800, mx: 'auto', position: 'relative', height: 200 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                  style={{ position: 'absolute', width: '100%' }}
                >
                  <Card
                    sx={{
                      p: 4,
                      textAlign: 'center',
                      background: 'rgba(201, 169, 110, 0.08)',
                      border: '1px solid rgba(201, 169, 110, 0.2)',
                      borderRadius: '24px',
                      backdropFilter: 'blur(20px)'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} sx={{ color: '#C9A96E', fontSize: 28 }} />
                      ))}
                    </Box>
                    
                    <Typography
                      variant="h6"
                      sx={{
                        color: '#FAFAFA',
                        mb: 3,
                        fontStyle: 'italic',
                        lineHeight: 1.6
                      }}
                    >
                      "{testimonials[currentTestimonial].text}"
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                      <Avatar
                        src={testimonials[currentTestimonial].avatar}
                        sx={{ width: 50, height: 50 }}
                      />
                      <Box>
                        <Typography variant="body1" sx={{ color: '#FAFAFA', fontWeight: 600 }}>
                          {testimonials[currentTestimonial].name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                          {testimonials[currentTestimonial].location}
                        </Typography>
                      </Box>
                    </Box>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* Testimonial Indicators */}
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
              {testimonials.map((_, index) => (
                <motion.div
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: index === currentTestimonial ? '#C9A96E' : 'rgba(201, 169, 110, 0.3)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </Box>
          </motion.div>
        </Box>
      </Container>

      {/* Floating Elements */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0, -5, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          top: '15%',
          left: '5%',
          width: 60,
          height: 60,
          background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
          borderRadius: '50%',
          opacity: 0.1,
          filter: 'blur(1px)'
        }}
      />

      <motion.div
        animate={{
          y: [0, 15, 0],
          x: [0, 10, 0]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '8%',
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #E4C49A, #C9A96E)',
          borderRadius: '50%',
          opacity: 0.08,
          filter: 'blur(2px)'
        }}
      />

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </Box>
  );
};

export default EnhancedHero;