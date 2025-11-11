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
      result = result.filter(order => order.orderStatus === selectedStatus);
    }

    // Tìm kiếm theo mã đơn, user ID
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(order =>
        order.id.toString().includes(term) ||
        order.userId.toString().includes(term)
      );
    }

    return result;
  }, [orders, selectedStatus, searchTerm]);

  // Cập nhật trạng thái đơn hàng
  const handleStatusChange = async (orderId, newStatus) => {
    const currentOrder = orders.find(o => o.id === orderId);
    if (!currentOrder || currentOrder.orderStatus === newStatus) return;

    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev =>
        prev.map(o => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
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
      'Chờ xử lý': '#f59e0b',
      'Đang xử lý': '#8b5cf6',
      'Đã giao': '#3b82f6',
      'Hoàn thành': '#10b981',
      'Đã hủy': '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả' },
    { value: 'Chờ xử lý', label: 'Chờ xử lý' },
    { value: 'Đang xử lý', label: 'Đang xử lý' },
    { value: 'Đã giao', label: 'Đã giao' },
    { value: 'Hoàn thành', label: 'Hoàn thành' },
    { value: 'Đã hủy', label: 'Đã hủy' }
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
            placeholder="Tìm kiếm mã đơn, User ID..."
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
          <div className={styles.tableCell}>User ID</div>
          <div className={styles.tableCell}>Sản phẩm</div>
          <div className={styles.tableCell}>Thanh toán</div>
          <div className={styles.tableCell}>TT Thanh toán</div>
          <div className={styles.tableCell}>Vận chuyển</div>
          <div className={styles.tableCell}>Phí ship</div>
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
              {/* Mã đơn */}
              <div className={styles.tableCell}>
                <span className={styles.orderId}>#{order.id}</span>
              </div>

              {/* User ID */}
              <div className={styles.tableCell}>
                <span>User #{order.userId}</span>
              </div>

              {/* Sản phẩm */}
              <div className={styles.tableCell}>
                <div className={styles.productsList}>
                  {order.items && order.items.length > 0 ? (
                    order.items.map((item, idx) => (
                      <div key={idx} className={styles.productItem}>
                        <span className={styles.productName}>
                          Item #{item.productItemId}
                        </span>
                        <span className={styles.productQuantity}>x{item.qty}</span>
                        <span className={styles.productPrice}>
                          {formatCurrency(item.price)}
                        </span>
                      </div>
                    ))
                  ) : (
                    <span className={styles.noProduct}>—</span>
                  )}
                </div>
              </div>

              {/* Phương thức thanh toán */}
              <div className={styles.tableCell}>
                <div>
                  <div className={styles.paymentInfo}>
                    <strong>{order.paymentTypeName}</strong>
                  </div>
                  <div className={styles.paymentProvider}>
                    {order.paymentProvider}
                  </div>
                </div>
              </div>

              {/* Trạng thái thanh toán */}
              <div className={styles.tableCell}>
                <span
                  className={styles.paymentStatus}
                  style={{
                    backgroundColor: order.paymentStatus === 'Đã thanh toán' ? '#10b981' : '#f59e0b',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    display: 'inline-block'
                  }}
                >
                  {order.paymentStatus}
                </span>
              </div>

              {/* Phương thức vận chuyển */}
              <div className={styles.tableCell}>
                <span>{order.shippingMethodName}</span>
              </div>

              {/* Phí ship */}
              <div className={styles.tableCell}>
                <span className={styles.shippingPrice}>
                  {formatCurrency(order.shippingPrice || 0)}
                </span>
              </div>

              {/* Tổng tiền */}
              <div className={styles.tableCell}>
                <span className={styles.totalAmount}>
                  {formatCurrency(order.orderTotal || 0)}
                </span>
              </div>

              {/* Trạng thái đơn hàng */}
              <div className={styles.tableCell}>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={styles.statusSelect}
                  style={{
                    backgroundColor: getStatusColor(order.orderStatus),
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

              {/* Ngày đặt */}
              <div className={styles.tableCell}>
                <span className={styles.orderDate}>
                  {order.orderDate
                    ? new Date(order.orderDate).toLocaleString('vi-VN', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })
                    : '—'}
                </span>
              </div>

              {/* Thao tác */}
              <div className={styles.tableCell}>
                <div className={styles.actionButtons}>
                  <button className={styles.viewBtn} title="Xem chi tiết">
                    👁️
                  </button>
                  <button className={styles.editBtn} title="Chỉnh sửa">
                    ✏️
                  </button>
                  <button className={styles.deleteBtn} title="Xóa">
                    🗑️
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