import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to login. Please check your credentials.';
    }
  },
  
  signup: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/signup`, { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || 'Failed to create account. Please try again later.';
    }
  }
};

export default authService;
