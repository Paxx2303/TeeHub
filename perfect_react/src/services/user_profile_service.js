<<<<<<< HEAD
import axios from 'axios';
import axiosRetry from 'axios-retry';
import api from './api';

// Configure axios-retry
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

// Hàm lấy thông tin người dùng theo ID
export const getUserProfile = async (userId) => {
    try {
        userId = 3 // Temp hardcode userId = 3
        if (!userId) {
            throw new Error('ID người dùng là bắt buộc.');
        }
        const response = await api.get(`/users/${userId}`);
        const data = response.data;
        return {
            id: data.id,
            name: data.name || '',
            email: data.emailAddress || data.email || '',
            phone: data.phoneNumber || data.phone || '',
            unitNumber: data.unitNumber || '',
            streetNumber: data.streetNumber || '',
            addressLine1: data.addressLine1 || '',
            addressLine2: data.addressLine2 || '',
            city: data.city || '',
            region: data.region || '',
            postalCode: data.postalCode || '',
            countryName: data.countryName || '',
            isDefault: data.isDefault || false,
            dateOfBirth: data.dateOfBirth || '',
            gender: data.gender || '',
            bio: data.bio || '',
            memberSince: data.memberSince || '',
            avatar: data.avatar || '',
            orders: data.orders || 0,
            designs: data.designs || 0,
            rating: data.rating || 0,
            favorites: data.favorites || 0,
        };
    } catch (error) {
        if (error.response) {
            if (error.response.status === 404) {
                throw new Error('Không tìm thấy người dùng.');
            } else if (error.response.status === 401) {
                throw new Error('Không có quyền truy cập. Vui lòng đăng nhập lại.');
            } else if (error.response.status === 429) {
                throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau vài giây.');
            } else {
                throw new Error(error.response.data.message || 'Không thể tải thông tin người dùng.');
            }
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi tải thông tin. Vui lòng thử lại.');
        }
    }
};

// Hàm cập nhật thông tin người dùng
export const updateUserProfile = async (userId, userData) => {
    try {
        if (!userId) {
            throw new Error('ID người dùng là bắt buộc.');
        }
        if (!userData.name) {
            throw new Error('Họ và tên là bắt buộc.');
        }
        if (!userData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.email)) {
            throw new Error('Email không hợp lệ.');
        }
        if (userData.phone && !/^\+?\d{10,15}$/.test(userData.phone)) {
            throw new Error('Số điện thoại không hợp lệ.');
        }

        const dataToSend = {
            id: userId,
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            unitNumber: userData.unitNumber,
            streetNumber: userData.streetNumber,
            addressLine1: userData.addressLine1,
            addressLine2: userData.addressLine2,
            city: userData.city,
            region: userData.region,
            postalCode: userData.postalCode,
            countryName: userData.countryName,
            isDefault: userData.isDefault,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            bio: userData.bio,
            avatar: userData.avatar,
            memberSince: userData.memberSince,
        };

        const response = await api.put(`/users/${userId}`, dataToSend);
        return response.data;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin.');
            } else if (error.response.status === 401) {
                throw new Error('Không có quyền cập nhật. Vui lòng đăng nhập lại.');
            } else if (error.response.status === 404) {
                throw new Error('Không tìm thấy người dùng.');
            } else if (error.response.status === 429) {
                throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau vài giây.');
            } else {
                throw new Error(error.response.data.message || 'Không thể cập nhật thông tin người dùng.');
            }
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin. Vui lòng thử lại.');
        }
    }
};

// Hàm tải lên ảnh đại diện
export const uploadAvatar = async (file) => {
    try {
        const formData = new FormData();
        formData.append('avatar', file);
        const response = await api.post('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data.avatarUrl;
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400) {
                throw new Error('File ảnh không hợp lệ. Vui lòng chọn file khác.');
            } else if (error.response.status === 401) {
                throw new Error('Không có quyền tải lên ảnh. Vui lòng đăng nhập lại.');
            } else if (error.response.status === 429) {
                throw new Error('Quá nhiều yêu cầu. Vui lòng thử lại sau vài giây.');
            } else {
                throw new Error(error.response.data.message || 'Không thể tải lên ảnh đại diện.');
            }
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } else {
            throw new Error('Đã xảy ra lỗi khi tải lên ảnh. Vui lòng thử lại.');
        }
    }
};
=======
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

// THÊM HÀM MỚI NÀY VÀO file user_profile_service.js

export const getMyProfile = async () => {
  try {
    // Không cần ID, backend sẽ tự biết bạn là ai qua JWT Token
    const response = await api.get(`/api/users/me`); 
    const data = response.data;
    
    // Tái sử dụng logic chuẩn hóa dữ liệu của bạn
    return {
      userId: data.userId ?? data.id ?? data.user_id ?? null,
      fullName: data.fullName ?? data.full_name ?? data.name ?? '',
      emailAddress: data.emailAddress ?? data.email_address ?? data.email ?? '',
      phoneNumber: data.phoneNumber ?? data.phone_number ?? data.phone ?? '',
      userAvatar: data.userAvatar ?? data.user_avatar ?? data.avatar ?? '',
      __raw: data,
    };
  } catch (err) {
    handleApiError(err, 'Không thể tải thông tin cá nhân.');
  }
};

