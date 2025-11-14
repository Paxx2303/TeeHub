import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { reviewService } from '../../../services/userReviewService';

import styles from './Home.module.css';

// Format tiền
const formatCurrency = (amount) => {
  if (amount == null) return '—';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};
const renderStars = (rating) => {
  return '⭐'.repeat(Math.round(rating || 0));
};

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  const [hottestProducts, setHottestProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const slides = [
    { id: 1, icon: "👕", title: "Áo thun chất lượng cao", subtitle: "100% cotton tự nhiên" },
    { id: 2, icon: "🎨", title: "Thiết kế độc đáo", subtitle: "Công nghệ AI sáng tạo" },
    { id: 3, icon: "✨", title: "Phong cách cá nhân", subtitle: "Tùy chỉnh theo ý muốn" },
    { id: 4, icon: "💻", title: "Công nghệ tiên tiến", subtitle: "Trải nghiệm mua sắm mới" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    const fetchHottestProducts = async () => {
      try {
        setLoadingProducts(true);
        setErrorProducts(null);
        const data = await productService.getAllProducts(0, 6, null, null, 'hot');
        setHottestProducts(Array.isArray(data?.content) ? data.content : []);
      } catch (err) {
        console.error("Error fetching hottest products:", err);
        setErrorProducts("Không thể tải sản phẩm nổi bật.");
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchHottestProducts();
  }, []);

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

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoadingReviews(true);
        const data = await reviewService.getFeaturedReviews(3);
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Lỗi khi tải reviews:", err);
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
  }, []);

  /* ---------- RENDER HELPERS: build arrays with keys to avoid missing-key warnings ---------- */

  // Hero slides (map already uses key slide.id) — keep as-is but explicit
  const heroSlides = slides.map((slide, index) => (
    <div
      key={`hero-slide-${slide.id}`}
      className={`${styles.heroSlide} ${styles[`heroSlide${index + 1}`]} ${index === currentSlide ? styles.active : ''}`}
    >
      <div className={styles.heroOverlay}></div>
    </div>
  ));

  // Hero indicators — explicit keys
  const heroIndicators = slides.map((slide, index) => (
    <button
      key={`hero-ind-${slide.id}`}
      className={`${styles.heroIndicator} ${index === currentSlide ? styles.heroIndicatorActive : ''}`}
      onClick={() => setCurrentSlide(index)}
      aria-label={`Go to slide ${index + 1}`}
    />
  ));

  // Products grid children: build array, ensure each pushed element has a key
  const productGridChildren = [];
  if (loadingProducts) {
    productGridChildren.push(<p key="loading-products">Đang tải sản phẩm...</p>);
  } else if (errorProducts) {
    productGridChildren.push(<p key="error-products" style={{ color: 'red' }}>{errorProducts}</p>);
  } else if (!loadingProducts && !errorProducts) {
    if (hottestProducts.length === 0) {
      productGridChildren.push(<p key="no-products">Chưa có sản phẩm nào.</p>);
    } else {
      hottestProducts.forEach((product, idx) => {
        const displayItem = product.items?.[0];
        const finalPrice = displayItem ? displayItem.price : null;
        const hasSale = displayItem && displayItem.discountRate > 0;

        productGridChildren.push(
          <div
            key={product.productId ?? `prod-${idx}`} // fallback if id missing
            className={`${styles.productCard} ${isVisible.products ? styles.slideInUp : ''}`}
            style={{ animationDelay: `${(idx + 1) * 0.1}s` }}
          >
            <div className={styles.productImage}>
              <img
                src={`/Product/${product.productMainImage}`}
                alt={product.productName}
                className={styles.productImageIcon}
              />
              {hasSale && (
                <div className={styles.productBadge}>
                  -{Math.round(displayItem.discountRate)}%
                </div>
              )}
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.productName}</h3>
              <div className={styles.productPrice}>
                {formatCurrency(finalPrice)}
                <div>
                  {product.totalSold > 0 && (
                    <span className={styles.soldCountHome}>Đã bán {product.totalSold}</span>
                  )}
                </div>
              </div>
            </div>
            <Link to={`/products/${product.productId}`} className={styles.productButton}>Xem chi tiết</Link>
          </div>
        );
      });
    }
  }

  // Testimonials children: same pattern to ensure keys
  const testimonialChildren = [];
  if (loadingReviews) {
    testimonialChildren.push(<p key="loading-reviews">Đang tải đánh giá...</p>);
  } else {
    if (reviews.length === 0) {
      testimonialChildren.push(<p key="no-reviews">Chưa có đánh giá nào.</p>);
    } else {
      reviews.forEach((review) => {
        testimonialChildren.push(
          <div key={review.reviewId ?? `rev-${Math.random().toString(36).slice(2, 9)}`} className={`${styles.testimonialCard} ${styles.testimonialCardEnhanced}`}>
            <div className={styles.testimonialQuote}>“</div>
            <div className={styles.testimonialRating}>{renderStars(review.ratingValue)}</div>
            <p className={styles.testimonialContent}>{review.comment}</p>
            <div className={styles.testimonialAuthor}>
              <div className={styles.authorAvatar}>
                {review.user?.userAvatar ? (
                  <img src={`/avatars/${review.user.userAvatar}`} alt={review.user.fullName} />
                ) : (
                  <span>{review.user?.fullName ? review.user.fullName.charAt(0) : 'Ẩ'}</span>
                )}
              </div>
              <div>
                <h4 className={styles.authorName}>{review.user?.fullName || 'Người dùng ẩn'}</h4>
                <p className={styles.authorRole}>Khách hàng</p>
              </div>
            </div>
          </div>
        );
      });
    }
  }

  // always push CTA at end with key
  testimonialChildren.push(
    <div key="testimonials-cta" className={styles.testimonialsCta}>
      <p>Bạn đã sẵn sàng tự thiết kế áo của mình chưa?</p>
      <Link to="/ai-try-on" className={styles.btnPrimary}>Thử ngay AI Try-On →</Link>
    </div>
  );

  return (
    <div className={styles.home}>
      {/* HERO */}
      <section className={`${styles.hero} ${styles.heroSlideshow}`}>
        {heroSlides}
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <div className={styles.heroTextAnimation}>
              <h1 className={styles.heroTitle}>
                Áo thun chất lượng cao với <span className={styles.highlight}>công nghệ AI</span>
              </h1>
              <p className={styles.heroDescription}>
                Khám phá bộ sưu tập áo thun đa dạng với tính năng thử đồ AI tiên tiến.
                Tạo ra những thiết kế độc đáo và phù hợp với phong cách của bạn.
              </p>
              <div className={styles.heroActions}>
                <Link to="/ai-try-on" className={styles.ghostButton}>
                <span>Thử đồ AI</span><span className={styles.buttonIcon}></span>
                </Link>
                <Link to="/products" className={styles.ghostButton}>
                <span>Xem sản phẩm</span><span className={styles.buttonIcon}></span>
                </Link>
              </div>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.heroSlideInfo}>
              <div className={`${styles.heroSlideIcon} ${currentSlide >= 0 ? styles.bounceAnimation : ''}`}>
                {slides[currentSlide]?.icon}
              </div>
              <h3 className={styles.heroSlideTitle}>{slides[currentSlide]?.title}</h3>
              <p className={styles.heroSlideSubtitle}>{slides[currentSlide]?.subtitle}</p>
            </div>
          </div>
        </div>

        <div className={styles.heroIndicators}>
          {heroIndicators}
        </div>
      </section>

      {/* FEATURES */}
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
              <div className={styles.featureIconWrapper}><div className={styles.featureIcon}>📸</div></div>
              <h3 className={styles.featureTitle}>Thử đồ AI</h3>
              <p className={styles.featureDescription}>Công nghệ AI tiên tiến giúp bạn thử áo thun trước khi mua</p>
              <div className={styles.featureArrow}>→</div>
            </div>
            <div className={`${styles.featureCard} ${styles.featureCardEnhanced}`}>
              <div className={styles.featureIconWrapper}><div className={styles.featureIcon}>🎨</div></div>
              <h3 className={styles.featureTitle}>Thiết kế cá nhân</h3>
              <p className={styles.featureDescription}>Tạo ra những thiết kế độc đáo phù hợp với phong cách của bạn</p>
              <div className={styles.featureArrow}>→</div>
            </div>
            <div className={`${styles.featureCard} ${styles.featureCardEnhanced}`}>
              <div className={styles.featureIconWrapper}><div className={styles.featureIcon}>✨</div></div>
              <h3 className={styles.featureTitle}>Chất lượng cao</h3>
              <p className={styles.featureDescription}>Sản phẩm được làm từ chất liệu cao cấp, bền đẹp theo thời gian</p>
              <div className={styles.featureArrow}>→</div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className={styles.products} id="products" data-animate>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${isVisible.products ? styles.fadeInUp : ''}`}>
            <span className={styles.sectionBadge}>🔥 Sản phẩm hot</span>
            <h2 className={styles.sectionTitle}>Bộ sưu tập nổi bật</h2>
            <p className={styles.sectionDescription}>Khám phá những mẫu áo thun được yêu thích nhất</p>
          </div>

          <div className={styles.productsGrid}>
            {productGridChildren}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta} id="cta" data-animate>
        <div className={styles.ctaBackground}><div className={styles.ctaPattern}></div></div>
        <div className={styles.container}>
          <div className={`${styles.ctaContent} ${isVisible.cta ? styles.zoomIn : ''}`}>
            <div className={styles.ctaIcon}></div>
            <h2 className={styles.ctaTitle}>Sẵn sàng tạo ra phong cách riêng của bạn?</h2>
            <p className={styles.ctaDescription}>Bắt đầu thiết kế áo thun độc đáo với công cụ thiết kế mạnh mẽ của chúng tôi</p>
            <div className={styles.ctaActions}>
              <Link to="/design" className={`${styles.primaryButton} ${styles.ctaPrimaryButton}`}>
                <span>Bắt đầu thiết kế</span><span className={styles.buttonIcon}></span>
              </Link>
              <Link to="/products" className={styles.ghostButton}>
                <span>Xem sản phẩm</span><span className={styles.buttonIcon}></span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className={styles.testimonials} id="testimonials" data-animate>
        <div className={styles.container}>
          <div className={`${styles.sectionHeader} ${isVisible.testimonials ? styles.fadeInUp : ''}`}>
            <span className={styles.sectionBadge}>💬 Đánh giá mới nhất từ khách hàng</span>
            <h2 className={styles.sectionTitle}>Họ đã thử, đã mặc, đã yêu</h2>
            <p className={styles.sectionDescription}>Khách hàng đã dùng AI thử đồ và tự thiết kế áo phông của riêng mình</p>
          </div>

          <div className={styles.testimonialsGrid}>
            {testimonialChildren}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={styles.stats} id="stats" data-animate>
        <div className={styles.statsBackground}><div className={styles.statsPattern}></div></div>
        <div className={styles.container}>
          <div className={`${styles.statsGrid} ${isVisible.stats ? styles.slideInUp : ''}`}>
            <div className={styles.statItem}><div className={styles.statIcon}>👥</div><h3 className={styles.statNumber}>10,000+</h3><p className={styles.statLabel}>Khách hàng hài lòng</p><div className={styles.statGlow}></div></div>
            <div className={styles.statItem}><div className={styles.statIcon}>📦</div><h3 className={styles.statNumber}>50,000+</h3><p className={styles.statLabel}>Sản phẩm đã bán</p><div className={styles.statGlow}></div></div>
            <div className={styles.statItem}><div className={styles.statIcon}>💯</div><h3 className={styles.statNumber}>99%</h3><p className={styles.statLabel}>Tỷ lệ hài lòng</p><div className={styles.statGlow}></div></div>
            <div className={styles.statItem}><div className={styles.statIcon}>🕐</div><h3 className={styles.statNumber}>24/7</h3><p className={styles.statLabel}>Hỗ trợ khách hàng</p><div className={styles.statGlow}></div></div>
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={styles.newsletter} id="newsletter" data-animate>
        <div className={styles.container}>
          <div className={`${styles.newsletterContent} ${isVisible.newsletter ? styles.fadeIn : ''}`}>
            <div className={styles.newsletterIcon}>📧</div>
            <h2 className={styles.newsletterTitle}>Đăng ký nhận tin tức mới nhất</h2>
            <p className={styles.newsletterDescription}>Nhận thông tin về sản phẩm mới, khuyến mãi đặc biệt và xu hướng thời trang</p>
            <div className={styles.newsletterForm}>
              <input
                type="email"
                data-ch="newsletter-input"
                placeholder="Nhập email của bạn..."
                className={styles.newsletterInput}
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <Link to="/login" className={styles.newsletterButton}>
                <button>Đăng ký ngay</button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
