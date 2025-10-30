<<<<<<< HEAD
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../../hooks/useCart';
import styles from './Header.module.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const { itemCount } = useCart();

=======
import React, { useMemo, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@/hooks/useCart";

// các helper auth lưu ở src/utils/auth.js
import {
  isAuthenticated,
  getRole,
  getEmail,
  clearAuth,
} from "@/utils/auth";

import styles from "./Header.module.css";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { itemCount } = useCart();

  const authed = isAuthenticated();
  const role = getRole();
  const email = getEmail();

  const username = useMemo(() => {
    if (!email) return "";
    const at = email.indexOf("@");
    return at > 0 ? email.slice(0, at) : email;
  }, [email]);

>>>>>>> origin/tan
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
<<<<<<< HEAD
    }
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navigationItems = [
    { label: 'Trang chủ', path: '/' },
    { label: 'Sản phẩm', path: '/products' },
    { label: 'Thử đồ AI', path: '/ai-try-on' },
    { label: 'Thiết kế', path: '/design' },
    { label: 'Giới thiệu', path: '/about' },
    { label: 'Liên hệ', path: '/contact' },
=======
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    // nếu bạn có API /auth/logout thì có thể gọi ở đây
    // try { await api.post("/auth/logout"); } catch {}
    clearAuth();
    setIsMobileMenuOpen(false);
    // nếu đang ở admin thì đẩy ra home
    if (pathname.startsWith("/admin")) navigate("/");
    else navigate("/login");
  };

  const navigationItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sản phẩm", path: "/products" },
    { label: "Thử đồ AI", path: "/ai-try-on" },
    { label: "Thiết kế", path: "/design" },
    { label: "Giới thiệu", path: "/about" },
    { label: "Liên hệ", path: "/contact" },
>>>>>>> origin/tan
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
<<<<<<< HEAD
        <Link to="/" className={styles.logo}>
=======
        <Link to="/" className={styles.logo} onClick={() => setIsMobileMenuOpen(false)}>
>>>>>>> origin/tan
          <div className={styles.logoIcon}>👽</div>
          <span className={styles.logoText}>TeeHub</span>
        </Link>

<<<<<<< HEAD
        {/* Desktop Navigation */}
        <nav className={styles.nav}>
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={styles.navLink}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Search Bar */}
=======
        {/* Desktop nav */}
        <nav className={styles.nav}>
          {navigationItems.map((item) => (
            <Link key={item.path} to={item.path} className={styles.navLink}>
              {item.label}
            </Link>
          ))}

          {/* Link Admin chỉ hiện với ROLE_ADMIN */}
          {authed && role === "ROLE_ADMIN" && (
            <Link to="/admin" className={styles.navLink}>
              Admin
            </Link>
          )}
        </nav>

        {/* Search */}
>>>>>>> origin/tan
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
<<<<<<< HEAD
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </div>
        </form>

        {/* User Actions */}
=======
            <button type="submit" className={styles.searchButton}>🔍</button>
          </div>
        </form>

        {/* Actions */}
>>>>>>> origin/tan
        <div className={styles.userActions}>
          {/* Cart */}
          <Link to="/cart" className={styles.cartLink}>
            🛒
<<<<<<< HEAD
            {itemCount > 0 && (
              <span className={styles.cartBadge}>{itemCount}</span>
            )}
          </Link>

          {/* User Menu */}
          <div className={styles.authButtons}>
            <button
              className={styles.authButton}
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </button>
            <button
              className={styles.authButtonPrimary}
              onClick={() => navigate('/user-profile')}
            >
              <span className={styles.avatarPlaceholder}></span>
              vanlong
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
=======
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </Link>

          {/* Auth area */}
          {!authed ? (
            <div className={styles.authButtons}>
              <button className={styles.authButton} onClick={() => navigate("/login")}>
                Đăng nhập
              </button>
            </div>
          ) : (
            <div className={styles.authButtons}>
              <button
                className={styles.authButtonPrimary}
                onClick={() => navigate("/me/profile")}
                title={email}
              >
                <span className={styles.avatarPlaceholder} />
                {username || "Tài khoản"}
              </button>
              <button className={styles.authButton} onClick={handleLogout}>
                Đăng xuất
              </button>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? "✕" : "☰"}
>>>>>>> origin/tan
          </button>
        </div>
      </div>

<<<<<<< HEAD
      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
=======
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <form className={styles.mobileSearch} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button type="submit">Tìm</button>
          </form>

>>>>>>> origin/tan
          <nav className={styles.mobileNav}>
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
<<<<<<< HEAD
          </nav>

          <div className={styles.mobileAuthButtons}>
            <button
              className={styles.mobileAuthButton}
              onClick={() => {
                navigate('/login');
                setIsMobileMenuOpen(false);
              }}
            >
              Đăng nhập
            </button>
            <button
              className={styles.mobileAuthButtonPrimary}
              onClick={() => {
                navigate('/register');
                setIsMobileMenuOpen(false);
              }}
            >
              Đăng ký
            </button>
=======

            {authed && role === "ROLE_ADMIN" && (
              <Link
                to="/admin"
                className={styles.mobileNavLink}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Admin
              </Link>
            )}
          </nav>

          <div className={styles.mobileAuthButtons}>
            {!authed ? (
              <>
                <button
                  className={styles.mobileAuthButton}
                  onClick={() => {
                    navigate("/login");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Đăng nhập
                </button>
              </>
            ) : (
              <>
                <button
                  className={styles.mobileAuthButtonPrimary}
                  onClick={() => {
                    navigate("/me/profile");
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {username || email}
                </button>
                <button className={styles.mobileAuthButton} onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            )}
>>>>>>> origin/tan
          </div>
        </div>
      )}
    </header>
  );
<<<<<<< HEAD
};

export default Header;
=======
}
>>>>>>> origin/tan
