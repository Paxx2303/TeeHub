import { apiRequest } from './httpClient';
import { API_ENDPOINTS } from '../utils/constants';

export const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await apiRequest.get(API_ENDPOINTS.PRODUCTS, { params });
    return response;
  },

  // Get product by ID
  getProductById: async (id) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
    return response;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
      params: { q: query, ...params },
    });
    return response;
  },

  // Get products by category
  getProductsByCategory: async (category, params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/category/${category}`, {
      params,
    });
    return response;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 8) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/featured`, {
      params: { limit },
    });
    return response;
  },

  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/related`, {
      params: { limit },
    });
    return response;
  },

  // Get product reviews
  getProductReviews: async (productId, params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/reviews`, {
      params,
    });
    return response;
  },

  // Add product review
  addProductReview: async (productId, reviewData) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.PRODUCTS}/${productId}/reviews`, reviewData);
    return response;
  },

  // Get product categories
  getCategories: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/categories`);
    return response;
  },

  // Get product sizes
  getSizes: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/sizes`);
    return response;
  },

  // Get product colors
  getColors: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/colors`);
    return response;
  },

  // Check product availability
  checkAvailability: async (productId, size, color) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/availability`, {
      params: { size, color },
    });
    return response;
  },

  // Get product recommendations
  getRecommendations: async (productId, limit = 4) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/${productId}/recommendations`, {
      params: { limit },
    });
    return response;
  },

  // Get trending products
  getTrendingProducts: async (limit = 8) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/trending`, {
      params: { limit },
    });
    return response;
  },

  // Get new arrivals
  getNewArrivals: async (limit = 8) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/new-arrivals`, {
      params: { limit },
    });
    return response;
  },

  // Get sale products
  getSaleProducts: async (limit = 8) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.PRODUCTS}/sale`, {
      params: { limit },
    });
    return response;
  },
};
