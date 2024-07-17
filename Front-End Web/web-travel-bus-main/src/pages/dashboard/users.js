import * as React from 'react';
import { Box, Button, IconButton, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl, Tooltip, Collapse, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import MuiAlert from '@mui/material/Alert';
import Layout from '../../components/layout';
import { getUsers, createUser, updateUser, deleteUser } from '../../services/userService';

const CustomAlert = React.forwardRef((props, ref) => (
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

const Users = () => {
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchBy, setSearchBy] = React.useState('nombre'); // Default search by 'nombre'
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [showPasswordFields, setShowPasswordFields] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const [newUser, setNewUser] = React.useState({
    nombre: '',
    apellido: '',
    email: '',
    roles: ['USUARIO'],
    password: '',
    confirmPassword: '',
  });

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      const formattedUsers = users.map(user => ({
        id: user.usuarioId,
        nombre: `${user.nombre} ${user.apellido}`,
        email: user.email,
        rol: user.roles ? user.roles[0].rol.name : 'Usuario'
      }));
      setRows(formattedUsers);
      setFilteredRows(formattedUsers);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setNewUser({
      nombre: '',
      apellido: '',
      email: '',
      roles: ['USUARIO'],
      password: '',
      confirmPassword: '',
    });
  };

  const handleOpenEdit = (row) => {
    setCurrentRow(row);
    setNewUser({
      nombre: row.nombre.split(' ')[0],
      apellido: row.nombre.split(' ')[1],
      email: row.email,
      roles: [row.rol],
      password: '',
      confirmPassword: '',
    });
    setShowPasswordFields(false);
    setOpenEdit(true);
  };
  const handleCloseEdit = () => setOpenEdit(false);

  const handleOpenDelete = (row) => {
    setCurrentRow(row);
    setOpenDelete(true);
  };
  const handleCloseDelete = () => setOpenDelete(false);

  const handleAdd = async () => {
    const newUserWithPassword = { ...newUser, password: '123456789' };
    try {
      await createUser(newUserWithPassword);
      await fetchUsers();
      handleCloseAdd();
      setSnackbar({
        open: true,
        message: 'Usuario añadido correctamente',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al añadir el usuario',
        severity: 'error',
      });
      console.error('Failed to add user', error);
    }
  };

  const handleEdit = async () => {
    if (newUser.password) {
      if (newUser.password.length < 8) {
        setSnackbar({
          open: true,
          message: 'La contraseña debe tener al menos 8 caracteres',
          severity: 'error',
        });
        return;
      }
  
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*.-/])(?=.*\d).*$/;
      const isPasswordValid = passwordRegex.test(newUser.password);
  
      if (!isPasswordValid) {
        setSnackbar({
          open: true,
          message: 'La contraseña debe contener al menos una mayúscula, un carácter especial y un número',
          severity: 'error',
        });
        return;
      }
  
      if (newUser.password !== newUser.confirmPassword) {
        setSnackbar({
          open: true,
          message: 'Las contraseñas no coinciden',
          severity: 'error',
        });
        return;
      }
    }
  
    try {
      const { confirmPassword, ...userToUpdate } = newUser;
      await updateUser(currentRow.id, userToUpdate);
      await fetchUsers();
      handleCloseEdit();
      setSnackbar({
        open: true,
        message: 'Usuario actualizado correctamente',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Error al actualizar el usuario',
        severity: 'error',
      });
      console.error('Failed to edit user', error);
    }
  };

  const handleDelete = async () => {
    try {
        await deleteUser(currentRow.id);
        await fetchUsers();
        handleCloseDelete();
        setSnackbar({
            open: true,
            message: 'Usuario eliminado correctamente',
            severity: 'success',
        });
    } catch (error) {
        const errorMessage = error.response?.data?.messageError || 'Error al eliminar el usuario';
        setSnackbar({
            open: true,
            message: errorMessage,
            severity: 'error',
        });
        console.error('Failed to delete user', error);
    }
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'rol') {
      setNewUser({ ...newUser, roles: [value] });
    } else {
      setNewUser({ ...newUser, [name]: value });
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    const filteredData = rows.filter(row =>
      searchBy === 'nombre'
        ? row.nombre.toLowerCase().includes(e.target.value.toLowerCase())
        : row.email.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setFilteredRows(filteredData);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '95vh', width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Usuarios
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <TextField
              size="small"
              variant="outlined"
              placeholder="Buscar..."
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                endAdornment: (
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                ),
                style: {
                  borderRadius: '8px',
                },
              }}
            />
            <FormControl variant="outlined" sx={{ ml: 2, minWidth: 120 }}>
              <InputLabel>Buscar por</InputLabel>
              <Select
                value={searchBy}
                onChange={handleSearchByChange}
                label="Buscar por"
              >
                <MenuItem value="nombre">Nombre</MenuItem>
                <MenuItem value="email">Correo</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            color="primary"
            sx={{ borderRadius: '8px', height: '40px' }}
            onClick={handleOpenAdd}
          >
            Añadir
          </Button>
        </Box>
        <TableContainer component={Paper} sx={{ flexGrow: 1, overflow: 'auto', width: '100%' }}>
          <Table stickyHeader sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell align="center">ID</TableCell>
                <TableCell align="center">Nombre y Apellido</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell align="center">{row.id}</TableCell>
                  <TableCell align="center">{row.nombre}</TableCell>
                  <TableCell align="center">{row.email}</TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      color="warning"
                      startIcon={<EditIcon />}
                      sx={{ mr: 1, borderRadius: '8px' }}
                      onClick={() => handleOpenEdit(row)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      startIcon={<DeleteIcon />}
                      sx={{ borderRadius: '8px' }}
                      onClick={() => handleOpenDelete(row)}
                    >
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Modal Añadir */}
        <Dialog open={openAdd} onClose={handleCloseAdd}>
          <DialogTitle>Añadir Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Por favor, complete la información para añadir un nuevo usuario.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              variant="outlined"
              name="nombre"
              value={newUser.nombre}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Apellido"
              type="text"
              fullWidth
              variant="outlined"
              name="apellido"
              value={newUser.apellido}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                name="rol"
                value={newUser.roles[0]}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                <MenuItem value="CONDUCTOR">Conductor</MenuItem>
                <MenuItem value="USUARIO">Usuario</MenuItem>
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAdd} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleAdd} color="primary">
              Añadir
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Editar */}
        <Dialog open={openEdit} onClose={handleCloseEdit}>
          <DialogTitle>Editar Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Por favor, actualice la información del usuario.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre"
              type="text"
              fullWidth
              variant="outlined"
              name="nombre"
              value={newUser.nombre}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Apellido"
              type="text"
              fullWidth
              variant="outlined"
              name="apellido"
              value={newUser.apellido}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <TextField
              margin="dense"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              name="email"
              value={newUser.email}
              onChange={handleChange}
              sx={{ marginBottom: 2 }}
            />
            <FormControl fullWidth variant="outlined" sx={{ marginBottom: 2 }}>
              <InputLabel>Rol</InputLabel>
              <Select
                name="rol"
                value={newUser.roles[0]}
                onChange={handleChange}
                label="Rol"
              >
                <MenuItem value="ADMINISTRADOR">Administrador</MenuItem>
                <MenuItem value="CONDUCTOR">Conductor</MenuItem>
                <MenuItem value="USUARIO">Usuario</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Tooltip title="Editar Contraseña">
                <IconButton onClick={() => setShowPasswordFields(!showPasswordFields)}>
                  {showPasswordFields ? <LockOpenIcon /> : <LockIcon />}
                </IconButton>
              </Tooltip>
              <Typography variant="body2" sx={{ ml: 1 }}>
                {showPasswordFields ? 'Ocultar Contraseña' : 'Editar Contraseña'}
              </Typography>
            </Box>
            <Collapse in={showPasswordFields}>
              <TextField
                margin="dense"
                label="Nueva Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                name="password"
                value={newUser.password}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
              />
              <TextField
                margin="dense"
                label="Confirmar Nueva Contraseña"
                type="password"
                fullWidth
                variant="outlined"
                name="confirmPassword"
                value={newUser.confirmPassword}
                onChange={handleChange}
                sx={{ marginBottom: 2 }}
              />
            </Collapse>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEdit} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleEdit} color="primary">
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Modal Eliminar */}
        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle>Eliminar Usuario</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro de que desea eliminar el usuario {currentRow ? currentRow.id : ''}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDelete} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <CustomAlert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </CustomAlert>
      </Snackbar>
    </Layout>
  );
};

export default Users;
