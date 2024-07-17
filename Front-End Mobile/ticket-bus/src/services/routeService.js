import apiClient from "./apiClient";

const validateRouteDate = (route) => {
  const currentDate = new Date();
  const routeDate = new Date(route.fecha_hora);
  return routeDate > currentDate;
};

export const getRoutes = async () => {
  try {
    const response = await apiClient.get("/routes/get-routes");
    if (response.data && response.data.data) {
      const validRoutes = response.data.data.filter(validateRouteDate);
      return validRoutes;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export const getRoute = async (id) => {
  try {
    const response = await apiClient.get(`/routes/get-route/${id}`);
    if (response.data && response.data.data && validateRouteDate(response.data.data)) {
      return response.data.data;
    }
    return null;
  } catch (error) {
    throw error;
  }
};

export const findRoute = async (data) => {
  try {
    const response = await apiClient.get("/routes/find-routes", {
      params: { salida: data.salida, llegada: data.llegada }
    });
    if (response.data && response.data.data) {
      const validRoutes = response.data.data.filter(validateRouteDate);
      return validRoutes;
    }
    return [];
  } catch (error) {
    throw error;
  }
};

export default {
  getRoutes,
  getRoute,
  findRoute
};
