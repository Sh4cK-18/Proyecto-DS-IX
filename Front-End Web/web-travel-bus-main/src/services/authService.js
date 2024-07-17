import apiClient from './apiClient';

export const adminLogin = async (data) => {
  try {
    const response = await apiClient.post('/auth/admin-auth', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  } catch (error) {
    throw error;
  }
};