export const updateUser = async (userId, userData) => {
  if (!userId) throw new Error('ID người dùng là bắt buộc.');
  if (!userData?.fullName) throw new Error('Họ và tên là bắt buộc.');
  if (!userData?.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailAddress)) {
    throw new Error('Email không hợp lệ.');
  }
  try {
    const payload = {
      full_name: userData.fullName,
      user_avatar: userData.userAvatar,
      email_address: userData.emailAddress,
      phone_number: userData.phoneNumber,
    };
    const response = await api.put(`/api/users/${userId}`, payload);
    return response.data;
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật người dùng.');
  }
};

export const uploadAvatar = async (file) => {
  try {
    const formData = new FormData();
    formData.append('avatarFile', file);
    const response = await api.post('/api/users/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.avatarUrl ?? response.data;
  } catch (err) {
    handleApiError(err, 'Không thể tải lên ảnh.');
  }
};

// ----- Address -----
const normalizeAddress = (a) => {
  if (!a) return null;
  return {
    addressId: a.addressId ?? a.id ?? a.address_id ?? null,
    unitNumber: a.unitNumber ?? a.unit_number ?? '',
    streetNumber: a.streetNumber ?? a.street_number ?? '',
    addressLine: a.addressLine ?? a.address_line ?? '',
    isDefault: Boolean(a.isDefault ?? a.is_default ?? false),
    __raw: a,
  };
};

// ... (đặt sau hàm deleteAddressForUser) ...

// THÊM HÀM MỚI NÀY ĐỂ SỬA LỖI 403
export const getMyAddresses = async () => {
  try {
    // Gọi endpoint mới, không cần ID
    // Backend sẽ tự biết bạn là ai qua JWT Token
    const response = await api.get(`/api/users/me/addresses`); 
    
    const data = response.data;
    if (!Array.isArray(data)) return [];

    // Tái sử dụng hàm chuẩn hóa của bạn
    return data.map(normalizeAddress); 
  } catch (err) {
    if (err.response?.status === 404) return [];
    handleApiError(err, 'Không thể tải địa chỉ.');
  }
};

export const getAddressesByUserId = async (userId) => {
  if (!userId) throw new Error('User ID is required for addresses.');
  try {
    const response = await api.get(`/api/users/${userId}/addresses`);
    const data = response.data;
    if (!Array.isArray(data)) return [];
    return data.map(normalizeAddress);
  } catch (err) {
    if (err.response?.status === 404) return [];
    handleApiError(err, 'Không thể tải địa chỉ.');
  }
};

export const changeMyPassword = async (oldPassword, newPassword) => {
  if (!oldPassword || !newPassword) throw new Error("Cần mật khẩu cũ và mới");
  try {
    const payload = {
      password: oldPassword, // Tên trường phải khớp backend DTO
      new_password: newPassword, // Tên trường phải khớp backend DTO
    };
    const response = await api.put(`/api/users/me/password`, payload); // Gọi endpoint mới
    return response.data;
  } catch (error) {
     // Xử lý lỗi (giống hàm cũ)
     // ... (copy phần xử lý lỗi từ hàm changeUserPassword cũ)
     handleApiError(error, "Lỗi khi đổi mật khẩu"); // Hoặc dùng handleApiError
  }
};

export const updateMyProfile = async (userData) => {
  // Validate data nếu cần
  if (!userData?.fullName) throw new Error('Họ và tên là bắt buộc.');
  if (!userData?.emailAddress || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userData.emailAddress)) {
      throw new Error('Email không hợp lệ.');
  }
  try {
    // Chuẩn hóa payload (đảm bảo tên trường khớp backend DTO, ví dụ: snake_case)
    const payload = {
      full_name: userData.fullName,
      user_avatar: userData.userAvatar,
      email_address: userData.emailAddress,
      phone_number: userData.phoneNumber,
    };
    const response = await api.put(`/api/users/me`, payload); // Gọi endpoint mới
    return response.data;
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật thông tin.');
  }
};

export const createMyAddress = async (addressData) => {
  
  const requestData = {
    unit_number: addressData.unitNumber ?? '',
    street_number: addressData.streetNumber ?? '',
    address_line: addressData.addressLine ?? '',
    is_default: addressData.isDefault ?? false,
  };

  try {
    const response = await api.post(`/api/users/me/addresses`, requestData); 
    return normalizeAddress(response.data); // Tái sử dụng hàm chuẩn hóa
  } catch (err) {
    handleApiError(err, 'Không thể tạo địa chỉ.');
  }
};

export const updateMyAddress = async (addressId, addressData) => {
  if (!addressId) throw new Error('Address ID is required.');
  
  const requestData = {
    unit_number: addressData.unitNumber ?? '',    // (Thêm nếu cần)
    street_number: addressData.streetNumber ?? '', // <-- Quan trọng
    address_line: addressData.addressLine ?? '',   // <-- Quan trọng
    is_default: addressData.isDefault ?? false   // (Thêm nếu cần)
  };
 

  try {
    const response = await api.put(`/api/users/me/addresses/${addressId}`, requestData); // <-- Gửi requestData
    return normalizeAddress(response.data); 
  } catch (err) {
    handleApiError(err, 'Không thể cập nhật địa chỉ.');
  }
};

export const deleteMyAddress = async (addressId) => {
  if (!addressId) throw new Error('Address ID is required.');
  try {
    const response = await api.delete(`/api/users/me/addresses/${addressId}`);
    return response.status === 204 ? null : response.data;
  } catch (err) {
    handleApiError(err, 'Không thể xóa địa chỉ.');
  }
};



>>>>>>> origin/tan
