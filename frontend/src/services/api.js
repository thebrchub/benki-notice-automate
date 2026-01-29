// src/services/api.js
import axios from 'axios';

// 1. Base URL
const API_URL = 'https://benkinotice-api.brchub.me'; 

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // <--- ENABLED (Backend is ready for this now)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Auto-attach Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; 
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor: Handle Session Expiry (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if it's a 401 (Unauthorized) error
    if (error.response && error.response.status === 401) {
      
      // Prevent redirect loop if the error happened ON the login page
      const isLoginRequest = error.config.url && error.config.url.includes('/auth/login');

      if (!isLoginRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;