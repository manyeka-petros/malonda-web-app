import axios from 'axios';

// Create an Axios instance with base URL pointing to your Django backend
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Change this if your backend URL differs
});

// Add a request interceptor to automatically include Authorization header if token exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access'); // Get access token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Add token to Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Handle request errors
  }
);

export default api;
