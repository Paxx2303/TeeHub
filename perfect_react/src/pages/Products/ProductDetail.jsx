import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { getMockProductById } from '../../services/mockProducts';
import styles from './ProductDetail.module.css';

// Mock data for FAQs and suggested products (in real app, this would come from API)
const mockFAQs = [
  { question: 'Sản phẩm này có bảo hành không?', answer: 'Có, sản phẩm được bảo hành 12 tháng.' },
  { question: 'Thời gian giao hàng bao lâu?', answer: 'Giao hàng trong 2-5 ngày làm việc.' },
];

const mockSuggestedProducts = [
  { id: '1', name: 'Sản phẩm gợi ý 1', price: 100000, image: '/images/product1.jpg' },
  { id: '2', name: 'Sản phẩm gợi ý 2', price: 150000, image: '/images/product2.jpg' },
];

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for user comments
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userRating, setUserRating] = useState(0);

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
          purchaseCount: 150, // Number of times product was purchased
          averageRating: 4.2, // Average star rating
          ...data,
        });
      } catch (err) {
        if (!isMounted) return;
        const mock = getMockProductById(id);
        if (mock) {
          setProduct({
            ...mock,
            purchaseCount: 150,
            averageRating: 4.2,
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

  // Handle comment submission
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, { text: newComment, rating: userRating, date: new Date() }]);
      setNewComment('');
      setUserRating(0);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <p>Đang tải sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className={styles.productDetail}>
        <div className={styles.container}>
          <p className={styles.error}>{error}</p>
          <Link to="/products" className={styles.backLink}>← Quay lại danh sách</Link>
        </div>
      </div>
    );
  }

  // Render null if no product data
  if (!product) {
    return null;
  }

  return (
    <div className={styles.productDetail}>
      <div className={styles.container}>
        {/* Breadcrumb navigation */}
        <nav className={styles.breadcrumbs}>
          <Link to="/products">Sản phẩm</Link>
          <span>/</span>
          <span>{product.name || product.title || `#${id}`}</span>
        </nav>

        {/* Main product content */}
        <div className={styles.content}>
          <div className={styles.imageWrapper}>
            {product.image ? (
              <img src={product.image} alt={product.name || product.title} className={styles.image} />
            ) : (
              <div className={styles.imagePlaceholder}>No Image</div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{product.name || product.title}</h1>
            {/* Display average rating and purchase count */}
            <div className={styles.ratingInfo}>
              <span className={styles.averageRating}>★ {product.averageRating.toFixed(1)}</span>
              <span className={styles.purchaseCount}>({product.purchaseCount} lượt mua)</span>
            </div>
            {product.price != null && (
              <div className={styles.price}>
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </div>
            )}
            {product.sku && (
              <div className={styles.metaRow}>Mã SP: <span className={styles.metaValue}>{product.sku}</span></div>
            )}
            {typeof product.stock === 'number' && (
              <div className={styles.metaRow}>Tồn kho: <span className={styles.metaValue}>{product.stock}</span></div>
            )}
            {product.description && (
              <p className={styles.description}>{product.description}</p>
            )}
            <div className={styles.actions}>
              <button className={styles.primaryBtn}>Thêm vào giỏ</button>
              <button className={styles.secondaryBtn}>Mua ngay</button>
            </div>
            {Array.isArray(product.colors) && product.colors.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>Màu sắc</div>
                <div className={styles.chips}>
                  {product.colors.map((c) => (
                    <span key={c.code} className={styles.chip}>{c.name}</span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(product.sizes) && product.sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <div className={styles.optionLabel}>Kích thước</div>
                <div className={styles.chips}>
                  {product.sizes.map((s) => (
                    <span key={s} className={styles.chip}>{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Specs Section */}
        {Array.isArray(product.specs) && product.specs.length > 0 && (
          <section className={styles.specs}>
            <h2 className={styles.sectionTitle}>Thông số</h2>
            <ul className={styles.specList}>
              {product.specs.map((sp, idx) => (
                <li key={idx} className={styles.specItem}>
                  <span className={styles.specLabel}>{sp.label}</span>
                  <span className={styles.specValue}>{sp.value}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Care Section */}
        {Array.isArray(product.care) && product.care.length > 0 && (
          <section className={styles.care}>
            <h2 className={styles.sectionTitle}>Hướng dẫn bảo quản</h2>
            <ul className={styles.careList}>
              {product.care.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </section>
        )}

        {/* FAQs Section */}
        <section className={styles.faqs}>
          <h2>Câu hỏi thường gặp</h2>
          {mockFAQs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3>{faq.question}</h3>
              <p>{faq.answer}</p>
            </div>
          ))}
        </section>

        {/* Comments Section */}
        <section className={styles.comments}>
          <h2>Đánh giá và bình luận</h2>
          <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`${styles.star} ${userRating >= star ? styles.starActive : ''}`}
                  onClick={() => setUserRating(star)}
                >
                  ★
                </span>
              ))}
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Viết bình luận của bạn..."
              className={styles.commentInput}
            />
            <button type="submit" className={styles.submitComment}>Gửi bình luận</button>
          </form>
          <div className={styles.commentList}>
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <div key={index} className={styles.comment}>
                  <div className={styles.commentRating}>★ {comment.rating}</div>
                  <p>{comment.text}</p>
                  <span className={styles.commentDate}>
                    {new Intl.DateTimeFormat('vi-VN').format(comment.date)}
                  </span>
                </div>
              ))
            ) : (
              <p>Chưa có bình luận nào.</p>
            )}
          </div>
        </section>

        {/* Suggested Products Section */}
        <section className={styles.suggestions}>
          <h2>Sản phẩm gợi ý</h2>
          <div className={styles.suggestionList}>
            {mockSuggestedProducts.map((suggestion) => (
              <Link
                key={suggestion.id}
                to={`/products/${suggestion.id}`}
                className={styles.suggestionItem}
              >
                <img src={suggestion.image} alt={suggestion.name} className={styles.suggestionImage} />
                <h3>{suggestion.name}</h3>
                <p>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(suggestion.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;