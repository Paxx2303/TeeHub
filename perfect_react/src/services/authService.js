import { apiRequest } from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  // Login user
  login: async (credentials) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/login`, credentials);
    return response;
  },

  // Register user
  register: async (userData) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/register`, userData);
    return response;
  },

  // Logout user
  logout: async () => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/logout`);
    return response;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.USERS}/me`);
    return response;
  },

  // Update user profile
  updateProfile: async (userData) => {
    const response = await apiRequest.put(`${API_ENDPOINTS.USERS}/profile`, userData);
    return response;
  },

  // Change password
  changePassword: async (passwordData) => {
    const response = await apiRequest.put(`${API_ENDPOINTS.USERS}/change-password`, passwordData);
    return response;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/forgot-password`, { email });
    return response;
  },

  // Reset password
  resetPassword: async (token, password) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/reset-password`, {
      token,
      password,
    });
    return response;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/verify-email`, { token });
    return response;
  },

  // Resend verification email
  resendVerification: async () => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/resend-verification`);
    return response;
  },

  // Get user orders
  getUserOrders: async (params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.USERS}/orders`, { params });
    return response;
  },

  // Get user addresses
  getUserAddresses: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.USERS}/addresses`);
    return response;
  },

  // Add user address
  addUserAddress: async (addressData) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.USERS}/addresses`, addressData);
    return response;
  },

  // Update user address
  updateUserAddress: async (addressId, addressData) => {
    const response = await apiRequest.put(`${API_ENDPOINTS.USERS}/addresses/${addressId}`, addressData);
    return response;
  },

  // Delete user address
  deleteUserAddress: async (addressId) => {
    const response = await apiRequest.delete(`${API_ENDPOINTS.USERS}/addresses/${addressId}`);
    return response;
  },
};
