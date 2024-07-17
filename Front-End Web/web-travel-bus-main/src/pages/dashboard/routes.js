import * as React from 'react';
import { Box, Button, IconButton, TextField, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, MenuItem, Select, InputLabel, FormControl, Stepper, Step, StepLabel, Snackbar, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Layout from '../../components/layout';
import { getRoutes, addRoute, editRoute, deleteRoute } from '../../services/routeService';
import { format, parseISO } from 'date-fns';

const Routes = () => {
  const [rows, setRows] = React.useState([]);
  const [filteredRows, setFilteredRows] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchBy, setSearchBy] = React.useState('salida'); // Default search by 'salida'
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openEdit, setOpenEdit] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
  const [currentRow, setCurrentRow] = React.useState(null);
  const [activeStep, setActiveStep] = React.useState(0);
  const [newRoute, setNewRoute] = React.useState({
    salida: '',
    llegada: '',
    fecha_hora: '',
    puerta: '',
    precio_adulto: '',
    precio_nino: '',
    precio_tercera_edad: ''
  });
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const steps = ['Detalles Generales', 'Precios'];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setActiveStep(0);
    setNewRoute({
      salida: '',
      llegada: '',
      fecha_hora: '',
      puerta: '',
      precio_adulto: '',
      precio_nino: '',
      precio_tercera_edad: ''
    });
  };

  const handleOpenEdit = (row) => {
    setCurrentRow(row);
    setNewRoute(row);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setActiveStep(0);
  };

  const handleOpenDelete = (row) => {
    setCurrentRow(row);
    setOpenDelete(true);
  };

  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  const handleChange = (e) => {
    setNewRoute({ ...newRoute, [e.target.name]: e.target.value });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchByChange = (e) => {
    setSearchBy(e.target.value);
  };

  const validateRouteData = (data) => {
    if (!data.salida || !data.llegada || !data.fecha_hora || !data.puerta || !data.precio_adulto || !data.precio_nino || !data.precio_tercera_edad) {
      return false;
    }
    return true;
  };

  const fetchRoutes = async () => {
    try {
      const routes = await getRoutes();
      setRows(routes);
      setFilteredRows(routes);
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  React.useEffect(() => {
    fetchRoutes();
  }, []);

  React.useEffect(() => {
    const filteredData = rows.filter(row =>
      searchBy === 'salida'
        ? row.salida.toLowerCase().includes(searchQuery.toLowerCase())
        : searchBy === 'llegada'
        ? row.llegada.toLowerCase().includes(searchQuery.toLowerCase())
        : row.puerta.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredRows(filteredData);
  }, [searchQuery, searchBy, rows]);

  const handleAdd = async () => {
    if (!validateRouteData(newRoute)) {
      setSnackbar({ open: true, message: 'Todos los campos son obligatorios', severity: 'error' });
      return;
    }

    try {
      const formattedDate = format(new Date(newRoute.fecha_hora), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      const newRouteData = { ...newRoute, fecha_hora: formattedDate };
      await addRoute(newRouteData);
      await fetchRoutes();
      handleCloseAdd();
      setSnackbar({ open: true, message: 'Ruta añadida con éxito', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al añadir ruta', severity: 'error' });
      console.error('Error adding route:', error);
    }
  };

  const handleEdit = async () => {
    if (!validateRouteData(newRoute)) {
      setSnackbar({ open: true, message: 'Todos los campos son obligatorios', severity: 'error' });
      return;
    }

    try {
      const formattedDate = format(new Date(newRoute.fecha_hora), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx");
      const newRouteData = { ...newRoute, fecha_hora: formattedDate };
      await editRoute(currentRow.rutaId, newRouteData);
      await fetchRoutes();
      handleCloseEdit();
      setSnackbar({ open: true, message: 'Ruta actualizada con éxito', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al actualizar ruta', severity: 'error' });
      console.error('Error editing route:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteRoute(currentRow.rutaId);
      await fetchRoutes();
      handleCloseDelete();
      setSnackbar({ open: true, message: 'Ruta eliminada con éxito', severity: 'success' });
    } catch (error) {
      setSnackbar({ open: true, message: 'Error al eliminar ruta', severity: 'error' });
      console.error('Error deleting route:', error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Layout>
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '95vh', width: '100%' }}>
        <Typography variant="h4" gutterBottom>
          Rutas
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
                <MenuItem value="salida">Salida</MenuItem>
                <MenuItem value="llegada">Destino</MenuItem>
                <MenuItem value="puerta">Puerta</MenuItem>
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
                <TableCell align="center">Salida</TableCell>
                <TableCell align="center">Destino</TableCell>
                <TableCell align="center">Fecha y Hora</TableCell>
                <TableCell align="center">Puerta</TableCell>
                <TableCell align="center">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((row) => (
                <TableRow key={row.rutaId}>
                  <TableCell align="center">{row.rutaId}</TableCell>
                  <TableCell align="center">{row.salida}</TableCell>
                  <TableCell align="center">{row.llegada}</TableCell>
                  <TableCell align="center">{format(parseISO(row.fecha_hora), 'yyyy-MM-dd HH:mm')}</TableCell>
                  <TableCell align="center">{row.puerta}</TableCell>
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
        <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="md">
          <DialogTitle>Añadir Ruta</DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Salida"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="salida"
                  value={newRoute.salida}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Llegada"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="llegada"
                  value={newRoute.llegada}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Fecha y Hora"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  name="fecha_hora"
                  value={newRoute.fecha_hora}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  margin="dense"
                  label="Puerta"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="puerta"
                  value={newRoute.puerta}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                />
              </>
            )}
            {activeStep === 1 && (
              <>
                <TextField
                  margin="dense"
                  label="Precio Adulto"
                  type="number"
                  fullWidth
                  variant="outlined"
                  name="precio_adulto"
                  value={newRoute.precio_adulto}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputProps={{ inputProps: { step: "0.01" } }}
                />
                <TextField
                  margin="dense"
                  label="Precio Niño"
                  type="number"
                  fullWidth
                  variant="outlined"
                  name="precio_nino"
                  value={newRoute.precio_nino}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputProps={{ inputProps: { step: "0.01" } }}
                />
                <TextField
                  margin="dense"
                  label="Precio Tercera Edad"
                  type="number"
                  fullWidth
                  variant="outlined"
                  name="precio_tercera_edad"
                  value={newRoute.precio_tercera_edad}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputProps={{ inputProps: { step: "0.01" } }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            {activeStep === 0 ? (
              <>
                <Button onClick={handleCloseAdd} color="primary">
                  Cancelar
                </Button>
                <Button onClick={handleNext} color="primary">
                  Siguiente
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleBack} color="primary">
                  Atrás
                </Button>
                <Button onClick={handleAdd} color="primary">
                  Añadir
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Modal Editar */}
        <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="md">
          <DialogTitle>Editar Ruta</DialogTitle>
          <DialogContent>
            <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
              {steps.map((label, index) => (
                <Step key={index}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
            {activeStep === 0 && (
              <>
                <TextField
                  autoFocus
                  margin="dense"
                  label="Salida"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="salida"
                  value={newRoute.salida}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Llegada"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="llegada"
                  value={newRoute.llegada}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                />
                <TextField
                  margin="dense"
                  label="Fecha y Hora"
                  type="datetime-local"
                  fullWidth
                  variant="outlined"
                  name="fecha_hora"
                  value={newRoute.fecha_hora}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  margin="dense"
                  label="Puerta"
                  type="text"
                  fullWidth
                  variant="outlined"
                  name="puerta"
                  value={newRoute.puerta}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                />
              </>
            )}
            {activeStep === 1 && (
              <>
                <TextField
                  margin="dense"
                  label="Precio Adulto"
                  type="number"
                  fullWidth
                  variant="outlined"
                  name="precio_adulto"
                  value={newRoute.precio_adulto}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputProps={{ inputProps: { step: "0.01" } }}
                />
                <TextField
                  margin="dense"
                  label="Precio Niño"
                  type="number"
                  fullWidth
                  variant="outlined"
                  name="precio_nino"
                  value={newRoute.precio_nino}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputProps={{ inputProps: { step: "0.01" } }}
                />
                <TextField
                  margin="dense"
                  label="Precio Tercera Edad"
                  type="number"
                  fullWidth
                  variant="outlined"
                  name="precio_tercera_edad"
                  value={newRoute.precio_tercera_edad}
                  onChange={handleChange}
                  sx={{ marginBottom: 2 }}
                  InputProps={{ inputProps: { step: "0.01" } }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            {activeStep === 0 ? (
              <>
                <Button onClick={handleCloseEdit} color="primary">
                  Cancelar
                </Button>
                <Button onClick={handleNext} color="primary">
                  Siguiente
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handleBack} color="primary">
                  Atrás
                </Button>
                <Button onClick={handleEdit} color="primary">
                  Guardar
                </Button>
              </>
            )}
          </DialogActions>
        </Dialog>

        {/* Modal Eliminar */}
        <Dialog open={openDelete} onClose={handleCloseDelete}>
          <DialogTitle>Eliminar Ruta</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Está seguro de que desea eliminar la ruta {currentRow ? currentRow.rutaId : ''}?
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
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Layout>
  );
};

export default Routes;
