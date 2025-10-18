import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { label: 'Giới thiệu', path: '/about' },
      { label: 'Tin tức', path: '/news' },
      { label: 'Tuyển dụng', path: '/careers' },
      { label: 'Liên hệ', path: '/contact' },
    ],
    support: [
      { label: 'Trung tâm trợ giúp', path: '/help' },
      { label: 'Hướng dẫn mua hàng', path: '/guide' },
      { label: 'Chính sách đổi trả', path: '/return-policy' },
      { label: 'Bảo hành', path: '/warranty' },
    ],
    legal: [
      { label: 'Điều khoản sử dụng', path: '/terms' },
      { label: 'Chính sách bảo mật', path: '/privacy' },
      { label: 'Chính sách cookie', path: '/cookies' },
      { label: 'Pháp lý', path: '/legal' },
    ],
  };

  const socialLinks = [
    { icon: '📘', href: 'https://facebook.com', label: 'Facebook' },
    { icon: '🐦', href: 'https://twitter.com', label: 'Twitter' },
    { icon: '📷', href: 'https://instagram.com', label: 'Instagram' },
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Main Footer Content */}
        <div className={styles.mainContent}>
          {/* Company Info */}
          <div className={styles.companyInfo}>
            <Link to="/" className={styles.logo}>
              <div className={styles.logoIcon}>👕</div>
              <span className={styles.logoText}>T-Shirt Store</span>
            </Link>
            <p className={styles.description}>
              Chuyên cung cấp áo thun chất lượng cao với công nghệ thử đồ AI tiên tiến.
              Tạo ra những sản phẩm độc đáo và phù hợp với phong cách của bạn.
            </p>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📍</span>
                <span>123 Đường ABC, Quận 1, TP.HCM</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>📞</span>
                <span>+84 123 456 789</span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactIcon}>✉️</span>
                <span>info@tshirtstore.com</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          <div className={styles.footerLinks}>
            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Công ty</h3>
              <ul className={styles.linkList}>
                {footerLinks.company.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Hỗ trợ</h3>
              <ul className={styles.linkList}>
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h3 className={styles.linkGroupTitle}>Pháp lý</h3>
              <ul className={styles.linkList}>
                {footerLinks.legal.map((link) => (
                  <li key={link.path}>
                    <Link to={link.path} className={styles.link}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className={styles.newsletter}>
          <div className={styles.newsletterContent}>
            <h3 className={styles.newsletterTitle}>Đăng ký nhận tin</h3>
            <p className={styles.newsletterDescription}>
              Nhận thông tin về sản phẩm mới và ưu đãi đặc biệt
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Nhập email của bạn"
                className={styles.newsletterInput}
                required
              />
              <button type="submit" className={styles.newsletterButton}>
                Đăng ký
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.bottomFooter}>
          <div className={styles.copyright}>
            <p>&copy; {currentYear} T-Shirt Store. Tất cả quyền được bảo lưu.</p>
          </div>
          <div className={styles.socialLinks}>
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialLink}
                aria-label={social.label}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;