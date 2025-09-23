import React from 'react';
import styles from './Products.module.css';

const Products = () => {
  return (
    <div className={styles.products}>
      <div className={styles.container}>
        <h1 className={styles.title}>Sản phẩm</h1>
        <p className={styles.description}>
          Khám phá bộ sưu tập áo thun đa dạng của chúng tôi
        </p>
        {/* Product listing will be implemented here */}
      </div>
    </div>
  );
};

export default Products;
