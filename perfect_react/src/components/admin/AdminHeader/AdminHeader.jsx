// src/components/admin/AdminHeader/AdminHeader.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./AdminHeader.module.css";
import logoImg from "../../../assets/t1.png";

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
  };

  return (
    <header className={styles.adminHeader}>
      <div className={styles.headerContent}>
        {/* Left: Logo */}
        <div className={styles.headerLeft}>
          <div className={styles.logo} onClick={() => navigate("/admin")} role="button">
            <span className={styles.logoIcon}><img src={logoImg} alt="TeeHub Logo" /></span>
            <span className={styles.logoText}>TeeHub Admin</span>
          </div>
        </div>

        {/* Right: Actions & User menu */}
        <div className={styles.headerRight}>
          <div className={styles.notificationIcon} title="Thông báo">
            <span className={styles.bellIcon}></span>

          </div>

          <div className={styles.userMenu}>
            <button className={styles.userButton} onClick={toggleUserMenu}>

              <div className={styles.userInfo}>
                <span className={styles.userName}>Admin User</span>
                <span className={styles.userRole}>Administrator</span>
              </div>
              <span className={styles.dropdownIcon}>
                {isUserMenuOpen ? "▲" : "▼"}
              </span>
            </button>

            {isUserMenuOpen && (
              <div className={styles.dropdownMenu}>


                <div className={styles.dropdownItem} onClick={handleLogout}>
                  <span className={styles.itemIcon}><button
                    className={styles.authButton}
                    onClick={handleLogout}
                    title="Đăng xuất"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button></span>
                  <span>Đăng xuất</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
