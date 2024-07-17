import * as React from 'react';
import { Box, Grid, Paper, Typography, useTheme } from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PeopleIcon from '@mui/icons-material/People';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import BarChartIcon from '@mui/icons-material/BarChart';
import Layout from '../../components/layout';

const Dashboard = () => {
  const theme = useTheme();

  return (
    <Layout>
      <Typography variant="h4" gutterBottom>
        Inicio
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">Rutas Activas</Typography>
                <Typography variant="h4">15</Typography>
              </Box>
              <DirectionsBusIcon sx={{ fontSize: 50 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">Total de Usuarios</Typography>
                <Typography variant="h4">500</Typography>
              </Box>
              <PeopleIcon sx={{ fontSize: 50 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper 
            sx={{ 
              p: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h6">Boletos Vendidos</Typography>
                <Typography variant="h4">389</Typography>
              </Box>
              <ConfirmationNumberIcon sx={{ fontSize: 50 }} />
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper 
            sx={{ 
              p: 3, 
              backgroundColor: theme.palette.background.paper,
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              borderRadius: '12px',
              border: '1px solid #ccc',
            }}
          >
            <Typography variant="h6" gutterBottom>
              Alguna estadística
            </Typography>
            <Box sx={{ height: 600, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BarChartIcon fontSize="large" style={{ fontSize: '10rem' }} />
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Dashboard;
