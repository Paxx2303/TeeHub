import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../../services/productService';
import { MOCK_PRODUCTS } from '../../../services/mockProducts';
import styles from './Products.module.css';

const Products = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await productService.getProducts();
        if (!isMounted) return;
        const data = response?.data || response;
        const list = Array.isArray(data) ? data : (data?.items || []);
        setItems(list && list.length ? list : MOCK_PRODUCTS);
      } catch (err) {
        if (!isMounted) return;
        setError(err?.message || 'Không thể tải danh sách sản phẩm');
        setItems(MOCK_PRODUCTS);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchProducts();
    return () => { isMounted = false; };
  }, []);

  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <h1 className={styles.title}>Sản phẩm</h1>
        <p className={styles.description}>
          Khám phá bộ sưu tập áo thun đa dạng của chúng tôi
        </p>
        {isLoading && <p>Đang tải...</p>}
        {error && <p style={{ color: '#d00' }}>{error}</p>}
        {!isLoading && !error && (
          <div className={styles.grid}>
            {items.map((p) => (
              <div key={p.id} className={styles.card}>
                {p.image ? (
                  <img className={styles.thumb} src={p.image} alt={p.name || p.title} />
                ) : (
                  <div className={styles.thumb} />
                )}
                <div className={styles.cardBody}>
                  <div className={styles.name}>{p.name || p.title}</div>
                  {p.price != null && (
                    <div className={styles.price}>
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p.price)}
                    </div>
                  )}
                  <div className={styles.actions}>
                    <Link className={styles.linkBtn} to={`/products/${p.id}`}>Xem chi tiết</Link>
                    <Link className={`${styles.linkBtn} ${styles.secondaryBtn}`} to={`/products/${p.id}`}>Mua ngay</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
