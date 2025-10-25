import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { getMockProductById } from '../../../services/mockProducts';
import styles from './ProductDetail.module.css';

// Mock data for FAQs and suggested products (in real app, this would come from API)
const mockFAQs = [
  {
    question: 'Sản phẩm này có bảo hành không?',
    answer: 'Có, sản phẩm được bảo hành 12 tháng kể từ ngày mua. Bảo hành bao gồm lỗi do nhà sản xuất và hỗ trợ kỹ thuật miễn phí.'
  },
  {
    question: 'Thời gian giao hàng bao lâu?',
    answer: 'Giao hàng trong 2-5 ngày làm việc tại khu vực nội thành và 5-7 ngày cho các tỉnh xa. Miễn phí giao hàng cho đơn hàng trên 500.000đ.'
  },
  {
    question: 'Có thể đổi trả sản phẩm không?',
    answer: 'Khách hàng có thể đổi trả trong vòng 7 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên vẹn, chưa sử dụng.'
  },
  {
    question: 'Làm sao để kiểm tra tình trạng đơn hàng?',
    answer: 'Bạn có thể kiểm tra tình trạng đơn hàng qua email xác nhận hoặc liên hệ hotline 1900-xxxx để được hỗ trợ.'
  },
  {
    question: 'Sản phẩm có được hoàn tiền không?',
    answer: 'Chúng tôi hỗ trợ hoàn tiền 100% trong trường hợp sản phẩm bị lỗi từ nhà sản xuất hoặc không đúng mô tả.'
  },
  {
    question: 'Có hỗ trợ trả góp không?',
    answer: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua các ngân hàng đối tác cho đơn hàng từ 3 triệu đồng trở lên.'
  }
];

const mockSuggestedProducts = [
  {
    id: '1',
    name: 'Áo sơ mi cao cấp',
    price: 450000,
    image: '/images/product1.jpg',
    rating: 4.5,
    discount: 20
  },
  {
    id: '2',
    name: 'Quần jean slim fit',
    price: 680000,
    image: '/images/product2.jpg',
    rating: 4.8,
    discount: 15
  },
  {
    id: '3',
    name: 'Giày thể thao nam',
    price: 890000,
    image: '/images/product3.jpg',
    rating: 4.6,
    discount: 25
  },
  {
    id: '4',
    name: 'Túi xách nữ thời trang',
    price: 320000,
    image: '/images/product4.jpg',
    rating: 4.7,
    discount: 10
  },
  {
    id: '5',
    name: 'Đồng hồ thông minh',
    price: 1200000,
    image: '/images/product5.jpg',
    rating: 4.9,
    discount: 30
  },
  {
    id: '6',
    name: 'Kính mát cao cấp',
    price: 750000,
    image: '/images/product6.jpg',
    rating: 4.4,
    discount: 18
  }
];

