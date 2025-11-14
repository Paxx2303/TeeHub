// src/services/designService.js
import api from './httpClient.js';
import axios from 'axios';
import axiosRetry from 'axios-retry';

// retry network errors
axiosRetry(api, {
  retries: 3,
  retryDelay: retryCount => retryCount * 1000,
  retryCondition: err =>
    axiosRetry.isNetworkOrIdempotentRequestError(err) || err.response?.status === 429,
});

const handleApiError = (error, defaultMsg = 'Đã có lỗi xảy ra') => {
  if (error.response) {
    console.error("API ERROR:", error.response.status, error.response.data);
    throw new Error(error.response.data?.message || defaultMsg);
  } else if (error.request) {
    throw new Error('Không thể kết nối tới server.');
  } else {
    throw new Error(error.message || defaultMsg);
  }
};

// ✅ Tạo 1 instance Axios KHÔNG có Content-Type mặc định
const apiMultipart = axios.create({
  baseURL: api.defaults.baseURL,
  withCredentials: true,
  timeout: 15000,
});

// Copy Authorization header thủ công từ httpClient
apiMultipart.interceptors.request.use((config) => {
  const token = api.defaults.headers.common['Authorization'];
  if (token) config.headers.Authorization = token;
  return config;
});

// ----------- HÀM TẠO CUSTOM PRODUCT (multipart) -----------
export const createCustomProductWithImage = async (payloadObject, imageFile = null, opts = {}) => {
  try {
    const form = new FormData();
    const payloadBlob = new Blob([JSON.stringify(payloadObject)], { type: 'application/json' });
    form.append('payload', payloadBlob);

    if (imageFile) {
      form.append('image', imageFile, opts.filename || 'design.png');
    }

    console.debug("📤 Uploading multipart form to /api/custom-products ...");

    const resp = await apiMultipart.post('/api/custom-products', form, {
      onUploadProgress: opts.onUploadProgress,
    });

    return resp.data;
  } catch (err) {
    handleApiError(err, 'Tạo sản phẩm tùy chỉnh thất bại');
  }
};

// ----------- Upload riêng (nếu có endpoint /api/upload/custom) -----------
export const uploadDesignImage = async (file, opts = {}) => {
  try {
    const form = new FormData();
    form.append('file', file, opts.filename || 'design.png');

    const resp = await apiMultipart.post('/api/upload/custom', form, {
      onUploadProgress: opts.onUploadProgress,
    });
    return resp.data;
  } catch (err) {
    handleApiError(err, 'Upload file thất bại');
  }
};

export default {
  createCustomProductWithImage,
  uploadDesignImage,
};
