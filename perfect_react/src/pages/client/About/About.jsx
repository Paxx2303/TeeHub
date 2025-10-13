import React, { useState } from 'react';
import styles from './About.module.css';

const About = () => {
  const features = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <circle cx="12" cy="10" r="2" />
        </svg>
      ),
      title: 'Thử Đồ Bằng AI',
      description: 'Công nghệ AI tiên tiến giúp bạn xem trước áo phông trên chính hình ảnh của mình, không cần thử thật'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <path d="M17.66 8.34l-11.31 11.31" />
        </svg>
      ),
      title: 'Thiết Kế Theo Sở Thích',
      description: 'Tự do sáng tạo với công cụ thiết kế trực tuyến, tạo ra chiếc áo độc nhất chỉ dành riêng cho bạn'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
      title: 'Chất Lượng Premium',
      description: 'Vải cotton 100% cao cấp, form dáng chuẩn, màu sắc bền đẹp theo thời gian'
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      ),
      title: 'Giao Hàng Nhanh',
      description: 'Đặt hàng hôm nay, nhận hàng trong 2-3 ngày, miễn phí ship cho đơn từ 500k'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Khách Hàng' },
    { number: '100K+', label: 'Áo Đã Bán' },
    { number: '4.9/5', label: 'Đánh Giá' },
    { number: '24/7', label: 'Hỗ Trợ' }
  ];

  return (
    <div className={styles.aboutContainer}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>
            Về <span className={styles.highlight}>TeeAI</span>
          </h1>
          <p className={styles.subtitle}>
            Nơi công nghệ AI gặp gỡ thời trang cá nhân hóa
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.story}>
        <div className={styles.storyContent}>
          <div className={styles.storyText}>
            <h2 className={styles.sectionTitle}>Câu Chuyện Của Chúng Tôi</h2>
            <p className={styles.paragraph}>
              TeeAI ra đời từ ý tưởng đơn giản: mỗi người đều xứng đáng có một chiếc áo phông hoàn hảo,
              phản ánh đúng phong cách và cá tính của mình.
            </p>
            <p className={styles.paragraph}>
              Chúng tôi kết hợp công nghệ AI thử đồ ảo với công cụ thiết kế trực tuyến,
              giúp bạn dễ dàng tìm kiếm và tạo ra những chiếc áo độc đáo nhất.
              Không còn lo lắng về size áo hay màu sắc không phù hợp -
              hãy để AI giúp bạn "thử" trước khi quyết định!
            </p>
            <div className={styles.mission}>
              <svg className={styles.heartIcon} viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <p className={styles.missionText}>
                Sứ mệnh của chúng tôi là mang đến trải nghiệm mua sắm thời trang
                hiện đại, tiện lợi và đầy cảm hứng cho mọi người.
              </p>
            </div>
          </div>
          <div className={styles.storyImage}>
            <div className={styles.imagePlaceholder}>
              <svg className={styles.bagIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>Hơn 100,000+ áo phông đã được giao đến tay khách hàng</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <h2 className={styles.sectionTitle}>Điểm Khác Biệt</h2>
        <div className={styles.featureGrid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.featureCard}>
              <div className={styles.iconWrapper}>
                {feature.icon}
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.statCard}>
              <div className={styles.statNumber}>{stat.number}</div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <h2 className={styles.ctaTitle}>Sẵn Sàng Tạo Chiếc Áo Của Riêng Bạn?</h2>
        <p className={styles.ctaText}>
          Khám phá bộ sưu tập của chúng tôi hoặc bắt đầu thiết kế ngay hôm nay
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.primaryBtn}>Khám Phá Sản Phẩm</button>
          <button className={styles.secondaryBtn}>Thiết Kế Ngay</button>
        </div>
      </section>
    </div>
  );
};

export default About;

