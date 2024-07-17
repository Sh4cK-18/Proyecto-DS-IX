import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Button, TextField, Typography, Paper, Avatar, Snackbar, Alert } from '@mui/material';
import Image from 'next/image';
import { adminLogin } from '../services/authService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  const router = useRouter();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin({ email, password });
      localStorage.setItem('userId', response.usuarioId);
      setSnackbarMessage('Inicio de sesión exitoso!');
      setSnackbarSeverity('success');
      router.push('/dashboard');
    } catch (error) {
      setSnackbarMessage('Error al iniciar sesión');
      setSnackbarSeverity('error');
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: 'url(/wpp_3.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          textAlign: 'center',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <Image
            src="/logo_marco.png"
            alt="Logo"
            width={120}
            height={120}
          />
        </Box>
        <Typography variant="h5" gutterBottom>
          Inicio de Sesión
        </Typography>
        <Box component="form" sx={{ mt: 2 }} onSubmit={handleSignin}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            margin="normal"
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              style: {
                borderRadius: '8px',
              },
            }}
          />
          <TextField
            fullWidth
            label="Contraseña"
            type="password"
            margin="normal"
            variant="outlined"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              style: {
                borderRadius: '8px',
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2, borderRadius: '8px', padding: '10px 0' }}
            type="submit"
          >
            Iniciar Sesión
          </Button>
        </Box>
      </Paper>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
