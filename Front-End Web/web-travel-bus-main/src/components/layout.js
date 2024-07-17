// src/components/layout.js
import React from 'react';
import { Box } from '@mui/material';
import Sidebar from './sidebar';

const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundImage: 'url(/wpp_1.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fondo blanco con transparencia
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
