<<<<<<< HEAD
// Main API service that combines all other services
import { authService } from './authService';
import { productService } from './productService';
import { aiService } from './aiService';
import { designService } from './designService';
import { apiRequest } from './httpClient';

import axios from 'axios';

// Tạo instance Axios với cấu hình mặc định
const api = axios.create({
  baseURL: 'http://localhost:8080/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 5000, // Thời gian chờ tối đa 5 giây
});

// Interceptor để xử lý lỗi toàn cục
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API error:', error);
    throw error;
  }
);
=======
// src/services/api.js 
import { authService } from './authService.js';
import { productService } from './productService';
import { aiService } from './aiService';
import { designService } from './designService';

import api from './httpClient.js';
export {
  authService,
  productService,
  aiService,
  designService
};
>>>>>>> origin/tan

export default api;