import React from 'react';
import { Typography, Box } from '@mui/material';
import { motion } from 'framer-motion';

const BadRequest = () => {
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
        background: '#ffcccc',
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
            background: 'linear-gradient(135deg, #ff512f 0%, #dd2476 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          400 Bad Request
        </Typography>
        <Typography
          component={motion.p}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          variant="h5"
          sx={{
            fontSize: '1.5rem',
            color: '#ffffff',
            fontWeight: 600
          }}
        >
          The server could not understand the request due to invalid syntax.
        </Typography>
      </Box>
    </Box>
  );
};

export default BadRequest;
