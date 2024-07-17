import apiClient from './apiClient';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getProfile = async () => {
  try {
    const userId = await AsyncStorage.getItem('usuarioId');
    const response = await apiClient.get(`/user/get-user/${userId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (user) => {
  try {
    const userId = await AsyncStorage.getItem('usuarioId');
    const response = await apiClient.post(`/user/update-user/${userId}`, user);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateProfilePicture = async (imageUri) => {
  try {
    const userId = await AsyncStorage.getItem('usuarioId');
    const formData = new FormData();
    formData.append('file', {
      uri: imageUri,
      type: 'image/jpeg',
      name: 'profile.jpg'
    });
    const response = await apiClient.post(`/user/update-profile-picture/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};