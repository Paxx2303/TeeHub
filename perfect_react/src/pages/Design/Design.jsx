import React from 'react';
import styles from './Design.module.css';

const Design = () => {
  return (
    <div className={styles.design}>
      <div className={styles.container}>
        <h1 className={styles.title}>Thiết kế áo thun</h1>
        <p className={styles.description}>
          Tạo ra những thiết kế độc đáo với công cụ thiết kế mạnh mẽ
        </p>
        {/* Design tools will be implemented here */}
      </div>
    </div>
  );
};

export default Design;
