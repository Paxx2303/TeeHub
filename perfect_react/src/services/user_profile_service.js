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