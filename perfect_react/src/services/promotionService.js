// src/services/promotionService.js
import api from './api'; // (Import file axios chung của bạn)

export const promotionService = {
    /**
     * Lấy KM cho 1 category.
     * (Backend sẽ trả 404 nếu không có, chúng ta sẽ bắt lỗi này)
     */
    getPromotionByCategoryId: async (categoryId) => {
        try {
            const response = await api.get(`/api/promotions/category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching promotion for category ${categoryId}:`, error);
            throw error; // Ném lỗi để component bắt
        }
    },

    /**
     * Tạo KM mới
     * (payload = { name, description, discountRate, startDate, endDate, categoryId })
     */
    createPromotion: async (promotionData) => {
        try {
            const response = await api.post('/api/promotions', promotionData);
            return response.data;
        } catch (error) {
            console.error('Error creating promotion:', error);
            throw error;
        }
    },

    /**
     * Cập nhật KM
     */
    updatePromotion: async (promotionId, promotionData) => {
        try {
            const response = await api.put(`/api/promotions/${promotionId}`, promotionData);
            return response.data;
        } catch (error) {
            console.error(`Error updating promotion ${promotionId}:`, error);
            throw error;
        }
    },

    /**
     * Xóa KM
     */
    deletePromotion: async (promotionId) => {
        try {
            const response = await api.delete(`/api/promotions/${promotionId}`);
            return response.data; // Thường là message { message: "..." }
        } catch (error) {
            console.error(`Error deleting promotion ${promotionId}:`, error);
            throw error;
        }
    }
};