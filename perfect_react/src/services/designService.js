
import { API_ENDPOINTS } from '../utils/constants';

export const designService = {
  // Save design
  saveDesign: async (designData) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.DESIGN}/save`, designData);
    return response;
  },

  // Get user designs
  getUserDesigns: async (params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/user`, { params });
    return response;
  },

  // Get design by ID
  getDesignById: async (id) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/${id}`);
    return response;
  },

  // Update design
  updateDesign: async (id, designData) => {
    const response = await apiRequest.put(`${API_ENDPOINTS.DESIGN}/${id}`, designData);
    return response;
  },

  // Delete design
  deleteDesign: async (id) => {
    const response = await apiRequest.delete(`${API_ENDPOINTS.DESIGN}/${id}`);
    return response;
  },

  // Get design templates
  getTemplates: async (params = {}) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/templates`, { params });
    return response;
  },

  // Get template by ID
  getTemplateById: async (id) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/templates/${id}`);
    return response;
  },

  // Create design from template
  createFromTemplate: async (templateId, customizations = {}) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.DESIGN}/from-template`, {
      templateId,
      customizations,
    });
    return response;
  },

  // Export design
  exportDesign: async (id, format = 'png', options = {}) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.DESIGN}/${id}/export`, {
      format,
      options,
    });
    return response;
  },

  // Share design
  shareDesign: async (id, shareOptions = {}) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.DESIGN}/${id}/share`, shareOptions);
    return response;
  },

  // Get shared design
  getSharedDesign: async (shareId) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/shared/${shareId}`);
    return response;
  },

  // Get design categories
  getDesignCategories: async () => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/categories`);
    return response;
  },

  // Get popular designs
  getPopularDesigns: async (limit = 12) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/popular`, {
      params: { limit },
    });
    return response;
  },

  // Get recent designs
  getRecentDesigns: async (limit = 12) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/recent`, {
      params: { limit },
    });
    return response;
  },

  // Duplicate design
  duplicateDesign: async (id) => {
    const response = await apiRequest.post(`${API_ENDPOINTS.DESIGN}/${id}/duplicate`);
    return response;
  },

  // Get design analytics
  getDesignAnalytics: async (id) => {
    const response = await apiRequest.get(`${API_ENDPOINTS.DESIGN}/${id}/analytics`);
    return response;
  },
};
