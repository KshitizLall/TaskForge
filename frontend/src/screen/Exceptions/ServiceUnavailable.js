import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const ServiceUnavailable = () => {
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
        background: '#ffebcc',
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
            background: 'linear-gradient(135deg, #f7b733 0%, #fc4a1a 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          503 Service Unavailable
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
          The server is currently unavailable. Please try again later.
        </Typography>
      </Box>
    </Box>
  );
};

export default ServiceUnavailable;
