import apiClient from './apiClient';

export const login = async (data) => {
    try {
        const response = await apiClient.post('/auth/signin', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
  
  export const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw error;
    }
  };

export const register = async (data) => {
    try {
        const response = await apiClient.post('/auth/signup', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};