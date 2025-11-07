import React, { useState, useEffect, useMemo } from 'react';
import styles from './Orders.module.css';
import OrderService from '../../../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy tất cả đơn hàng từ API (Admin)
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await OrderService.getAllOrders();
        setOrders(data || []);
      } catch (err) {
        const message = err.response?.data?.message || 'Không thể tải danh sách đơn hàng';
        setError(message);
        console.error('Lỗi khi lấy đơn hàng:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Lọc đơn hàng theo trạng thái và tìm kiếm
  const filteredOrders = useMemo(() => {
    let result = orders;

    // Lọc theo trạng thái
    if (selectedStatus !== 'all') {
      result = result.filter(order => order.status === selectedStatus);
    }

    // Tìm kiếm theo mã đơn, khách hàng, email
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toLowerCase().includes(term) ||
        (order.customer && order.customer.toLowerCase().includes(term)) ||
        (order.email && order.email.toLowerCase().includes(term))
      );
    }

    return result;
  }, [orders, selectedStatus, searchTerm]);

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder || currentOrder.status === newStatus) return;

    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
      alert(`Cập nhật trạng thái đơn hàng ${orderId} thành công!`);
    } catch (err) {
      alert('Cập nhật thất bại. Vui lòng thử lại.');
      console.error('Lỗi cập nhật trạng thái:', err);
    }
  };

  // Format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  // Màu trạng thái
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

  // Text trạng thái
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

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'processing', label: 'Đang xử lý' },
    { value: 'shipped', label: 'Đã giao' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'cancelled', label: 'Đã hủy' }
  ];

  // Loading & Error
  if (loading) return <div className={styles.loading}>Đang tải đơn hàng...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.orders}>
      {/* Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý đơn hàng (Admin)</h1>
        <p className={styles.pageSubtitle}>Theo dõi và xử lý tất cả đơn hàng</p>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm mã đơn, khách hàng, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>Search</span>
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
          <button className={styles.exportBtn}>Xuất báo cáo</button>
          <button
            className={styles.refreshBtn}
            onClick={() => window.location.reload()}
          >
            Làm mới
          </button>
        </div>
      </div>

      {/* Table */}
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

        {filteredOrders.length === 0 ? (
          <div className={styles.empty}>Không có đơn hàng nào phù hợp</div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <span className={styles.orderId}>{order.id}</span>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.customerInfo}>
                  <div className={styles.customerName}>{order.customer || 'Khách lẻ'}</div>
                  <div className={styles.customerContact}>
                    {order.email || '—'} • {order.phone || '—'}
                  </div>
                </div>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.productsList}>
                  {order.products && order.products.length > 0 ? (
                    order.products.map((p, idx) => (
                      <div key={idx} className={styles.productItem}>
                        <span className={styles.productName}>{p.name}</span>
                        <span className={styles.productQuantity}>x{p.quantity}</span>
                      </div>
                    ))
                  ) : (
                    <span className={styles.noProduct}>—</span>
                  )}
                </div>
              </div>

              <div className={styles.tableCell}>
                <span className={styles.totalAmount}>
                  {formatCurrency(order.total || 0)}
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
                    border: 'none',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    fontSize: '0.875rem'
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
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleDateString('vi-VN')
                    : '—'}
                </span>
              </div>

              <div className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  <button className={styles.viewBtn} title="Xem chi tiết">
                    View
                  </button>
                  <button className={styles.editBtn} title="Chỉnh sửa">
                    Edit
                  </button>
                  <button className={styles.deleteBtn} title="Xóa">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <button className={styles.paginationBtn} disabled>Trước</button>
        <div className={styles.paginationNumbers}>
          <button className={`${styles.paginationBtn} ${styles.active}`}>1</button>
        </div>
        <button className={styles.paginationBtn}>Sau</button>
      </div>
    </div>
  );
};

export default Orders;