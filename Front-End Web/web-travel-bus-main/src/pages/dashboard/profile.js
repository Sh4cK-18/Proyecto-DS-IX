import * as React from 'react';
import { Avatar, Box, Button, Container, Grid, Paper, TextField, Typography, Divider, Collapse, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import Layout from '../../components/layout';
import SaveIcon from '@mui/icons-material/Save';
import { getUserById, updateUser } from '../../services/userService';

const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  color: 'black',
  backgroundColor: '#f9f9f9',
  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  borderRadius: '12px',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  margin: 'auto',
  marginBottom: theme.spacing(2),
  width: theme.spacing(10),
  height: theme.spacing(10),
  backgroundColor: 'black',
}));

const Profile = () => {
  const [user, setUser] = React.useState({
    nombre: '',
    apellido: '',
    email: '',
    rol: '',
  });
  const [passwords, setPasswords] = React.useState({
    password: '',
    confirmPassword: '',
  });
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId');
        const userData = await getUserById(userId);
        setUser({
          nombre: userData.nombre,
          apellido: userData.apellido,
          email: userData.email,
          rol: 'Administrador',
        });
      } catch (error) {
        console.error('Failed to fetch user data', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChangePasswords = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (passwords.password) {
      if (passwords.password.length < 8) {
        setSnackbar({
          open: true,
          message: 'La contraseña debe tener al menos 8 caracteres',
          severity: 'error',
        });
        return;
      }

      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.-/])(?=.*\d).*$/;
      const isPasswordValid = passwordRegex.test(passwords.password);

      if (!isPasswordValid) {
        setSnackbar({
          open: true,
          message: 'La contraseña debe contener al menos una mayúscula, un carácter especial y un número',
          severity: 'error',
        });
        return;
      }

      if (passwords.password !== passwords.confirmPassword) {
        setSnackbar({
          open: true,
          message: 'Las contraseñas no coinciden',
          severity: 'error',
        });
        return;
      }

      try {
        const userId = localStorage.getItem('userId');
        await updateUser(userId, { password: passwords.password });
        setSnackbar({
          open: true,
          message: 'Perfil actualizado con éxito',
          severity: 'success',
        });
        setShowPasswordFields(false);
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al actualizar el perfil',
          severity: 'error',
        });
        console.error('Failed to update user password', error);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Container maxWidth="sm">
          <ProfilePaper>
            <ProfileAvatar>{user.nombre.charAt(0)}</ProfileAvatar>
            <Typography variant="h5" gutterBottom>
              Perfil de Usuario
            </Typography>
            <Divider sx={{ marginBottom: 2 }} />
            <Box component="form" sx={{ mt: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="nombre"
                    fullWidth
                    label="Nombre"
                    value={user.nombre}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="apellido"
                    fullWidth
                    label="Apellido"
                    value={user.apellido}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="email"
                    fullWidth
                    label="Email"
                    value={user.email}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    name="rol"
                    fullWidth
                    label="Rol"
                    value={user.rol}
                    variant="outlined"
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowPasswordFields(!showPasswordFields)}
                    sx={{
                      mt: 2,
                      borderRadius: '8px',
                      color: '#fff',
                      backgroundColor: '#162B4E',
                      '&:hover': {
                        backgroundColor: '#0f1e37',
                      },
                      '&:active': {
                        backgroundColor: '#0a1425',
                      },
                      '&:focus': {
                        boxShadow: '0 0 0 3px rgba(22, 43, 78, 0.5)',
                      },
                    }}
                  >
                    {showPasswordFields ? 'Ocultar Contraseña' : 'Cambiar Contraseña'}
                  </Button>
                </Grid>
                <Grid item xs={12}>
                  <Collapse in={showPasswordFields}>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <TextField
                          name="password"
                          fullWidth
                          label="Contraseña"
                          type="password"
                          value={passwords.password}
                          onChange={handleChangePasswords}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          name="confirmPassword"
                          fullWidth
                          label="Confirmar Contraseña"
                          type="password"
                          value={passwords.confirmPassword}
                          onChange={handleChangePasswords}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          fullWidth
                          variant="contained"
                          color="primary"
                          onClick={handleSave}
                          sx={{ mt: 2, padding: '10px 0', borderRadius: '8px' }}
                          startIcon={<SaveIcon />}
                        >
                          Guardar Cambios
                        </Button>
                      </Grid>
                    </Grid>
                  </Collapse>
                </Grid>
              </Grid>
            </Box>
          </ProfilePaper>
        </Container>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Layout>
  );
};

export default Profile;
