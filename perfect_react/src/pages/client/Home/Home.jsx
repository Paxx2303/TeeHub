import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../../services/mockProducts';
import styles from './Home.module.css';

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  // Dữ liệu slides cho hero section
  const slides = [
    {
      id: 1,
      icon: "👕",
      title: "Áo thun chất lượng cao",
      subtitle: "100% cotton tự nhiên"
    },
    {
      id: 2,
      icon: "🎨",
      title: "Thiết kế độc đáo",
      subtitle: "Công nghệ AI sáng tạo"
    },
    {
      id: 3,
      icon: "✨",
      title: "Phong cách cá nhân",
      subtitle: "Tùy chỉnh theo ý muốn"
    },
    {
      id: 4,
      icon: "🚀",
      title: "Công nghệ tiên tiến",
      subtitle: "Trải nghiệm mua sắm mới"
    }
  ];

  // Products data cho new section
  const featuredProducts = [
    { id: 1, name: "Classic White Tee", price: "299,000đ", image: "👕", rating: 5 },
    { id: 2, name: "Vintage Black Shirt", price: "359,000đ", image: "🖤", rating: 5 },
    { id: 3, name: "Colorful Design", price: "399,000đ", image: "🌈", rating: 4 },
    { id: 4, name: "Premium Cotton", price: "459,000đ", image: "✨", rating: 5 },
  ];
  const mockProduct = { ...(MOCK_PRODUCTS?.[0] || {}), name: 'Mockproduct' };

  // Tự động chuyển slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Intersection Observer cho animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[data-animate]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.home}>
      {/* Hero Section với Slideshow toàn màn hình */}
      <section className={`${styles.hero} ${styles.heroSlideshow}`}>
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`${styles.heroSlide} ${styles[`heroSlide${index + 1}`]} ${index === currentSlide ? styles.active : ''
              }`}
          >
            <div className={styles.heroOverlay}></div>
          </div>
        ))}

        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroTextAnimation}>
              <h1 className={styles.heroTitle}>
                Áo thun chất lượng cao với{' '}
                <span className={styles.highlight}>công nghệ AI</span>
              </h1>
              <p className={styles.heroDescription}>
                Khám phá bộ sưu tập áo thun đa dạng với tính năng thử đồ AI tiên tiến.
                Tạo ra những thiết kế độc đáo và phù hợp với phong cách của bạn.
              </p>
              <div className={styles.heroActions}>
                <button className={styles.primaryButton}>
                  <span>Khám phá ngay</span>
                  <span className={styles.buttonIcon}>→</span>
                </button>
                <button className={styles.outlineButton}>
                  <span className={styles.buttonIcon}>🤖</span>
                  <span>Thử đồ AI</span>
                </button>
              </div>
            </div>
          </div>

          <div className={styles.heroImage}>
            <div className={styles.heroSlideInfo}>
              <div className={`${styles.heroSlideIcon} ${currentSlide >= 0 ? styles.bounceAnimation : ''
                }`}>
                {slides[currentSlide]?.icon}
              </div>
              <h3 className={styles.heroSlideTitle}>
                {slides[currentSlide]?.title}
              </h3>
              <p className={styles.heroSlideSubtitle}>
                {slides[currentSlide]?.subtitle}
              </p>
            </div>
          </div>
        </div>

        <div className={styles.heroIndicators}>
          {slides.map((_, index) => (
            <button
              key={index}
              className={`${styles.heroIndicator} ${index === currentSlide ? styles.heroIndicatorActive : ''
                }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section className={styles.features} id="features" data-animate>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${isVisible.features ? styles.fadeInUp : ''}`}>
            <span className={styles.sectionBadge}>✨ Tính năng nổi bật</span>
            <h2 className={styles.sectionTitle}>Tại sao chọn chúng tôi?</h2>
            <p className={styles.sectionDescription}>
              Chúng tôi mang đến những trải nghiệm mua sắm tốt nhất với công nghệ hiện đại
            </p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureCard} ${styles.featureCardEnhanced}`}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>⚡</div>
              </div>
              <h3 className={styles.featureTitle}>Thử đồ AI</h3>
              <p className={styles.featureDescription}>
                Công nghệ AI tiên tiến giúp bạn thử áo thun trước khi mua
              </p>
              <div className={styles.featureArrow}>→</div>
            </div>
            <div className={`${styles.featureCard} ${styles.featureCardEnhanced}`}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>👥</div>
              </div>
              <h3 className={styles.featureTitle}>Thiết kế cá nhân</h3>
              <p className={styles.featureDescription}>
                Tạo ra những thiết kế độc đáo phù hợp với phong cách của bạn
              </p>
              <div className={styles.featureArrow}>→</div>
            </div>
            <div className={`${styles.featureCard} ${styles.featureCardEnhanced}`}>
              <div className={styles.featureIconWrapper}>
                <div className={styles.featureIcon}>⭐</div>
              </div>
              <h3 className={styles.featureTitle}>Chất lượng cao</h3>
              <p className={styles.featureDescription}>
                Sản phẩm được làm từ chất liệu cao cấp, bền đẹp theo thời gian
              </p>
              <div className={styles.featureArrow}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Products Section */}
      <section className={styles.products} id="products" data-animate>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${isVisible.products ? styles.fadeInUp : ''}`}>
            <span className={styles.sectionBadge}>🔥 Sản phẩm hot</span>
            <h2 className={styles.sectionTitle}>Bộ sưu tập nổi bật</h2>
            <p className={styles.sectionDescription}>
              Khám phá những mẫu áo thun được yêu thích nhất
            </p>
          </div>
          <div className={styles.productsGrid}>
            {mockProduct?.id && (
              <div
                className={`${styles.productCard} ${isVisible.products ? styles.slideInUp : ''}`}
                style={{ animationDelay: `0s` }}
              >
                <div className={styles.productImage}>
                  <div className={styles.productIcon}>🧪</div>
                  <div className={styles.productBadge}>MOCK</div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{mockProduct.name}</h3>
                  <div className={styles.productPrice}>
                    {mockProduct.price
                      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(mockProduct.price)
                      : '—'}
                  </div>
                </div>
                <Link to={`/products/${mockProduct.id}`} className={styles.productButton}>
                  Xem chi tiết
                </Link>
              </div>
            )}
            {featuredProducts.map((product, index) => (
              <div
                key={product.id}
                className={`${styles.productCard} ${isVisible.products ? styles.slideInUp : ''}`}
                style={{ animationDelay: `${(index + 1) * 0.1}s` }}
              >
                <div className={styles.productImage}>
                  <div className={styles.productIcon}>{product.image}</div>
                  <div className={styles.productBadge}>HOT</div>
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>{product.name}</h3>
                  <div className={styles.productRating}>
                    {'⭐'.repeat(product.rating)}
                  </div>
                  <div className={styles.productPrice}>{product.price}</div>
                </div>
                <button className={styles.productButton}>
                  Xem chi tiết
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className={styles.cta} id="cta" data-animate>
        <div className={styles.ctaBackground}>
          <div className={styles.ctaPattern}></div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.ctaContent} ${isVisible.cta ? styles.zoomIn : ''}`}>
            <div className={styles.ctaIcon}>🚀</div>
            <h2 className={styles.ctaTitle}>
              Sẵn sàng tạo ra phong cách riêng của bạn?
            </h2>
            <p className={styles.ctaDescription}>
              Bắt đầu thiết kế áo thun độc đáo với công cụ thiết kế mạnh mẽ của chúng tôi
            </p>
            <div className={styles.ctaActions}>
              <button className={`${styles.primaryButton} ${styles.ctaPrimaryButton}`}>
                <span>Bắt đầu thiết kế</span>
                <span className={styles.buttonIcon}>✨</span>
              </button>
              <button className={styles.ghostButton}>
                <span>Xem sản phẩm</span>
                <span className={styles.buttonIcon}>👀</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Enhanced */}
      <section className={styles.testimonials} id="testimonials" data-animate>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${isVisible.testimonials ? styles.fadeInUp : ''}`}>
            <span className={styles.sectionBadge}>💬 Đánh giá khách hàng</span>
            <h2 className={styles.sectionTitle}>Khách hàng nói gì về chúng tôi</h2>
            <p className={styles.sectionDescription}>
              Hàng nghìn khách hàng đã tin tưởng và hài lòng với dịch vụ của chúng tôi
            </p>
          </div>
          <div className={styles.testimonialsGrid}>
            <div className={`${styles.testimonialCard} ${styles.testimonialCardEnhanced}`}>
              <div className={styles.testimonialQuote}>"</div>
              <div className={styles.testimonialRating}>
                ⭐⭐⭐⭐⭐
              </div>
              <p className={styles.testimonialContent}>
                "Tôi rất hài lòng với dịch vụ thử đồ AI. Có thể thấy trước sản phẩm trước khi mua thật tuyệt vời!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👨</div>
                <div>
                  <h4 className={styles.authorName}>Nguyễn Văn A</h4>
                  <p className={styles.authorRole}>Khách hàng thân thiết</p>
                </div>
              </div>
            </div>
            <div className={`${styles.testimonialCard} ${styles.testimonialCardEnhanced}`}>
              <div className={styles.testimonialQuote}>"</div>
              <div className={styles.testimonialRating}>
                ⭐⭐⭐⭐⭐
              </div>
              <p className={styles.testimonialContent}>
                "Chất lượng áo thun rất tốt, thiết kế đẹp và giá cả hợp lý. Sẽ quay lại mua tiếp!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👩</div>
                <div>
                  <h4 className={styles.authorName}>Trần Thị B</h4>
                  <p className={styles.authorRole}>Khách hàng VIP</p>
                </div>
              </div>
            </div>
            <div className={`${styles.testimonialCard} ${styles.testimonialCardEnhanced}`}>
              <div className={styles.testimonialQuote}>"</div>
              <div className={styles.testimonialRating}>
                ⭐⭐⭐⭐⭐
              </div>
              <p className={styles.testimonialContent}>
                "Dịch vụ khách hàng chuyên nghiệp, giao hàng nhanh chóng. Rất recommend!"
              </p>
              <div className={styles.testimonialAuthor}>
                <div className={styles.authorAvatar}>👨‍💼</div>
                <div>
                  <h4 className={styles.authorName}>Lê Văn C</h4>
                  <p className={styles.authorRole}>CEO Startup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Enhanced */}
      <section className={styles.stats} id="stats" data-animate>
        <div className={styles.statsBackground}>
          <div className={styles.statsPattern}></div>
        </div>
        <div className={styles.container}>
          <div className={`${styles.statsGrid} ${isVisible.stats ? styles.slideInUp : ''}`}>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>👥</div>
              <h3 className={styles.statNumber}>10,000+</h3>
              <p className={styles.statLabel}>Khách hàng hài lòng</p>
              <div className={styles.statGlow}></div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>📦</div>
              <h3 className={styles.statNumber}>50,000+</h3>
              <p className={styles.statLabel}>Sản phẩm đã bán</p>
              <div className={styles.statGlow}></div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>💯</div>
              <h3 className={styles.statNumber}>99%</h3>
              <p className={styles.statLabel}>Tỷ lệ hài lòng</p>
              <div className={styles.statGlow}></div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statIcon}>🕐</div>
              <h3 className={styles.statNumber}>24/7</h3>
              <p className={styles.statLabel}>Hỗ trợ khách hàng</p>
              <div className={styles.statGlow}></div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section - New */}
      <section className={styles.newsletter} id="newsletter" data-animate>
        <div className={styles.container}>
          <div className={`${styles.newsletterContent} ${isVisible.newsletter ? styles.fadeIn : ''}`}>
            <div className={styles.newsletterIcon}>📧</div>
            <h2 className={styles.newsletterTitle}>Đăng ký nhận tin tức mới nhất</h2>
            <p className={styles.newsletterDescription}>
              Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và xu hướng thời trang
            </p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Nhập email của bạn..."
                className={styles.newsletterInput}
              />
              <button className={styles.newsletterButton}>
                Đăng ký ngay
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;