import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const Unauthorized = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        textAlign: 'center',
        background: '#ffe6e6',
      }}
    >
      <Box>
        <Typography
          component={motion.h1}
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          variant="h1"
          sx={{
            fontSize: '4rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff416c 0%, #ff4b2b 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          401 Unauthorized
        </Typography>
        <Typography
          component={motion.p}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          variant="h5"
          sx={{
            fontSize: '1.5rem',
            color: '#000000',
            fontWeight: 600
          }}
        >
          You need to log in to access this resource.
        </Typography>
      </Box>
    </Box>
  );
};

export default Unauthorized;
