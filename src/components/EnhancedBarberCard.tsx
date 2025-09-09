import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { Tilt } from 'react-tilt';
import { useInView } from 'react-intersection-observer';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Button,
  Avatar,
  Chip,
  Rating,
  IconButton,
  Backdrop,
  Dialog,
  DialogContent,
  Fab,
  Zoom,
  Slide
} from '@mui/material';
import {
  LocationOn,
  Star,
  Favorite,
  FavoriteBorder,
  BookOnline,
  Phone,
  Email,
  Instagram,
  Facebook,
  Close,
  ContentCut,
  Schedule,
  TrendingUp,
  Verified
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { BarberShop } from '../types';
import toast from 'react-hot-toast';
import ConfettiExplosion from 'react-confetti-explosion';

interface EnhancedBarberCardProps {
  shop: BarberShop;
  index: number;
  onFavoriteToggle?: (shopId: string) => void;
  isFavorite?: boolean;
}

const EnhancedBarberCard: React.FC<EnhancedBarberCardProps> = ({
  shop,
  index,
  onFavoriteToggle,
  isFavorite = false
}) => {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
    rootMargin: '100px'
  });

  // Tilt options
  const tiltOptions = {
    reverse: false,
    max: 15,
    perspective: 1000,
    scale: 1.02,
    speed: 1000,
    transition: true,
    axis: null,
    reset: true,
    easing: "cubic-bezier(.03,.98,.52,.99)"
  };

  // Spring animations for hover effects
  const cardSpring = useSpring({
    transform: isHovered
      ? 'translateY(-12px) rotateX(5deg)'
      : 'translateY(0px) rotateX(0deg)',
    boxShadow: isHovered
      ? '0 32px 80px rgba(201, 169, 110, 0.4), 0 16px 64px rgba(0,0,0,0.6)'
      : '0 16px 64px rgba(0,0,0,0.4), 0 8px 32px rgba(0,0,0,0.3)',
    config: { tension: 300, friction: 30 }
  });

  // Loading animation spring
  const loadingSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.8) translateY(50px)' },
    to: {
      opacity: inView ? 1 : 0,
      transform: inView ? 'scale(1) translateY(0px)' : 'scale(0.8) translateY(50px)'
    },
    delay: index * 100,
    config: { tension: 280, friction: 60 }
  });

  const handleCardClick = () => {
    navigate(`/barbershops/${shop.id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onFavoriteToggle) {
      onFavoriteToggle(shop.id);
      if (!isFavorite) {
        setShowConfetti(true);
        toast.success('Added to favorites! ❤️', {
          duration: 3000,
          style: {
            background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
            color: '#121212',
            borderRadius: '20px',
            fontWeight: 600,
            boxShadow: '0 8px 32px rgba(201, 169, 110, 0.4)'
          }
        });
        setTimeout(() => setShowConfetti(false), 2000);
      }
    }
  };

  const handleQuickBook = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/barbershops/${shop.id}?book=true`);
    toast.success('Redirecting to booking...', {
      style: {
        background: 'linear-gradient(135deg, #66bb6a, #81c784)',
        color: 'white',
        borderRadius: '20px',
        fontWeight: 600
      }
    });
  };

  const QuickViewDialog = () => (
    <Dialog
      open={showQuickView}
      onClose={() => setShowQuickView(false)}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
          border: '1px solid rgba(201, 169, 110, 0.2)',
          overflow: 'hidden'
        }
      }}
      TransitionComponent={Slide}
    >
      <DialogContent sx={{ p: 0, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={() => setShowQuickView(false)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            '&:hover': {
              background: 'rgba(0,0,0,0.9)'
            }
          }}
        >
          <Close />
        </IconButton>

        {/* Hero Image */}
        <Box
          sx={{
            height: 300,
            background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(201, 169, 110, 0.2)), url(${shop.coverPhoto || shop.avatar})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'end',
            p: 3
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={shop.avatar}
              sx={{
                width: 80,
                height: 80,
                border: '3px solid #C9A96E',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
              }}
            />
            <Box>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                {shop.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#C9A96E', fontSize: 20 }} />
                <Typography variant="body1" sx={{ color: 'white' }}>
                  {shop.city}, {shop.state}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Rating value={shop.averageRating || 0} readOnly precision={0.1} />
              <Typography variant="body2" sx={{ color: '#B8B8B8' }}>
                ({shop.totalRatings || 0} reviews)
              </Typography>
            </Box>
            <Chip
              label={shop.isActive ? 'Open Now' : 'Closed'}
              color={shop.isActive ? 'success' : 'error'}
              sx={{ fontWeight: 600 }}
            />
          </Box>

          <Typography variant="body1" sx={{ color: '#FAFAFA', mb: 3, lineHeight: 1.6 }}>
            {shop.description || 'Premium barber services with expert stylists and modern techniques.'}
          </Typography>

          {/* Quick Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#C9A96E', fontWeight: 700 }}>
                {shop.favoriteCount || 0}
              </Typography>
              <Typography variant="caption" sx={{ color: '#B8B8B8' }}>
                Favorites
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#C9A96E', fontWeight: 700 }}>
                5+
              </Typography>
              <Typography variant="caption" sx={{ color: '#B8B8B8' }}>
                Services
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" sx={{ color: '#C9A96E', fontWeight: 700 }}>
                {shop.averageRating?.toFixed(1) || 'N/A'}
              </Typography>
              <Typography variant="caption" sx={{ color: '#B8B8B8' }}>
                Rating
              </Typography>
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              fullWidth
              startIcon={<BookOnline />}
              onClick={() => {
                setShowQuickView(false);
                handleQuickBook({ stopPropagation: () => {} } as any);
              }}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              Book Now
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setShowQuickView(false);
                handleCardClick();
              }}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                borderColor: '#C9A96E',
                color: '#C9A96E',
                fontWeight: 600,
                fontSize: '1rem'
              }}
            >
              View Details
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      <animated.div ref={ref} style={loadingSpring}>
        <Tilt options={tiltOptions}>
          <animated.div style={cardSpring}>
            <Card
              sx={{
                height: '100%',
                width: '100%',
                cursor: 'pointer',
                borderRadius: '24px',
                overflow: 'hidden',
                background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
                border: '1px solid rgba(201, 169, 110, 0.15)',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: 'linear-gradient(90deg, transparent, #C9A96E, #E4C49A, #C9A96E, transparent)',
                  opacity: isHovered ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none'
                }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={handleCardClick}
            >
              {/* Confetti Effect */}
              {showConfetti && (
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', zIndex: 1000 }}>
                  <ConfettiExplosion
                    force={0.6}
                    duration={2000}
                    particleCount={50}
                    width={400}
                    colors={['#C9A96E', '#E4C49A', '#FAFAFA']}
                  />
                </Box>
              )}

              {/* Image Section */}
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={shop.coverPhoto || shop.avatar || '/api/placeholder/400/200'}
                    alt={shop.name}
                    sx={{
                      objectFit: 'cover',
                      filter: isHovered ? 'brightness(1.1) contrast(1.1)' : 'brightness(1)',
                      transition: 'all 0.4s ease'
                    }}
                  />
                </motion.div>

                {/* Overlay Elements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    display: 'flex',
                    gap: 8
                  }}
                >
                  <IconButton
                    onClick={handleFavoriteClick}
                    sx={{
                      background: 'rgba(0,0,0,0.7)',
                      color: isFavorite ? '#ff6b6b' : 'white',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: 'rgba(0,0,0,0.9)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    {isFavorite ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>

                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickView(true);
                    }}
                    sx={{
                      background: 'rgba(201, 169, 110, 0.9)',
                      color: '#121212',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: 'rgba(201, 169, 110, 1)',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ContentCut />
                  </IconButton>
                </motion.div>

                {/* Status Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16
                  }}
                >
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                  >
                    <Chip
                      icon={shop.isActive ? <Verified /> : <Schedule />}
                      label={shop.isActive ? 'Open' : 'Closed'}
                      size="small"
                      sx={{
                        background: shop.isActive
                          ? 'linear-gradient(135deg, #66bb6a, #81c784)'
                          : 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                        '& .MuiChip-icon': { color: 'white' }
                      }}
                    />
                  </motion.div>
                </Box>
              </Box>

              {/* Content Section */}
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{
                      color: '#FAFAFA',
                      fontWeight: 700,
                      fontSize: '1.35rem',
                      mb: 2,
                      background: isHovered
                        ? 'linear-gradient(135deg, #C9A96E, #E4C49A)'
                        : 'none',
                      backgroundClip: isHovered ? 'text' : 'unset',
                      WebkitBackgroundClip: isHovered ? 'text' : 'unset',
                      WebkitTextFillColor: isHovered ? 'transparent' : '#FAFAFA',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {shop.name}
                  </Typography>
                </motion.div>

                {/* Location */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={2}>
                    <LocationOn
                      fontSize="small"
                      sx={{
                        color: '#C9A96E',
                        transition: 'transform 0.3s ease',
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#B8B8B8',
                        fontWeight: 500
                      }}
                    >
                      {shop.address}, {shop.city}, {shop.state}
                    </Typography>
                  </Box>
                </motion.div>

                {/* Rating */}
                {shop.averageRating && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <Rating
                        value={shop.averageRating}
                        readOnly
                        precision={0.1}
                        size="small"
                        sx={{
                          '& .MuiRating-iconFilled': {
                            color: '#C9A96E',
                            filter: 'drop-shadow(0 2px 4px rgba(201, 169, 110, 0.3))'
                          },
                          '& .MuiRating-iconEmpty': {
                            color: 'rgba(201, 169, 110, 0.3)'
                          }
                        }}
                      />
                      <Typography variant="body2" sx={{ color: '#B8B8B8', fontWeight: 500 }}>
                        {shop.averageRating.toFixed(1)} ({shop.totalRatings} reviews)
                      </Typography>
                    </Box>
                  </motion.div>
                )}

                {/* Description */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: '#B8B8B8',
                      flex: 1,
                      mb: 3,
                      lineHeight: 1.6,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical'
                    }}
                  >
                    {shop.description || 'Professional barber services with expert stylists.'}
                  </Typography>
                </motion.div>

                {/* Action Area */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                >
                  <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<BookOnline />}
                            onClick={handleQuickBook}
                            sx={{
                              background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                              color: '#121212',
                              fontWeight: 600,
                              borderRadius: '20px',
                              px: 3,
                              py: 1,
                              boxShadow: '0 8px 24px rgba(201, 169, 110, 0.4)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #A8864C, #C9A96E)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 12px 32px rgba(201, 169, 110, 0.6)'
                              }
                            }}
                          >
                            Quick Book
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {shop.favoriteCount && shop.favoriteCount > 0 && (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Chip
                          icon={<Favorite sx={{ color: '#C9A96E !important' }} />}
                          label={shop.favoriteCount}
                          size="small"
                          sx={{
                            backgroundColor: 'rgba(201, 169, 110, 0.15)',
                            color: '#C9A96E',
                            border: '1px solid rgba(201, 169, 110, 0.3)',
                            fontWeight: 600,
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              backgroundColor: 'rgba(201, 169, 110, 0.25)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        />
                      </motion.div>
                    )}
                  </Box>
                </motion.div>
              </CardContent>
            </Card>
          </animated.div>
        </Tilt>
      </animated.div>

      <QuickViewDialog />
    </>
  );
};

export default EnhancedBarberCard;