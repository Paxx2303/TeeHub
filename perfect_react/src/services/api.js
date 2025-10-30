<<<<<<< HEAD
// Main API service that combines all other services
import { authService } from './authService';
import { productService } from './productService';
import { aiService } from './aiService';
import { designService } from './designService';


export const api = {
  auth: authService,
  products: productService,
  ai: aiService,
  design: designService,
  
  // General API methods
  health: async () => {
    const response = await apiRequest.get('/health');
    return response;
  },
  
  // File upload
  uploadFile: async (file, type = 'image') => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);
    
    const response = await apiRequest.upload('/upload', formData);
    return response;
  },
  
  // Get app configuration
  getConfig: async () => {
    const response = await apiRequest.get('/config');
    return response;
  },
  
  // Get app statistics
  getStats: async () => {
    const response = await apiRequest.get('/stats');
    return response;
  },
};

<<<<<<< HEAD
export default api;
=======
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
>>>>>>> main
