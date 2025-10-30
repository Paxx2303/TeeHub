import api from './api';

export const categoryService = {
    // [SỬA LỖI] Loại bỏ tham số page/size mặc định để lấy TẤT CẢ danh mục cho menu.
    // Nếu bạn muốn phân trang, hãy thêm page/size vào đây và xử lý ở Frontend.
    getAllCategories: async (search = '') => { 
        try {
            const params = {};
            if (search) {
                params.search = search;
            }
            // Gọi API, không truyền page/size để cố gắng lấy TẤT CẢ (nếu BE cho phép)
            const response = await api.get('api/categories', { params });
            const rawData = response.data;
            
            // 💡 QUAN TRỌNG: Trích xuất mảng danh mục từ trường 'content' hoặc 'data'
            if (rawData && rawData.content && Array.isArray(rawData.content)) {
                // Trả về mảng danh mục
                return rawData.content; 
            }
            
            // Nếu BE trả về mảng trần (không có phân trang)
            if (Array.isArray(rawData)) {
                return rawData;
            }

            // Nếu nhận được Object rỗng hoặc HTML (lỗi proxy), trả về mảng rỗng an toàn
            return [];
        } catch (error) {
            console.error('Error fetching categories:', error);
            // Quan trọng: Trả về mảng rỗng để frontend không bị crash
            return []; 
        }
    },

    getCategoryById: async (categoryId) => {
        try {
            const response = await api.get(`api/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching category:', error);
            throw error;
        }
    },

    createCategory: async (categoryData) => {
        try {
            const response = await api.post('api/categories', categoryData);
            return response.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error;
        }
    },

    updateCategory: async (categoryId, categoryData) => {
        try {
            const response = await api.put(`api/categories/${categoryId}`, categoryData);
            return response.data;
        } catch (error) {
            console.error('Error updating category:', error);
            throw error;
        }
    },

    deleteCategory: async (categoryId) => {
        try {
            const response = await api.delete(`api/categories/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error;
        }
    }
};
