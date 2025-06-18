import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Replace with your Django backend URL if different
});

// Automatically add Authorization header with token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // Using access token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
