import apiClient from './apiClient';

const createTicket = async (ticketData) => {
  try {
    const response = await apiClient.post('/ticket/create-ticket', ticketData);
    return response.data;
  } catch (error) {
    console.error('Error creating ticket:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getTickets = async () => {
  try {
    const response = await apiClient.get('/ticket/get-tickets');
    return response.data;
  } catch (error) {
    console.error('Error getting tickets:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getTicketById = async (id) => {
  try {
    const response = await apiClient.get(`/ticket/get-ticket/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error getting ticket:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const updateTicket = async (id, ticketData) => {
  try {
    const response = await apiClient.put(`/ticket/update-ticket/${id}`, ticketData);
    return response.data;
  } catch (error) {
    console.error('Error updating ticket:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const deleteTicket = async (id) => {
  try {
    const response = await apiClient.delete(`/ticket/delete-ticket/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting ticket:', error.response ? error.response.data : error.message);
    throw error;
  }
};

const getTicketsByUserId = async (userId) => {
  try {
    const response = await apiClient.get(`/ticket/get-ticket-by-user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error getting ticket by user:', error.response ? error.response.data : error.message);
    throw error;
  }
};

export default {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  deleteTicket,
  getTicketsByUserId,
};
