import { apiRequest } from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

export const aiService = {
  // Upload image for AI processing
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await apiRequest.upload(`${API_ENDPOINTS.AI_TRY_ON}/upload`, formData);
    return response;
  },

  // Process AI try-on
  processTryOn: async (data) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/process`, data);
    return response;
  },

  // Generate variations
  generateVariations: async (data) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/variations`, data);
    return response;
  },

  // Get try-on history
  getTryOnHistory: async (params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/history`, { params });
    return response;
  },

  // Save try-on result
  saveTryOnResult: async (data) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/save`, data);
    return response;
  },

  // Delete try-on result
  deleteTryOnResult: async (id) => {
    const response = await apiRequest.delete(`${API_ENDPOINTS.AI_TRY_ON}/${id}`);
    return response;
  },

  // Get AI processing status
  getProcessingStatus: async (taskId) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/status/${taskId}`);
    return response;
  },

  // Cancel AI processing
  cancelProcessing: async (taskId) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/cancel/${taskId}`);
    return response;
  },

  // Get AI model info
  getModelInfo: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/model-info`);
    return response;
  },

  // Update AI settings
  updateAISettings: async (settings) => {
    const response = await apiRequest.put(`${API_ENDPOINTS.AI_TRY_ON}/settings`, settings);
    return response;
  },

  // Get AI credits/usage
  getAICredits: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.AI_TRY_ON}/credits`);
    return response;
  },

  // Purchase AI credits
  purchaseAICredits: async (amount) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.AI_TRY_ON}/purchase-credits`, { amount });
    return response;
  },
};
