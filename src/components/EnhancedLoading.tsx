import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Box, Grid, Card, CardContent, Container, Typography } from '@mui/material';
import Lottie from 'lottie-react';

// Simple loading animation data
const loadingAnimation = {
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Loading",
  ddd: 0,
  assets: [],
  layers: [{
    ddd: 0,
    ind: 1,
    ty: 4,
    nm: "Circle",
    sr: 1,
    ks: {
      o: { a: 0, k: 100 },
      r: { a: 1, k: [{ t: 0, s: [0] }, { t: 59, s: [360] }] },
      p: { a: 0, k: [100, 100, 0] },
      s: { a: 0, k: [100, 100, 100] }
    },
    ao: 0,
    shapes: [],
    ip: 0,
    op: 60,
    st: 0,
    bm: 0
  }]
};

interface EnhancedLoadingProps {
  type?: 'cards' | 'hero' | 'fullscreen' | 'list';
  count?: number;
  message?: string;
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  type = 'cards',
  count = 6,
  message = 'Loading amazing barbers...'
}) => {
  // Spring animation for the main container
  const containerSpring = useSpring({
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { tension: 200, friction: 25 }
  });

  // Floating animation
  const floatingSpring = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-10px)' });
        await next({ transform: 'translateY(0px)' });
      }
    },
    config: { duration: 2000 }
  });

  const SkeletonCard = ({ index }: { index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: '24px',
          background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
          border: '1px solid rgba(201, 169, 110, 0.15)',
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(201, 169, 110, 0.1), transparent)',
            animation: 'shimmer 2s infinite',
            pointerEvents: 'none'
          }
        }}
      >
        {/* Image skeleton */}
        <Box sx={{ height: 200, position: 'relative', overflow: 'hidden' }}>
          <Skeleton
            height="100%"
            width="100%"
            baseColor="#1a1a1a"
            highlightColor="#2d2d2d"
            style={{ display: 'block' }}
          />
        </Box>

        <CardContent sx={{ p: 3 }}>
          {/* Title skeleton */}
          <Skeleton
            height={28}
            width="80%"
            baseColor="#1a1a1a"
            highlightColor="#2d2d2d"
            style={{ marginBottom: 16 }}
          />

          {/* Location skeleton */}
          <Skeleton
            height={16}
            width="60%"
            baseColor="#1a1a1a"
            highlightColor="#2d2d2d"
            style={{ marginBottom: 12 }}
          />

          {/* Rating skeleton */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Skeleton
              height={20}
              width={100}
              baseColor="#1a1a1a"
              highlightColor="#2d2d2d"
            />
            <Skeleton
              height={16}
              width={80}
              baseColor="#1a1a1a"
              highlightColor="#2d2d2d"
            />
          </Box>

          {/* Description skeleton */}
          <Skeleton
            height={16}
            count={2}
            baseColor="#1a1a1a"
            highlightColor="#2d2d2d"
            style={{ marginBottom: 8 }}
          />

          {/* Button skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
            <Skeleton
              height={36}
              width={120}
              baseColor="#1a1a1a"
              highlightColor="#2d2d2d"
              style={{ borderRadius: 18 }}
            />
            <Skeleton
              height={32}
              width={60}
              baseColor="#1a1a1a"
              highlightColor="#2d2d2d"
              style={{ borderRadius: 16 }}
            />
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const HeroSkeleton = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', py: 8 }}>
          {/* Title skeleton */}
          <Skeleton
            height={80}
            width="70%"
            baseColor="#1a1a1a"
            highlightColor="#2d2d2d"
            style={{ margin: '0 auto 24px', borderRadius: 8 }}
          />

          {/* Subtitle skeleton */}
          <Skeleton
            height={24}
            width="50%"
            baseColor="#1a1a1a"
            highlightColor="#2d2d2d"
            style={{ margin: '0 auto 32px', borderRadius: 4 }}
          />

          {/* Buttons skeleton */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, mb: 6 }}>
            <Skeleton
              height={56}
              width={180}
              baseColor="#1a1a1a"
              highlightColor="#2d2d2d"
              style={{ borderRadius: 28 }}
            />
            <Skeleton
              height={56}
              width={140}
              baseColor="#1a1a1a"
              highlightColor="#2d2d2d"
              style={{ borderRadius: 28 }}
            />
          </Box>

          {/* Stats skeleton */}
          <Grid container spacing={4}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={6} md={3} key={item}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: item * 0.1, duration: 0.6 }}
                >
                  <Box sx={{ textAlign: 'center', p: 3 }}>
                    <Skeleton
                      height={40}
                      width={40}
                      baseColor="#1a1a1a"
                      highlightColor="#2d2d2d"
                      style={{ margin: '0 auto 16px', borderRadius: '50%' }}
                    />
                    <Skeleton
                      height={32}
                      width="60%"
                      baseColor="#1a1a1a"
                      highlightColor="#2d2d2d"
                      style={{ margin: '0 auto 8px', borderRadius: 4 }}
                    />
                    <Skeleton
                      height={16}
                      width="80%"
                      baseColor="#1a1a1a"
                      highlightColor="#2d2d2d"
                      style={{ margin: '0 auto', borderRadius: 4 }}
                    />
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );

  const FullscreenLoader = () => (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(135deg, 
            rgba(10, 10, 10, 0.95) 0%, 
            rgba(22, 22, 22, 0.9) 25%,
            rgba(201, 169, 110, 0.15) 50%,
            rgba(22, 22, 22, 0.9) 75%, 
            rgba(10, 10, 10, 0.95) 100%
          )
        `,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <animated.div style={containerSpring}>
        <Box sx={{ textAlign: 'center' }}>
          {/* Animated Lottie */}
          <animated.div style={floatingSpring}>
            <Box sx={{ width: 120, height: 120, mx: 'auto', mb: 4 }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 20px 60px rgba(201, 169, 110, 0.4)',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 4,
                      left: 4,
                      right: 4,
                      bottom: 4,
                      background: '#161616',
                      borderRadius: '50%'
                    }
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{
                      color: '#C9A96E',
                      fontWeight: 700,
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    ✂
                  </Typography>
                </Box>
              </motion.div>
            </Box>
          </animated.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#FAFAFA',
                fontWeight: 600,
                mb: 2,
                background: 'linear-gradient(135deg, #C9A96E, #E4C49A)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {message}
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Typography
              variant="body1"
              sx={{
                color: '#B8B8B8',
                fontWeight: 400
              }}
            >
              Preparing your premium experience
            </Typography>
          </motion.div>

          {/* Loading dots */}
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 4 }}>
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 1, 0.3]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: index * 0.2
                }}
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: '#C9A96E'
                }}
              />
            ))}
          </Box>
        </Box>
      </animated.div>
    </Box>
  );

  if (type === 'fullscreen') {
    return <FullscreenLoader />;
  }

  if (type === 'hero') {
    return (
      <animated.div style={containerSpring}>
        <HeroSkeleton />
      </animated.div>
    );
  }

  if (type === 'list') {
    return (
      <animated.div style={containerSpring}>
        <Box sx={{ space: 2 }}>
          {Array.from({ length: count }).map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Card
                sx={{
                  p: 3,
                  mb: 2,
                  background: 'linear-gradient(145deg, #161616 0%, #1a1a1a 100%)',
                  border: '1px solid rgba(201, 169, 110, 0.15)',
                  borderRadius: '16px'
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Skeleton
                    height={60}
                    width={60}
                    baseColor="#1a1a1a"
                    highlightColor="#2d2d2d"
                    style={{ borderRadius: '50%' }}
                  />
                  <Box sx={{ flex: 1 }}>
                    <Skeleton
                      height={24}
                      width="70%"
                      baseColor="#1a1a1a"
                      highlightColor="#2d2d2d"
                      style={{ marginBottom: 8 }}
                    />
                    <Skeleton
                      height={16}
                      width="90%"
                      baseColor="#1a1a1a"
                      highlightColor="#2d2d2d"
                    />
                  </Box>
                </Box>
              </Card>
            </motion.div>
          ))}
        </Box>
      </animated.div>
    );
  }

  // Default: cards
  return (
    <animated.div style={containerSpring}>
      <Grid container spacing={3}>
        {Array.from({ length: count }).map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <SkeletonCard index={index} />
          </Grid>
        ))}
      </Grid>

      {/* Custom CSS for shimmer effect */}
      <style>{`
        @keyframes shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }
      `}</style>
    </animated.div>
  );
};

export default EnhancedLoading;