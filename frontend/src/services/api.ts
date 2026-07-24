import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach JWT bearer token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chargeshare_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-refresh or handle 401 unauth
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('chargeshare_token');
      localStorage.removeItem('chargeshare_user');
    }
    return Promise.reject(error);
  }
);

export default api;
