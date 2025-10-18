import React, { useState } from 'react';
import styles from './Orders.module.css';

const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - sẽ thay thế bằng API calls
  const orders = [
    {
      id: 'ORD001',
      customer: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      products: [
        { name: 'Áo thun TeeHub Basic', quantity: 2, price: 299000 },
        { name: 'Áo hoodie TeeHub Premium', quantity: 1, price: 599000 }
      ],
      total: 1197000,
      status: 'pending',
      paymentMethod: 'COD',
      orderDate: '2024-01-15',
      shippingAddress: '123 Đường ABC, Quận 1, TP.HCM'
    },
    {
      id: 'ORD002',
      customer: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      products: [
        { name: 'Áo polo TeeHub Sport', quantity: 1, price: 399000 }
      ],
      total: 399000,
      status: 'processing',
      paymentMethod: 'Bank Transfer',
      orderDate: '2024-01-15',
      shippingAddress: '456 Đường XYZ, Quận 2, TP.HCM'
    },
    {
      id: 'ORD003',
      customer: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0369852147',
      products: [
        { name: 'Áo thun custom design', quantity: 3, price: 449000 }
      ],
      total: 1347000,
      status: 'shipped',
      paymentMethod: 'Credit Card',
      orderDate: '2024-01-14',
      shippingAddress: '789 Đường DEF, Quận 3, TP.HCM'
    },
    {
      id: 'ORD004',
      customer: 'Phạm Thị D',
      email: 'phamthid@email.com',
      phone: '0741852963',
      products: [
        { name: 'Áo thun TeeHub Basic', quantity: 1, price: 299000 },
        { name: 'Áo polo TeeHub Sport', quantity: 2, price: 399000 }
      ],
      total: 1097000,
      status: 'completed',
      paymentMethod: 'COD',
      orderDate: '2024-01-14',
      shippingAddress: '321 Đường GHI, Quận 4, TP.HCM'
    }
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã giao' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      processing: '#8b5cf6',
      shipped: '#3b82f6',
      completed: '#10b981',
      cancelled: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      pending: 'Chờ xử lý',
      processing: 'Đang xử lý',
      shipped: 'Đã giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy'
    };
    return texts[status] || status;
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleStatusChange = (orderId, newStatus) => {
    // Xử lý thay đổi trạng thái đơn hàng
    console.log(`Thay đổi trạng thái đơn hàng ${orderId} thành ${newStatus}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  return (
    <div className={styles.orders}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý đơn hàng</h1>
        <p className={styles.pageSubtitle}>Theo dõi và xử lý tất cả đơn hàng</p>
      </div>

      {/* Filters and search */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm theo mã đơn, tên khách hàng, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.statusFilter}>
          <label className={styles.filterLabel}>Trạng thái:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className={styles.statusSelect}
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.exportBtn}>
            📊 Xuất báo cáo
          </button>
          <button className={styles.refreshBtn}>
            🔄 Làm mới
          </button>
        </div>
      </div>

      {/* Orders table */}
      <div className={styles.ordersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Mã đơn</div>
          <div className={styles.tableCell}>Khách hàng</div>
          <div className={styles.tableCell}>Sản phẩm</div>
          <div className={styles.tableCell}>Tổng tiền</div>
          <div className={styles.tableCell}>Trạng thái</div>
          <div className={styles.tableCell}>Ngày đặt</div>
          <div className={styles.tableCell}>Thao tác</div>
        </div>

        {filteredOrders.map((order, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <span className={styles.orderId}>{order.id}</span>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.customerInfo}>
                <div className={styles.customerName}>{order.customer}</div>
                <div className={styles.customerContact}>
                  {order.email} • {order.phone}
                </div>
              </div>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.productsList}>
                {order.products.map((product, idx) => (
                  <div key={idx} className={styles.productItem}>
                    <span className={styles.productName}>{product.name}</span>
                    <span className={styles.productQuantity}>x{product.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.totalAmount}>
                {formatCurrency(order.total)}
              </span>
            </div>
            <div className={styles.tableCell}>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                className={styles.statusSelect}
                style={{ 
                  backgroundColor: getStatusColor(order.status),
                  color: 'white',
                  border: 'none'
                }}
              >
                {statusOptions.slice(1).map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.orderDate}>
                {new Date(order.orderDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.actionButtons}>
                <button 
                  className={styles.viewBtn}
                  title="Xem chi tiết"
                >
                  👁️
                </button>
                <button 
                  className={styles.editBtn}
                  title="Chỉnh sửa"
                >
                  ✏️
                </button>
                <button 
                  className={styles.deleteBtn}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button className={styles.paginationBtn} disabled>
          ← Trước
        </button>
        <div className={styles.paginationNumbers}>
          <button className={`${styles.paginationBtn} ${styles.active}`}>1</button>
          <button className={styles.paginationBtn}>2</button>
          <button className={styles.paginationBtn}>3</button>
        </div>
        <button className={styles.paginationBtn}>
          Sau →
        </button>
      </div>
    </div>
  );
};

export default Orders;


