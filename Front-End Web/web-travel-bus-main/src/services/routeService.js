import apiClient from './apiClient';

export const getRoutes = async () => {
  try {
    const response = await apiClient.get('/routes/get-routes');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const addRoute = async (routeData) => {
  try {
    const response = await apiClient.post('/routes/create-route', routeData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const editRoute = async (id, routeData) => {
  try {
    const response = await apiClient.put(`/routes/update-route/${id}`, routeData);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    await apiClient.delete(`/routes/delete-route/${id}`);
  } catch (error) {
    throw error;
  }
};
