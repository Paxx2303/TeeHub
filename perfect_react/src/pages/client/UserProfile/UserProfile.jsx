<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import styles from './UserProfile.module.css';
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../../services/user_profile_service';

const UserProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    id: null,
    name: '',
    email: '',
    phone: '',
    unitNumber: '',
    streetNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    region: '',
    postalCode: '',
    countryName: '',
    isDefault: false,
    dateOfBirth: '',
    gender: '',
    bio: '',
    memberSince: '',
    avatar: '',
  });
  const [formData, setFormData] = useState(userInfo);
  const [stats, setStats] = useState({
    orders: 0,
    designs: 0,
    rating: 0,
    favorites: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const data = await getUserProfile();
        setUserInfo(data);
        setFormData(data);
        setStats({
          orders: data.orders || 0,
          designs: data.designs || 0,
          rating: data.rating || 0,
          favorites: data.favorites || 0,
        });
      } catch (err) {
        setError(err.message || 'Không thể tải thông tin người dùng');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleInputChange = useCallback(
    debounce((e) => {
      const { name, value } = e.target;
      if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setError('Định dạng email không hợp lệ');
        return;
      }
      setError(null);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }, 300),
    []
  );

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        setIsLoading(true);
        const avatarUrl = await uploadAvatar(file);
        setUserInfo((prev) => ({ ...prev, avatar: avatarUrl }));
        setFormData((prev) => ({ ...prev, avatar: avatarUrl }));
      } catch (error) {
        setError('Không thể tải lên ảnh đại diện');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (!formData.name || !formData.email) {
        throw new Error('Họ và tên và email là bắt buộc');
      }
      setError(null);
      setUserInfo(formData);
      setIsEditing(false);
      await updateUserProfile(formData.id, formData);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(userInfo);
    setIsEditing(false);
    setError(null);
  };

  if (isLoading) {
    return <div className={styles.aboutContainer}>Đang tải...</div>;
  }

  if (error && !isEditing) {
    return <div className={styles.aboutContainer}>{error}</div>;
  }

  return (
    <div className={styles.aboutContainer}>
      {error && <div className={styles.errorMessage}>{error}</div>}
      <div className={styles.aboutHeader}>
        <h1>Thông tin cá nhân</h1>
        <p>Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className={styles.aboutContent}>
        <div className={styles.profileSection}>
          <div className={styles.profileHeader}>
            <div className={styles.avatar}>
              <img
                src={userInfo.avatar || 'https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=User'}
                alt="Ảnh đại diện"
                className={styles.avatarImage}
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className={styles.fileInput}
                id="avatarUpload"
                style={{ display: 'none' }}
              />
              <label htmlFor="avatarUpload" className={styles.changeAvatarBtn}>
                📷 Thay đổi ảnh
              </label>
            </div>
            <div className={styles.profileInfo}>
              <h2>{userInfo.name}</h2>
              <p className={styles.memberSince}>
                {userInfo.memberSince
                  ? `Thành viên từ ${new Date(userInfo.memberSince).toLocaleDateString('vi-VN', {
                    month: 'long',
                    year: 'numeric',
                  })}`
                  : 'Chưa cập nhật'}
              </p>
            </div>
          </div>

          <div className={styles.actionButtons}>
            {!isEditing ? (
              <button
                className={styles.editBtn}
                onClick={() => setIsEditing(true)}
                aria-label="Chỉnh sửa thông tin cá nhân"
              >
                ✏️ Chỉnh sửa thông tin
              </button>
            ) : (
              <div className={styles.saveCancelButtons}>
                <button
                  className={styles.saveBtn}
                  onClick={handleSave}
                  disabled={isSaving}
                  aria-label="Lưu thay đổi thông tin"
                >
                  💾 {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
                <button
                  className={styles.cancelBtn}
                  onClick={handleCancel}
                  disabled={isSaving}
                  aria-label="Hủy chỉnh sửa"
                >
                  ❌ Hủy
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoSection}>
          <h3>Thông tin chi tiết</h3>

          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <label htmlFor="nameInput">Họ và tên</label>
              {isEditing ? (
                <input
                  id="nameInput"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                  aria-required="true"
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.name || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="emailInput">Email</label>
              {isEditing ? (
                <input
                  id="emailInput"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                  aria-required="true"
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.email || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="phoneInput">Số điện thoại</label>
              {isEditing ? (
                <input
                  id="phoneInput"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.phone || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="unitNumberInput">Số nhà</label>
              {isEditing ? (
                <input
                  id="unitNumberInput"
                  type="text"
                  name="unitNumber"
                  value={formData.unitNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.unitNumber || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="streetNumberInput">Số đường</label>
              {isEditing ? (
                <input
                  id="streetNumberInput"
                  type="text"
                  name="streetNumber"
                  value={formData.streetNumber}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.streetNumber || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="addressLine1Input">Tên đường</label>
              {isEditing ? (
                <input
                  id="addressLine1Input"
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.addressLine1 || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="addressLine2Input">Số tầng</label>
              {isEditing ? (
                <input
                  id="addressLine2Input"
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.addressLine2 || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="cityInput">Thành phố</label>
              {isEditing ? (
                <input
                  id="cityInput"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.city || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="regionInput">Khu vực</label>
              {isEditing ? (
                <input
                  id="regionInput"
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.region || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="postalCodeInput">Mã bưu điện</label>
              {isEditing ? (
                <input
                  id="postalCodeInput"
                  type="text"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.postalCode || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="countryNameInput">Quốc gia</label>
              {isEditing ? (
                <input
                  id="countryNameInput"
                  type="text"
                  name="countryName"
                  value={formData.countryName}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.countryName || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="dateOfBirthInput">Ngày sinh</label>
              {isEditing ? (
                <input
                  id="dateOfBirthInput"
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              ) : (
                <p className={styles.infoValue}>
                  {userInfo.dateOfBirth
                    ? new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN')
                    : 'Chưa cập nhật'}
                </p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="genderInput">Giới tính</label>
              {isEditing ? (
                <select
                  id="genderInput"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className={styles.input}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              ) : (
                <p className={styles.infoValue}>{userInfo.gender || 'Chưa cập nhật'}</p>
              )}
            </div>

            <div className={styles.infoItem}>
              <label htmlFor="isDefaultInput">Đặt làm mặc định</label>
              {isEditing ? (
                <input
                  id="isDefaultInput"
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, isDefault: e.target.checked }))
                  }
                  className={styles.checkbox}
                />
              ) : (
                <p className={styles.infoValue}>{userInfo.isDefault ? 'Có' : 'Không'}</p>
              )}
            </div>
          </div>

          <div className={styles.infoItem}>
            <label htmlFor="bioInput">Giới thiệu bản thân</label>
            {isEditing ? (
              <textarea
                id="bioInput"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="4"
                placeholder="Hãy giới thiệu về bản thân bạn..."
              />
            ) : (
              <p className={styles.infoValue}>{userInfo.bio || 'Chưa cập nhật'}</p>
=======
import React, { useState } from 'react';
import styles from './UserProfile.module.css';


const [formData, setFormData] = useState(userInfo);

const handleInputChange = (e) => {
  const { name, value } = e.target;
  setFormData(prev => ({
    ...prev,
    [name]: value
  }));
};

const handleSave = async () => {
  try {
    // Update local state with form data
    setUserInfo(formData);
    setIsEditing(false);

    // Call the backend API to save user information
    const response = await fetch('http://localhost:8080/api/users/2', {
      method: 'PUT', // Use PUT for updating user data
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData), // Convert formData to JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const updatedUser = await response.json();
    console.log('User information saved:', updatedUser);

  } catch (error) {
    console.error('Error saving user information:', error);
    // Optionally show an error message to the user
    alert('Failed to save user information. Please try again.');
  }
};

const handleCancel = () => {
  setFormData(userInfo);
  setIsEditing(false);
};

return (
  <div className={styles.aboutContainer}>
    <div className={styles.aboutHeader}>
      <h1>Thông tin cá nhân</h1>
      <p>Quản lý thông tin tài khoản của bạn</p>
    </div>

    <div className={styles.aboutContent}>
      <div className={styles.profileSection}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            <img
              src="https://via.placeholder.com/120x120/4F46E5/FFFFFF?text=User"
              alt="Avatar"
              className={styles.avatarImage}
            />
            <button className={styles.changeAvatarBtn}>
              📷 Thay đổi ảnh
            </button>
          </div>
          <div className={styles.profileInfo}>
            <h2>{userInfo.name}</h2>
            <p className={styles.memberSince}>Thành viên từ tháng 1/2024</p>
          </div>
        </div>

        <div className={styles.actionButtons}>
          {!isEditing ? (
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              ✏️ Chỉnh sửa thông tin
            </button>
          ) : (
            <div className={styles.saveCancelButtons}>
              <button
                className={styles.saveBtn}
                onClick={handleSave}
              >
                💾 Lưu thay đổi
              </button>
              <button
                className={styles.cancelBtn}
                onClick={handleCancel}
              >
                ❌ Hủy
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={styles.infoSection}>
        <h3>Thông tin chi tiết</h3>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <label>Họ và tên</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <p className={styles.infoValue}>{userInfo.name}</p>
            )}
          </div>

          <div className={styles.infoItem}>
            <label>Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <p className={styles.infoValue}>{userInfo.email}</p>
            )}
          </div>

          <div className={styles.infoItem}>
            <label>Số điện thoại</label>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <p className={styles.infoValue}>{userInfo.phone}</p>
            )}
          </div>

          <div className={styles.infoItem}>
            <label>Ngày sinh</label>
            {isEditing ? (
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className={styles.input}
              />
            ) : (
              <p className={styles.infoValue}>
                {new Date(userInfo.dateOfBirth).toLocaleDateString('vi-VN')}
              </p>
            )}
          </div>

          <div className={styles.infoItem}>
            <label>Giới tính</label>
            {isEditing ? (
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className={styles.input}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
            ) : (
              <p className={styles.infoValue}>{userInfo.gender}</p>
            )}
          </div>

          <div className={styles.infoItem}>
            <label>Địa chỉ</label>
            {isEditing ? (
              <textarea
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={styles.textarea}
                rows="3"
              />
            ) : (
              <p className={styles.infoValue}>{userInfo.address}</p>
>>>>>>> parent of 5ed5ce4 (update theo db moi)
            )}
          </div>
        </div>

<<<<<<< HEAD
        <div className={styles.statsSection}>
          <h3>Thống kê hoạt động</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.orders}</div>
              <div className={styles.statLabel}>Đơn hàng đã mua</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.designs}</div>
              <div className={styles.statLabel}>Thiết kế đã tạo</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.rating}</div>
              <div className={styles.statLabel}>Đánh giá trung bình</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.favorites}</div>
              <div className={styles.statLabel}>Sản phẩm yêu thích</div>
            </div>
=======
        <div className={styles.infoItem}>
          <label>Giới thiệu bản thân</label>
          {isEditing ? (
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              className={styles.textarea}
              rows="4"
              placeholder="Hãy giới thiệu về bản thân bạn..."
            />
          ) : (
            <p className={styles.infoValue}>{userInfo.bio}</p>
          )}
        </div>
      </div>

      <div className={styles.statsSection}>
        <h3>Thống kê hoạt động</h3>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>15</div>
            <div className={styles.statLabel}>Đơn hàng đã mua</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>3</div>
            <div className={styles.statLabel}>Thiết kế đã tạo</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>8.5</div>
            <div className={styles.statLabel}>Đánh giá trung bình</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>12</div>
            <div className={styles.statLabel}>Sản phẩm yêu thích</div>
>>>>>>> parent of 5ed5ce4 (update theo db moi)
          </div>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  );
};

export default UserProfile;
=======
  </div>
);
};

export default About;
>>>>>>> parent of 5ed5ce4 (update theo db moi)
