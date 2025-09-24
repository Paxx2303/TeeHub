import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchValue.trim())}`);
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
  ];

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>👽</div>
          <span className={styles.logoText}>TeeHub</span>
        </Link>

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
        <form className={styles.searchForm} onSubmit={handleSearch}>
          <div className={styles.searchInputWrapper}>
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className={styles.searchInput}
            />
            <button type="submit" className={styles.searchButton}>
              🔍
            </button>
          </div>
        </form>

        {/* User Actions */}
        <div className={styles.userActions}>
          {/* Cart */}
          <Link to="/cart" className={styles.cartLink}>
            🛒
            <span className={styles.cartBadge}>0</span>
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
              onClick={() => navigate('/register')}
            >
              Đăng ký
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={handleMobileMenuToggle}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;