// Carousel Component
const Carousel = ({ children, itemsPerView = 1, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(itemsPerView);

  useEffect(() => {
    const updateItemsPerView = () => {
      if (window.innerWidth < 640) {
        setItemsToShow(1);
      } else if (window.innerWidth < 900) {
        setItemsToShow(Math.min(2, itemsPerView));
      } else {
        setItemsToShow(itemsPerView);
      }
    };

    updateItemsPerView();
    window.addEventListener('resize', updateItemsPerView);
    return () => window.removeEventListener('resize', updateItemsPerView);
  }, [itemsPerView]);

  const totalItems = React.Children.count(children);
  const maxIndex = Math.max(0, totalItems - itemsToShow);

  const nextSlide = () => {
    setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1);
  };

  const goToSlide = (index) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  return (
    <div className={`${styles.carousel} ${className}`}>
      <div className={styles.carouselContainer}>
        <div
          className={styles.carouselTrack}
          style={{
            transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
            width: `${(totalItems / itemsToShow) * 100}%`
          }}
        >
          {React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={styles.carouselItem}
              style={{ width: `${100 / totalItems}%` }}
            >
              {child}
            </div>
          ))}
        </div>

        {totalItems > itemsToShow && (
          <>
            <button
              className={`${styles.carouselBtn} ${styles.carouselPrev}`}
              onClick={prevSlide}
              aria-label="Previous"
            >
              ‹
            </button>
            <button
              className={`${styles.carouselBtn} ${styles.carouselNext}`}
              onClick={nextSlide}
              aria-label="Next"
            >
              ›
            </button>
          </>
        )}
      </div>

      {totalItems > itemsToShow && (
        <div className={styles.carouselDots}>
          {Array.from({ length: maxIndex + 1 }, (_, index) => (
            <button
              key={index}
              className={`${styles.carouselDot} ${currentIndex === index ? styles.carouselDotActive : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Image Modal Component
const ImageModal = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.imageModal} onClick={onClose}>
      <div className={styles.imageModalContent} onClick={e => e.stopPropagation()}>
        <button className={styles.imageModalClose} onClick={onClose}>
          ×
        </button>
        <img src={src} alt={alt} className={styles.imageModalImg} />
      </div>
    </div>
  );
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // State for user comments
  const [comments, setComments] = useState([
    {
      text: 'Sản phẩm rất chất lượng, đóng gói cẩn thận. Sẽ ủng hộ shop lần sau!',
      rating: 5,
      date: new Date('2024-01-15'),
      userName: 'Nguyễn Văn A'
    },
    {
      text: 'Giao hàng nhanh, sản phẩm đúng mô tả. Rất hài lòng với lần mua này.',
      rating: 4,
      date: new Date('2024-01-10'),
      userName: 'Trần Thị B'
    },
    {
      text: 'Chất lượng tốt, giá cả hợp lý. Đáng tiền!',
      rating: 5,
      date: new Date('2024-01-08'),
      userName: 'Lê Văn C'
    },
    {
      text: 'Sản phẩm ok, nhưng giao hàng hơi lâu. Nhìn chung vẫn ổn.',
      rating: 3,
      date: new Date('2024-01-05'),
      userName: 'Phạm Thị D'
    }
  ]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  // Fetch product details on component mount or ID change
  useEffect(() => {
    let isMounted = true;
    async function fetchProduct() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProductById(id);
        if (!isMounted) return;
        const data = response?.data || response;
        setProduct({
          ...data,
          // Mock additional data
          purchaseCount: Math.floor(Math.random() * 500) + 100,
          averageRating: (Math.random() * 2 + 3).toFixed(1),
          specs: data.specs || [
            { label: 'Chất liệu', value: 'Cotton cao cấp' },
            { label: 'Xuất xứ', value: 'Việt Nam' },
            { label: 'Kích thước', value: 'S, M, L, XL' },
            { label: 'Màu sắc', value: 'Đa dạng' },
            { label: 'Trọng lượng', value: '200g' }
          ],
          ...data,
        });
      } catch (err) {
        if (!isMounted) return;
        const mock = getMockProductById(id);
        if (mock) {
          setProduct({
            ...mock,
            purchaseCount: Math.floor(Math.random() * 500) + 100,
            averageRating: (Math.random() * 2 + 3).toFixed(1),
            specs: [
              { label: 'Chất liệu', value: 'Cotton cao cấp' },
              { label: 'Xuất xứ', value: 'Việt Nam' },
              { label: 'Kích thước', value: 'S, M, L, XL' },
              { label: 'Màu sắc', value: 'Đa dạng' },
              { label: 'Trọng lượng', value: '200g' }
            ]
          });
          setError(null);
        } else {
          setError(err?.message || 'Không thể tải sản phẩm');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProduct();
    return () => { isMounted = false; };
  }, [id]);

  // Set default selections when product loads
  useEffect(() => {
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
    }
  }, [product]);

  // Handle image double click
  const handleImageDoubleClick = () => {
    setIsImageModalOpen(true);
  };

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() && userRating > 0) {
      const newCommentObj = {
        text: newComment,
        rating: userRating,
        date: new Date(),
        userName: 'Khách hàng'
      };
      setComments([newCommentObj, ...comments]);
      setNewComment('');
      setUserRating(0);

      // Show success message (you can implement a toast notification)
      alert('Cảm ơn bạn đã đánh giá sản phẩm!');
    } else {
      alert('Vui lòng nhập bình luận và chọn số sao đánh giá!');
    }
  };

  // Render loading state with skeleton
  if (isLoading) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <div className={`${styles.breadcrumbs} ${styles.loading}`}>
            <div style={{ width: '200px', height: '16px', background: '#e2e8f0', borderRadius: '4px' }}></div>
          </div>
          <div className={styles.content}>
            <div className={`${styles.imageWrapper} ${styles.loading}`}>
              <div>Đang tải hình ảnh...</div>
            </div>
            <div className={`${styles.info} ${styles.loading}`}>
              <div style={{ width: '80%', height: '32px', background: '#e2e8f0', borderRadius: '8px', marginBottom: '16px' }}></div>
              <div style={{ width: '60%', height: '20px', background: '#e2e8f0', borderRadius: '4px', marginBottom: '16px' }}></div>
              <div style={{ width: '40%', height: '28px', background: '#e2e8f0', borderRadius: '6px', marginBottom: '16px' }}></div>
              <div style={{ width: '100%', height: '80px', background: '#e2e8f0', borderRadius: '8px' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <div className={styles.error}>
            <h2>⚠ Có lỗi xảy ra</h2>
            <p>{error}</p>
          </div>
          <Link to="/products" className={styles.backLink}>
            ← Quay lại danh sách sản phẩm
          </Link>
        </div>
      </div>
    );
  }

  // Render null if no product data
  if (!product) {
    return null;
  }

  // Calculate discount price if available
  const originalPrice = product.originalPrice || product.price * 1.2;
  const discountPercentage = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        {/* Breadcrumb navigation */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">🏠 Trang chủ</Link>
          <span>/</span>
          <Link to="/products">📦 Sản phẩm</Link>
          <span>/</span>
          <span>{product.name || product.title || `#${id}`}</span>
        </nav>

        {/* Main product content */}
        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name || product.title}
                className={styles.image}
                onDoubleClick={handleImageDoubleClick}
                title="Double-click để phóng to"
              />
            ) : (
              <div className={styles.imagePlaceholder}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
                <div>Không có hình ảnh</div>
              </div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{product.name || product.title}</h1>

            {/* Display average rating and purchase count */}
            <div className={styles.ratingInfo}>
              <span className={styles.averageRating}>
                ⭐ {product.averageRating} ({Math.floor(Math.random() * 50) + 10} đánh giá)
              </span>
              <span className={styles.purchaseCount}>
                🛒 {product.purchaseCount} lượt mua
              </span>
            </div>

            {/* Price section */}
            {product.price != null && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                <div className={styles.price}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </div>
                {discountPercentage > 0 && (
                  <>
                    <div style={{ textDecoration: 'line-through', color: '#94a3b8', fontSize: '16px' }}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)}
                    </div>
                    <span style={{
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      -{discountPercentage}%
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Meta information */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {product.sku && (
                <div className={styles.metaRow}>
                  <span>📦 Mã sản phẩm:</span>
                  <span className={styles.metaValue}>{product.sku}</span>
                </div>
              )}
              {typeof product.stock === 'number' && (
                <div className={styles.metaRow}>
                  <span>📊 Tồn kho:</span>
                  <span className={styles.metaValue}>
                    {product.stock > 0 ? `${product.stock} sản phẩm` : 'Hết hàng'}
                    {product.stock > 0 && (
                      <span style={{
                        marginLeft: '8px',
                        color: product.stock > 10 ? '#10b981' : '#f59e0b',
                        fontSize: '12px'
                      }}>
                        {product.stock > 10 ? '✅ Còn hàng' : '⚠️ Sắp hết'}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>

            {product.description && (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1e293b' }}>📝 Mô tả sản phẩm</h3>
                <p className={styles.description}>{product.description}</p>
              </div>
            )}

            {/* Color selection */}
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>🎨 Màu sắc</div>
                <div className={styles.chips}>
                  {product.colors.map((color) => (
                    <span
                      key={color.code}
                      className={`${styles.chip} ${selectedColor?.code === color.code ? styles.chipSelected : ''}`}
                      onClick={() => setSelectedColor(color)}
                      style={{
                        borderColor: selectedColor?.code === color.code ? '#3b82f6' : '#e2e8f0',
                        backgroundColor: selectedColor?.code === color.code ? '#dbeafe' : '#f8fafc',
                        color: selectedColor?.code === color.code ? '#2563eb' : '#64748b'
                      }}
                    >
                      {color.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Size selection */}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>📏 Kích thước</div>
                <div className={styles.chips}>
                  {product.sizes.map((size) => (
                    <span
                      key={size}
                      className={`${styles.chip} ${selectedSize === size ? styles.chipSelected : ''}`}
                      onClick={() => setSelectedSize(size)}
                      style={{
                        borderColor: selectedSize === size ? '#3b82f6' : '#e2e8f0',
                        backgroundColor: selectedSize === size ? '#dbeafe' : '#f8fafc',
                        color: selectedSize === size ? '#2563eb' : '#64748b'
                      }}
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={() => alert('Đã thêm vào giỏ hàng!')}
              >
                🛒 Thêm vào giỏ
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => alert('Chuyển đến trang thanh toán')}
              >
                💳 Mua ngay
              </button>
            </div>

            {/* Quick info */}
            <div style={{
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              padding: '16px',
              borderRadius: '12px',
              border: '1px solid #bae6fd',
              marginTop: '16px'
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                  <span>🚚</span>
                  <span>Miễn phí giao hàng cho đơn từ 500.000đ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                  <span>🔄</span>
                  <span>Đổi trả miễn phí trong 7 ngày</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0369a1' }}>
                  <span>🛡️</span>
                  <span>Bảo hành chính hãng 12 tháng</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Specs Section - Carousel */}
        {Array.isArray(product.specs) && product.specs.length > 0 && (
          <section className={styles.specs}>
            <h2 className={styles.sectionTitle}>📊 Thông số kỹ thuật</h2>
            <Carousel itemsPerView={2} className={styles.specsCarousel}>
              {product.specs.map((spec, idx) => (
                <div key={idx} className={styles.specCard}>
                  <div className={styles.specLabel}>{spec.label}</div>
                  <div className={styles.specValue}>{spec.value}</div>
                </div>
              ))}
            </Carousel>
          </section>
        )}

        {/* FAQs Section - Carousel */}
        <section className={styles.faqs}>
          <h2 className={styles.sectionTitle}>❓ Câu hỏi thường gặp</h2>
          <Carousel itemsPerView={2} className={styles.faqsCarousel}>
            {mockFAQs.map((faq, index) => (
              <div key={index} className={styles.faqCard}>
                <h3>Q: {faq.question}</h3>
                <p>A: {faq.answer}</p>
              </div>
            ))}
          </Carousel>
        </section>

        {/* Comments Section - Carousel */}
        <section className={styles.comments}>
          <h2 className={styles.sectionTitle}>💬 Đánh giá & Bình luận</h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'block' }}>
                Đánh giá của bạn
              </label>
              <div className={styles.ratingInput}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`${styles.star} ${userRating >= star ? styles.starActive : ''}`}
                    onClick={() => setUserRating(star)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.2)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    ⭐
                  </span>
                ))}
                <span style={{ marginLeft: '12px', color: '#64748b', fontSize: '14px' }}>
                  {userRating > 0 ? `${userRating}/5 sao` : 'Chưa chọn'}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontWeight: '600', color: '#1e293b', marginBottom: '8px', display: 'block' }}>
                Bình luận của bạn
              </label>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                className={styles.commentInput}
                maxLength={500}
              />
              <div style={{ fontSize: '12px', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
                {newComment.length}/500 ký tự
              </div>
            </div>

            <button type="submit" className={styles.submitComment}>
              📝 Gửi đánh giá
            </button>
          </form>

          {/* Comments Carousel */}
          <div className={styles.commentList}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
              📋 Tất cả đánh giá ({comments.length})
            </h3>

            <Carousel itemsPerView={2} className={styles.commentsCarousel}>
              {comments.map((comment, index) => (
                <div key={index} className={styles.commentCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <div className={styles.commentRating}>
                        {'⭐'.repeat(comment.rating)} ({comment.rating}/5)
                      </div>
                      <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                        {comment.userName || 'Khách hàng'}
                      </div>
                    </div>
                    <span className={styles.commentDate}>
                      {new Intl.DateTimeFormat('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      }).format(comment.date)}
                    </span>
                  </div>
                  <p style={{ margin: '0', lineHeight: '1.6', color: '#475569' }}>{comment.text}</p>
                </div>
              ))}
            </Carousel>
          </div>
        </section>

        {/* Suggested Products Section */}
        <section className={styles.suggestions}>
          <h2 className={styles.sectionTitle}>🔥 Sản phẩm gợi ý</h2>
          <Carousel itemsPerView={3} className={styles.suggestionsCarousel}>
            {mockSuggestedProducts.map((suggestion) => (
              <Link
                key={suggestion.id}
                to={`/products/${suggestion.id}`}
                className={styles.suggestionCard}
              >
                <div style={{ position: 'relative' }}>
                  <img
                    src={suggestion.image}
                    alt={suggestion.name}
                    className={styles.suggestionImage}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div style={{
                    display: 'none',
                    height: '180px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    color: '#64748b',
                    fontSize: '48px'
                  }}>
                    🖼️
                  </div>
                  {suggestion.discount && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      -{suggestion.discount}%
                    </div>
                  )}
                </div>
                <h3>{suggestion.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
                  <span style={{ color: '#f59e0b', fontSize: '14px' }}>
                    ⭐ {suggestion.rating}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <p style={{ margin: '0', fontWeight: '700', fontSize: '18px', color: '#dc2626' }}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(suggestion.price)}
                  </p>
                  {suggestion.discount && (
                    <span style={{
                      textDecoration: 'line-through',
                      color: '#94a3b8',
                      fontSize: '14px'
                    }}>
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(suggestion.price / (1 - suggestion.discount / 100))}
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </Carousel>
        </section>
      </div>

      {/* Image Modal */}
      <ImageModal
        src={product.image}
        alt={product.name || product.title}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
};

export default ProductDetail;