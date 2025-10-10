import React, { useState } from 'react';
import styles from './Products.module.css';

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - sẽ thay thế bằng API calls
  const products = [
    {
      id: 'PROD001',
      name: 'Áo thun TeeHub Basic',
      category: 'Áo thun',
      price: 299000,
      stock: 150,
      sold: 89,
      status: 'active',
      image: 'https://via.placeholder.com/80x80/4F46E5/FFFFFF?text=T1',
      description: 'Áo thun cơ bản chất lượng cao',
      createdAt: '2024-01-10'
    },
    {
      id: 'PROD002',
      name: 'Áo hoodie TeeHub Premium',
      category: 'Áo hoodie',
      price: 599000,
      stock: 75,
      sold: 45,
      status: 'active',
      image: 'https://via.placeholder.com/80x80/10B981/FFFFFF?text=H1',
      description: 'Áo hoodie cao cấp với chất liệu premium',
      createdAt: '2024-01-08'
    },
    {
      id: 'PROD003',
      name: 'Áo polo TeeHub Sport',
      category: 'Áo polo',
      price: 399000,
      stock: 0,
      sold: 67,
      status: 'out_of_stock',
      image: 'https://via.placeholder.com/80x80/F59E0B/FFFFFF?text=P1',
      description: 'Áo polo thể thao thoáng mát',
      createdAt: '2024-01-05'
    },
    {
      id: 'PROD004',
      name: 'Áo thun custom design',
      category: 'Áo thun',
      price: 449000,
      stock: 25,
      sold: 23,
      status: 'active',
      image: 'https://via.placeholder.com/80x80/EF4444/FFFFFF?text=C1',
      description: 'Áo thun thiết kế tùy chỉnh',
      createdAt: '2024-01-03'
    }
  ];

  const categories = [
    { value: 'all', label: 'Tất cả danh mục' },
    { value: 'Áo thun', label: 'Áo thun' },
    { value: 'Áo hoodie', label: 'Áo hoodie' },
    { value: 'Áo polo', label: 'Áo polo' },
    { value: 'Áo sơ mi', label: 'Áo sơ mi' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      inactive: '#6b7280',
      out_of_stock: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Đang bán',
      inactive: 'Ngừng bán',
      out_of_stock: 'Hết hàng'
    };
    return texts[status] || status;
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      console.log(`Xóa sản phẩm ${productId}`);
    }
  };

  const handleToggleStatus = (productId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Thay đổi trạng thái sản phẩm ${productId} thành ${newStatus}`);
  };

  return (
    <div className={styles.products}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý sản phẩm</h1>
        <p className={styles.pageSubtitle}>Thêm, chỉnh sửa và quản lý sản phẩm</p>
      </div>

      {/* Filters and actions */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.categoryFilter}>
          <label className={styles.filterLabel}>Danh mục:</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.categorySelect}
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            ➕ Thêm sản phẩm
          </button>
          <button className={styles.exportBtn}>
            📊 Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Products grid */}
      <div className={styles.productsGrid}>
        {filteredProducts.map((product, index) => (
          <div key={index} className={styles.productCard}>
            <div className={styles.productImage}>
              <img src={product.image} alt={product.name} />
              <div className={styles.productStatus}>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(product.status) }}
                >
                  {getStatusText(product.status)}
                </span>
              </div>
            </div>

            <div className={styles.productInfo}>
              <div className={styles.productHeader}>
                <h3 className={styles.productName}>{product.name}</h3>
                <span className={styles.productId}>{product.id}</span>
              </div>

              <p className={styles.productDescription}>{product.description}</p>

              <div className={styles.productDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Danh mục:</span>
                  <span className={styles.detailValue}>{product.category}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Giá:</span>
                  <span className={styles.detailValue}>{formatCurrency(product.price)}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Tồn kho:</span>
                  <span className={`${styles.detailValue} ${product.stock === 0 ? styles.outOfStock : ''}`}>
                    {product.stock} sản phẩm
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Đã bán:</span>
                  <span className={styles.detailValue}>{product.sold} sản phẩm</span>
                </div>
              </div>

              <div className={styles.productActions}>
                <button 
                  className={styles.editBtn}
                  title="Chỉnh sửa"
                >
                  ✏️
                </button>
                <button 
                  className={styles.toggleBtn}
                  onClick={() => handleToggleStatus(product.id, product.status)}
                  title={product.status === 'active' ? 'Ngừng bán' : 'Kích hoạt'}
                >
                  {product.status === 'active' ? '⏸️' : '▶️'}
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteProduct(product.id)}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Thêm sản phẩm mới</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.addProductForm}>
                <div className={styles.formGroup}>
                  <label>Tên sản phẩm</label>
                  <input type="text" placeholder="Nhập tên sản phẩm" />
                </div>
                <div className={styles.formGroup}>
                  <label>Danh mục</label>
                  <select>
                    <option value="">Chọn danh mục</option>
                    <option value="Áo thun">Áo thun</option>
                    <option value="Áo hoodie">Áo hoodie</option>
                    <option value="Áo polo">Áo polo</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Giá</label>
                  <input type="number" placeholder="Nhập giá sản phẩm" />
                </div>
                <div className={styles.formGroup}>
                  <label>Số lượng tồn kho</label>
                  <input type="number" placeholder="Nhập số lượng" />
                </div>
                <div className={styles.formGroup}>
                  <label>Mô tả</label>
                  <textarea placeholder="Nhập mô tả sản phẩm" rows="3"></textarea>
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowAddModal(false)}>
                    Hủy
                  </button>
                  <button type="submit">Thêm sản phẩm</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;




