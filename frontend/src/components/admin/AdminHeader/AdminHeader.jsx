import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminHeader.module.css';

const AdminHeader = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Xử lý logout
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        {/* Left side - Logo and title */}
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <span className={styles.logoIcon}>👽</span>
            <span className={styles.logoText}>TeeHub Admin</span>
          </div>
        </div>

        {/* Right side - User menu and actions */}
        <div className={styles.headerRight}>
          {/* Notifications */}
          <div className={styles.notificationIcon}>
            <span className={styles.bellIcon}>🔔</span>
            <span className={styles.notificationBadge}>3</span>
          </div>

          {/* User menu */}
          <div className={styles.userMenu}>
            <button 
              className={styles.userButton}
              onClick={toggleUserMenu}
            >
              <div className={styles.userAvatar}>
                <img 
                  src="https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=A" 
                  alt="Admin Avatar"
                />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
              <span className={styles.dropdownIcon}>
                {isUserMenuOpen ? '▲' : '▼'}
              </span>
            </button>

            {/* Dropdown menu */}
            {isUserMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownItem} onClick={() => navigate('/admin/profile')}>
                  <span className={styles.itemIcon}>👤</span>
                  <span>Thông tin cá nhân</span>
                </div>
                <div className={styles.dropdownItem} onClick={() => navigate('/admin/settings')}>
                  <span className={styles.itemIcon}>⚙️</span>
                  <span>Cài đặt</span>
                </div>
                <div className={styles.dropdownDivider}></div>
                <div className={styles.dropdownItem} onClick={handleLogout}>
                  <span className={styles.itemIcon}>🚪</span>
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
