import api from './httpClient.js';
import axiosRetry from 'axios-retry';

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
      let sortParam = 'productId,desc'; // Mặc định
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

      const response = await api.get('api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching all products:', error);
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
      const response = await api.get(`/products/${productId}`);
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
      const response = await api.post('api/products', productData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }
};
