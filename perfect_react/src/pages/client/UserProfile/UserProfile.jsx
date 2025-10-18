<<<<<<< HEAD
<<<<<<< HEAD
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
=======
import React, { useState } from 'react';
>>>>>>> parent of 5ecf005 (Merge pull request #22 from Paxx2303/Pax)
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
<<<<<<< HEAD
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
=======
>>>>>>> parent of 5ecf005 (Merge pull request #22 from Paxx2303/Pax)
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
<<<<<<< HEAD
>>>>>>> parent of 5ed5ce4 (update theo db moi)
=======
>>>>>>> parent of 5ecf005 (Merge pull request #22 from Paxx2303/Pax)
            )}
          </div>
        </div>

<<<<<<< HEAD
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
=======
>>>>>>> parent of 5ecf005 (Merge pull request #22 from Paxx2303/Pax)
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
<<<<<<< HEAD
>>>>>>> parent of 5ed5ce4 (update theo db moi)
=======
>>>>>>> parent of 5ecf005 (Merge pull request #22 from Paxx2303/Pax)
          </div >
        </div >
      </div >
    </div >
<<<<<<< HEAD
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
=======
  </div>
);
};

export default About;
>>>>>>> parent of 5ecf005 (Merge pull request #22 from Paxx2303/Pax)
