// utils/axios.ts
import axios from 'axios';
import TokenService from './token';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://task-manager-backend-6bjm.onrender.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = TokenService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      TokenService.removeToken();

      // Only redirect if we're not already on auth pages
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/signin') && !currentPath.includes('/signup')) {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
