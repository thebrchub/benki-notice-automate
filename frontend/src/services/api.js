// src/services/api.js
import axios from 'axios';

// 1. Base URL from your API Contract
const API_URL = 'https://benkinotice-api.brchub.me'; 

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Interceptor: Auto-attach Token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // We will store token here after login
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Interceptor: Handle Session Expiry (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;