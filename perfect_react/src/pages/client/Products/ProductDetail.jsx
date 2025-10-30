import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import styles from './ProductDetail.module.css';
import { reviewService } from '../../../services/userReviewService';

const Carousel = ({ children, itemsPerView = 3, className = '' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = React.Children.toArray(children);
  const totalSlides = Math.ceil(items.length / itemsPerView);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const visibleItems = items.slice(
    currentIndex * itemsPerView,
    (currentIndex + 1) * itemsPerView
  );

  return (
    <div className={`${styles.carousel} ${className}`}>
      <button
        onClick={prevSlide}
        className={styles.carouselBtn}
        disabled={currentIndex === 0}
      >
        ◀
      </button>
      <div className={styles.carouselContent}>
        {visibleItems}
      </div>
      <button
        onClick={nextSlide}
        className={styles.carouselBtn}
        disabled={currentIndex >= totalSlides - 1}
      >
        ▶
      </button>
    </div>
  );
};

const ImageModal = ({ src, alt, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>✕</button>
        <img src={src} alt={alt} className={styles.modalImage} />
      </div>
    </div>
  );
};

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

const mockComments = [
  {
    text: 'Sản phẩm rất tốt, đóng gói cẩn thận, giao hàng nhanh!',
    rating: 5,
    date: new Date('2024-10-15'),
    userName: 'Nguyễn Văn A'
  },
  {
    text: 'Chất lượng ổn, giá hợp lý. Sẽ ủng hộ shop tiếp.',
    rating: 4,
    date: new Date('2024-10-10'),
    userName: 'Trần Thị B'
  },
  {
    text: 'Đúng như mô tả, mình rất hài lòng với sản phẩm này.',
    rating: 5,
    date: new Date('2024-10-05'),
    userName: 'Lê Văn C'
  }
];
const CURRENT_USER_ID = 1;
// ==================== MAIN COMPONENT ====================
const ProductDetail = () => {
  const { id } = useParams();

  // State cho dữ liệu sản phẩm
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  // State cho biến thể
  const [options, setOptions] = useState({});
  const [selectedOptions, setSelectedOptions] = useState({});
  const [currentItem, setCurrentItem] = useState(null);

  const [comments, setComments] = useState([]); 
  const [ratingStats, setRatingStats] = useState({ averageRating: 0.0, reviewCount: 0 });
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

  // ==================== EFFECT 1: Load Product ====================
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const [productData, reviewsData, statsData] = await Promise.all([
          productService.getProductById(id),
          reviewService.getReviews(id),
          reviewService.getRatingStats(id)
        ]);
        console.log(">>> DỮ LIỆU REVIEW THỰC TẾ TỪ API:", reviewsData);
        setProduct(productData);
        setComments(reviewsData);
        setRatingStats(statsData);
      } catch (err) {
        console.error(">>> Lỗi thực sự trong useEffect:", err);
        setError(err?.message || 'Không thể tải dữ liệu sản phẩm'); // Sửa thông báo lỗi
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // ==================== EFFECT 2: Parse Options ====================
  useEffect(() => {
    if (product && product.items && product.items.length > 0) {
      const newOptions = {};
      const initialSelection = {};

      // Thu thập tất cả các variation
      product.items.forEach(item => {
        if (item.configurations && Array.isArray(item.configurations)) {
          item.configurations.forEach(config => {
            if (!newOptions[config.variationName]) {
              newOptions[config.variationName] = new Set();
            }
            newOptions[config.variationName].add(config.value);
          });
        }
      });

      // Chuyển Set thành Array và chọn giá trị đầu tiên
      const finalOptions = {};
      Object.keys(newOptions).forEach(key => {
        finalOptions[key] = Array.from(newOptions[key]);
        initialSelection[key] = finalOptions[key][0];
      });

      setOptions(finalOptions);
      setSelectedOptions(initialSelection);
    }
  }, [product]);

  // ==================== EFFECT 3: Find Current Item ====================
  useEffect(() => {
    if (product && product.items && Object.keys(selectedOptions).length > 0) {
      const foundItem = product.items.find(item => {
        // Kiểm tra item có configurations không
        if (!item.configurations || !Array.isArray(item.configurations)) {
          return false;
        }

        // Kiểm tra số lượng configurations có khớp với số lượng options không
        if (item.configurations.length !== Object.keys(selectedOptions).length) {
          return false;
        }

        // Kiểm tra mọi configuration có khớp với selectedOptions không
        return item.configurations.every(config => {
          return config.value === selectedOptions[config.variationName];
        });
      });

      setCurrentItem(foundItem || null);
    }
  }, [product, selectedOptions]);

  // ==================== HANDLERS ====================
  const handleOptionClick = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleImageDoubleClick = () => {
    setIsImageModalOpen(true);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!currentItem) {
      alert('Vui lòng chọn một biến thể sản phẩm để đánh giá.');
      return;
    }

    if (newComment.trim() && userRating > 0) {
      try {
        const reviewData = {
          // SỬA: Dùng productItemId thay vì id (nếu API trả về productItemId)
          productItemId: currentItem.productItemId,
          userId: CURRENT_USER_ID,
          ratingValue: userRating,
          comment: newComment
        };

        const newReview = await reviewService.postReview(reviewData);

        // Cập nhật state với review mới NHẤT lên đầu
        setComments(prevComments => [newReview, ...prevComments]);

        // Gọi lại API để cập nhật stats
        const statsData = await reviewService.getRatingStats(id);
        setRatingStats(statsData);

        // Reset form
        setNewComment('');
        setUserRating(0);
        alert('Cảm ơn bạn đã đánh giá sản phẩm!');

      } catch (err) {
        alert('Gửi đánh giá thất bại: ' + err.message);
      }
      // Di chuyển else ra ngoài try-catch
    } else {
      alert('Vui lòng nhập bình luận và chọn đánh giá sao.');
    }
  };

  // ==================== RENDER LOADING ====================
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

  // ==================== RENDER ERROR ====================
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

  if (!product) {
    return null;
  }

  // ==================== RENDER MAIN ====================
  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">🏠 Trang chủ</Link>
          <span>/</span>
          <Link to="/products">📦 Sản phẩm</Link>
          {product.category && (
            <>
              <span>/</span>
              <Link to="/products">{product.category.categoryName}</Link>
            </>
          )}
          <span>/</span>
          <span>{product.productName}</span>
        </nav>

        {/* Main Content */}
        <div className={styles.content}>
          {/* Image Section */}
          <div className={styles.imageWrapper}>
            <img
              src={`/Product/${product.productMainImage}`}
              alt={product.productName}
              className={styles.image}
              onDoubleClick={handleImageDoubleClick}
              title="Double-click để phóng to"
            />
          </div>

          {/* Info Section */}
          <div className={styles.info}>
            <h1 className={styles.title}>{product.productName}</h1>

            {/* Rating Info */}
            <div className={styles.ratingInfo}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>
                  ⭐ {ratingStats.averageRating?.toFixed(1)}
                </span>
                <span style={{ color: '#64748b' }}>
                  {Math.round(ratingStats.averageRating)}/5
                </span>
                <span style={{ color: '#94a3b8' }}>|</span>
                <span style={{ color: '#64748b' }}>
                  {ratingStats.reviewCount} đánh giá
                </span>
                {/* (Tạm ẩn lượt mua vì API không có) */}
              </div>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className={styles.price}>
                {currentItem ? (
                  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentItem.price)
                ) : (
                  'Vui lòng chọn biến thể'
                )}
              </div>
            </div>

            {/* Meta Info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {currentItem && (
                <>
                  <div className={styles.metaRow}>
                    <span>📦 Mã SKU:</span>
                    <span className={styles.metaValue}>{currentItem.sku}</span>
                  </div>
                  <div className={styles.metaRow}>
                    <span>📊 Tồn kho:</span>
                    <span className={styles.metaValue}>
                      {currentItem.qtyInStock > 0 ? `${currentItem.qtyInStock} sản phẩm` : 'Hết hàng'}
                      {currentItem.qtyInStock > 0 && (
                        <span style={{
                          marginLeft: '8px',
                          color: currentItem.qtyInStock > 10 ? '#10b981' : '#f59e0b',
                          fontSize: '12px'
                        }}>
                          {currentItem.qtyInStock > 10 ? '✅ Còn hàng' : '⚠️ Sắp hết'}
                        </span>
                      )}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Description */}
            {product.productDescription && (
              <div>
                <h3 style={{ fontSize: '18px', marginBottom: '12px', color: '#1e293b' }}>📝 Mô tả sản phẩm</h3>
                <p className={styles.description}>{product.productDescription}</p>
              </div>
            )}

            {/* Options (Color, Size, etc.) */}
            {Object.entries(options).map(([optionName, values]) => (
              <div className={styles.optionGroup} key={optionName}>
                <div className={styles.optionLabel}>🎨 {optionName}</div>
                <div className={styles.chips}>
                  {values.map((value) => (
                    <span
                      key={value}
                      className={`${styles.chip} ${selectedOptions[optionName] === value ? styles.chipSelected : ''}`}
                      onClick={() => handleOptionClick(optionName, value)}
                      style={{
                        borderColor: selectedOptions[optionName] === value ? '#3b82f6' : '#e2e8f0',
                        backgroundColor: selectedOptions[optionName] === value ? '#dbeafe' : '#f8fafc',
                        color: selectedOptions[optionName] === value ? '#2563eb' : '#64748b',
                        cursor: 'pointer'
                      }}
                    >
                      {value}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Action Buttons */}
            <div className={styles.actions}>
              <button
                className={styles.primaryBtn}
                onClick={() => alert(`Đã thêm item SKU: ${currentItem?.sku}`)}
                disabled={!currentItem || currentItem.qtyInStock === 0}
              >
                {currentItem?.qtyInStock === 0 ? 'Hết hàng' : '🛒 Thêm vào giỏ'}
              </button>
              <button
                className={styles.secondaryBtn}
                onClick={() => alert('Chuyển đến trang thanh toán')}
                disabled={!currentItem || currentItem.qtyInStock === 0}
              >
                💳 Mua ngay
              </button>
            </div>

            {/* Benefits */}
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

        {/* Specs Section */}
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

        {/* FAQs Section */}
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

        {/* Comments Section */}
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
                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
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

          {/* Comments List */}
          <div className={styles.commentList}>
            <h3 style={{ marginBottom: '20px', color: '#1e293b' }}>
              📋 Tất cả đánh giá ({ratingStats.reviewCount})
            </h3>
            {/* Hiển thị nếu không có review */}
            {comments.length === 0 && !isLoading && (
              <p>Chưa có đánh giá nào cho sản phẩm này.</p>
            )}

            <div className={styles.commentsListContainer}>
              {comments.map((comment) => (
                <div key={comment.id} className={styles.commentCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        // SỬA: Đường dẫn avatar mặc định
                        src={comment.userAvatar || '/default-avatar.png'}
                        alt={comment.userName}
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div className={styles.commentRating}>
                          {'⭐'.repeat(comment.ratingValue)} ({comment.ratingValue}/5)
                        </div>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>
                          {comment.userName || 'Anonymous'}
                        </div>
                      </div>
                    </div>
                    <span className={styles.commentDate}>
                      {comment.createdAt ? ( // Kiểm tra xem createdAt có tồn tại không
                        new Intl.DateTimeFormat('vi-VN', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',   // Thêm giờ
                          minute: '2-digit'  // Thêm phút
                        }).format(new Date(comment.createdAt)) // Chuyển đổi sang Date object
                      ) : (
                        'Unknown date' // Hoặc hiển thị gì đó nếu không có ngày
                      )}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 0 50px', lineHeight: '1.6', color: '#475569' }}>
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* Suggestions Section */}
        <section className={styles.suggestions}>
          <h2 className={styles.sectionTitle}>🔥 Sản phẩm gợi ý</h2>

        </section>
      </div>

      {/* Image Modal */}
      <ImageModal
        src={currentItem?.itemImage || product.productMainImage}
        alt={product.productName}
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
      />
    </div>
  );
};


export default ProductDetail;