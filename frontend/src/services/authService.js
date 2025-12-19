import api from './api';

const authService = {
  // Register new user
  register: async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', {
        name,
        email,
        password,
      });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'No token received' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Registration failed',
      };
    }
  },

  // Login user
  login: async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', {
        email,
        password,
      });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        return { success: true, data: response.data };
      }
      return { success: false, error: 'No token received' };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.detail || 'Login failed',
      };
    }
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Get current token
  getToken: () => {
    return localStorage.getItem('access_token');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },
};

export default authService;
