// frontend/src/services/flashcardService.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/api/flashcards';

// Helper to get token
const getAuthHeader = () => {
    const token = localStorage.getItem('token'); // Assuming you store token here
    return { headers: { Authorization: `Bearer ${token}` } };
};

export const flashcardService = {
    getAll: async (params = {}) => {
        const response = await axios.get(API_URL + '/', { ...getAuthHeader(), params });
        return response.data;
    },

    create: async (data) => {
        const response = await axios.post(API_URL + '/', data, getAuthHeader());
        return response.data;
    },

    update: async (id, data) => {
        const response = await axios.put(`${API_URL}/${id}`, data, getAuthHeader());
        return response.data;
    },

    delete: async (id) => {
        await axios.delete(`${API_URL}/${id}`, getAuthHeader());
    },

    getStats: async () => {
        const response = await axios.get(`${API_URL}/stats/summary`, getAuthHeader());
        return response.data;
    }
};
