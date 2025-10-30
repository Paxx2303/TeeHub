<<<<<<< HEAD
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
=======
// src/components/admin/AdminHeader/AdminHeader.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminHeader.module.css";

// dùng service & utils hiện có trong dự án
import { logout as apiLogout } from "@/services/authService"; // hàm gọi POST /auth/logout + clearAuth
import { clearAuth } from "@/utils/auth";                     // dự phòng nếu service chưa có

export default function AdminHeader() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleUserMenu = () => setIsUserMenuOpen((v) => !v);

  const handleLogout = async () => {
    try {
      // gọi BE để xoá refresh_token (cookie) + clear FE session
      if (apiLogout) {
        await apiLogout();
      } else {
        // fallback (nếu bạn chưa tạo service): tự xoá sessionStorage
        clearAuth();
      }
    } catch (_) {
      // ignore lỗi mạng, vẫn xoá phiên FE
      clearAuth();
    } finally {
      // điều hướng & thay thế history để Back không quay lại được
      navigate("/login", { replace: true });
    }
>>>>>>> origin/tan
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
<<<<<<< HEAD
        {/* Left side - Logo and title */}
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
=======
        {/* Left: Logo */}
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => navigate("/admin")} role="button">
>>>>>>> origin/tan
            <span className={styles.logoIcon}>👽</span>
            <span className={styles.logoText}>TeeHub Admin</span>
          </div>
        </div>

<<<<<<< HEAD
        {/* Right side - User menu and actions */}
        <div className={styles.headerRight}>
          {/* Notifications */}
          <div className={styles.notificationIcon}>
=======
        {/* Right: Actions & User menu */}
        <div className={styles.headerRight}>
          <div className={styles.notificationIcon} title="Thông báo">
>>>>>>> origin/tan
            <span className={styles.bellIcon}>🔔</span>
            <span className={styles.notificationBadge}>3</span>
          </div>

<<<<<<< HEAD
          {/* User menu */}
          <div className={styles.userMenu}>
            <button 
              className={styles.userButton}
              onClick={toggleUserMenu}
            >
              <div className={styles.userAvatar}>
                <img 
                  src="https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=A" 
=======
          <div className={styles.userMenu}>
            <button className={styles.userButton} onClick={toggleUserMenu}>
              <div className={styles.userAvatar}>
                <img
                  src="https://via.placeholder.com/40x40/4F46E5/FFFFFF?text=A"
>>>>>>> origin/tan
                  alt="Admin Avatar"
                />
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
              <span className={styles.dropdownIcon}>
<<<<<<< HEAD
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
=======
                {isUserMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/admin/profile");
                  }}
                >
                  <span className={styles.itemIcon}>👤</span>
                  <span>Thông tin cá nhân</span>
                </div>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    navigate("/admin/settings");
                  }}
                >
>>>>>>> origin/tan
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
<<<<<<< HEAD
};

export default AdminHeader;

=======
}
>>>>>>> origin/tan
