import apiClient from './apiClient';

export const getUserById = async (userId) => {
    try {
        const response = await apiClient.get(`/user/get-user/${userId}`);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const getUsers = async () => {
    try {
        const response = await apiClient.get('/user/get-users');
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (user) => {
    try {
        console.log(user);
        const response = await apiClient.post('/auth/signup', user);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (userId, user) => {
    try {
        console.log(user);
        console.log(userId);
        const response = await apiClient.post(`/user/update-user/${userId}`, user);
        return response.data.data;
    } catch (error) {
        throw error;
    }
};

export const deleteUser = async (userId) => {
    try {
        await apiClient.delete(`/user/delete-user/${userId}`);
    } catch (error) {
        throw error;
    }
};