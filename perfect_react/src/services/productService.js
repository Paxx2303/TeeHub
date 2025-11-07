import api from './httpClient.js';
import axiosRetry from 'axios-retry';
import axios from 'axios';
const BASE_URL = 'http://localhost:8080/api';
axiosRetry(api, {
  retries: 3,
  retryDelay: (retryCount) => retryCount * 1000,
  retryCondition: (error) => {
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      error.response?.status === 429
    );
  },
});

const handleApiError = (error, defaultMsg) => {
  if (error.response) {
    throw new Error(error.response.data?.message || defaultMsg);
  } else if (error.request) {
    throw new Error('Không thể kết nối đến server.');
  } else {
    throw new Error(error.message || defaultMsg);
  }
};

export const productService = {
  /**
       * Hàm lấy TẤT CẢ sản phẩm
       */
  getAllProducts: async (page = 0, size = 10, categoryId = null, searchTerm = null, sort = 'newest') => { // Tham số searchTerm ở đây là đúng
    try {
      // Chuyển đổi sort ID ('newest', 'price-asc') sang format backend ('productId,desc', 'price,asc')
      let sortParam = 'createdAt,desc'; // Mặc định
      if (sort === 'hot') {
        sortParam = 'hot'; // Gửi 'hot' cho backend
      }
      if (sort === 'price-asc') {
        // sortParam = 'price,asc'; // Tạm thời backend chưa hỗ trợ
        console.warn("Backend currently doesn't support sorting by price.");
      } else if (sort === 'price-desc') {
        // sortParam = 'price,desc'; // Tạm thời backend chưa hỗ trợ
        console.warn("Backend currently doesn't support sorting by price.");
      } else if (sort === 'oldest') { // Ví dụ nếu có 'oldest'
        sortParam = 'productId,asc';
      }
      // Các trường hợp sort khác giữ nguyên mặc định productId,desc

      // --- SỬA LOGIC XÂY DỰNG PARAMS ---
      const params = {
        page: page,
        size: size,
        sort: sortParam // Luôn gửi sortParam đã chuyển đổi
      };

      // Chỉ thêm categoryId nếu nó hợp lệ
      if (categoryId && categoryId !== 'all') {
        params.categoryId = categoryId;
      }

      // Chỉ thêm searchTerm nếu nó được truyền vào VÀ không rỗng
      // (Kiểm tra biến searchTerm đầu vào của hàm, KHÔNG phải biến sort)
      if (searchTerm && searchTerm.trim() !== '') {
        params.searchTerm = searchTerm.trim();
      }
      // --- HẾT PHẦN SỬA ---

      // console.log("Sending API request with params:", params); // Log lại để kiểm tra

      const response = await api.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
      throw error;
    }
  },
  deleteProduct: async (productId) => {
    try {
      // Gọi API DELETE, không cần body, chỉ cần ID trong URL
      const response = await api.delete(`/api/products/${productId}`);
      return response.data; // Thường trả về message {"message": "..."}
    } catch (error) {
      console.error(`Error deleting product with id ${productId}:`, error);
      throw error;
    }
  },
  deleteProduct: async (productId) => {
    try {
      // Gọi API DELETE, không cần body, chỉ cần ID trong URL
      const response = await api.delete(`api/products/${productId}`);
      return response.data; // Thường trả về message {"message": "..."}
    } catch (error) {
      console.error(`Error deleting product with id ${productId}:`, error);
      throw error;
    }
  },
  /**
   * Hàm lấy 1 SẢN PHẨM theo ID
   */
  getProductById: async (productId) => { // <-- SỬA: Dùng dấu : (hai chấm)
    try {
      const response = await api.get(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product with id ${productId}:`, error);
      throw error;
    }
  },
  /**
   * Hàm tạo sản phẩm mới
   */
  createProduct: async (productData) => {
    try {
      // Kiểm tra nếu là FormData (đang upload ảnh)
      if (typeof FormData !== 'undefined' && productData instanceof FormData) {

        // === SỬA LẠI ĐOẠN NÀY ===
        const response = await api.post('/api/products', productData, {
          // Báo cho Axios: "Hủy Content-Type: application/json (chung) đi,
          // hãy tự động đặt Content-Type: multipart/form-data cho tôi"
          headers: {
            'Content-Type': 'multipart/form-data'
            // Hoặc 'Content-Type': undefined (để Axios tự điền boundary)
          }
        });
        return response.data;
      }
      // === HẾT PHẦN SỬA ===

      // Trường hợp khác (nếu có, không upload file)
      const response = await api.post('/api/products', productData, {
        headers: { 'Content-Type': 'application/json' }
      });
      return response.data;

    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  // hàm sửa sản phẩm
  updateProduct: async (productId, productData) => {
    try {
      // Kiểm tra xem có phải FormData không (để đảm bảo)
      if (typeof FormData !== 'undefined' && productData instanceof FormData) {
        // Gửi request PUT, dùng `api.put` và URL có ID
        const response = await api.put(`/api/products/${productId}`, productData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
      }
      // Nếu không phải FormData (ví dụ: chỉ cập nhật text, hiếm khi xảy ra)
      // throw new Error("Update must use FormData"); 
      // Hoặc xử lý JSON nếu cần

    } catch (error) {
      console.error(`Error updating product ${productId}:`, error);
      throw error;
    }
  }
};
