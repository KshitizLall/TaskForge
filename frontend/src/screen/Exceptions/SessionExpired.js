import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const SessionExpired = () => {
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
        background: '#d4f4ff',
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
            background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Session Expired
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
          Your session has expired. Please log in again to continue.
        </Typography>
      </Box>
    </Box>
  );
};

export default SessionExpired;
