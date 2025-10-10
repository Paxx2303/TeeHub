import React from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  // Mock data - sẽ thay thế bằng API calls
  const stats = [
    {
      title: 'Tổng doanh thu',
      value: '125,450,000',
      unit: 'VNĐ',
      change: '+12.5%',
      changeType: 'positive',
      icon: '💰'
    },
    {
      title: 'Đơn hàng mới',
      value: '1,234',
      unit: 'đơn',
      change: '+8.2%',
      changeType: 'positive',
      icon: '📦'
    },
    {
      title: 'Khách hàng',
      value: '5,678',
      unit: 'người',
      change: '+15.3%',
      changeType: 'positive',
      icon: '👥'
    },
    {
      title: 'Sản phẩm',
      value: '890',
      unit: 'sản phẩm',
      change: '+3.1%',
      changeType: 'positive',
      icon: '👕'
    }
  ];

  const recentOrders = [
    {
      id: '#ORD001',
      customer: 'Nguyễn Văn A',
      product: 'Áo thun TeeHub Basic',
      amount: '299,000',
      status: 'completed',
      date: '2024-01-15'
    },
    {
      id: '#ORD002',
      customer: 'Trần Thị B',
      product: 'Áo hoodie TeeHub Premium',
      amount: '599,000',
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: '#ORD003',
      customer: 'Lê Văn C',
      product: 'Áo polo TeeHub Sport',
      amount: '399,000',
      status: 'shipped',
      date: '2024-01-14'
    },
    {
      id: '#ORD004',
      customer: 'Phạm Thị D',
      product: 'Áo thun custom design',
      amount: '449,000',
      status: 'processing',
      date: '2024-01-14'
    }
  ];

  const topProducts = [
    { name: 'Áo thun TeeHub Basic', sales: 156, revenue: '46,644,000' },
    { name: 'Áo hoodie TeeHub Premium', sales: 89, revenue: '53,311,000' },
    { name: 'Áo polo TeeHub Sport', sales: 67, revenue: '26,733,000' },
    { name: 'Áo thun custom design', sales: 45, revenue: '20,205,000' }
  ];

  const getStatusColor = (status) => {
    const colors = {
      completed: '#10b981',
      pending: '#f59e0b',
      shipped: '#3b82f6',
      processing: '#8b5cf6'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      completed: 'Hoàn thành',
      pending: 'Chờ xử lý',
      shipped: 'Đã giao',
      processing: 'Đang xử lý'
    };
    return texts[status] || status;
  };

  return (
    <div className={styles.dashboard}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Dashboard</h1>
        <p className={styles.pageSubtitle}>Tổng quan về hoạt động của cửa hàng</p>
      </div>

      {/* Stats cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.statIcon}>{stat.icon}</div>
              <div className={styles.statChange}>
                <span className={`${styles.changeValue} ${styles[stat.changeType]}`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div className={styles.statContent}>
              <h3 className={styles.statTitle}>{stat.title}</h3>
              <div className={styles.statValue}>
                <span className={styles.value}>{stat.value}</span>
                <span className={styles.unit}>{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and tables section */}
      <div className={styles.contentGrid}>
        {/* Recent orders */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Đơn hàng gần đây</h3>
            <button className={styles.viewAllBtn}>Xem tất cả</button>
          </div>
          <div className={styles.ordersTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Mã đơn</div>
              <div className={styles.tableCell}>Khách hàng</div>
              <div className={styles.tableCell}>Sản phẩm</div>
              <div className={styles.tableCell}>Số tiền</div>
              <div className={styles.tableCell}>Trạng thái</div>
            </div>
            {recentOrders.map((order, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  <span className={styles.orderId}>{order.id}</span>
                </div>
                <div className={styles.tableCell}>{order.customer}</div>
                <div className={styles.tableCell}>{order.product}</div>
                <div className={styles.tableCell}>
                  <span className={styles.amount}>{order.amount} VNĐ</span>
                </div>
                <div className={styles.tableCell}>
                  <span 
                    className={styles.status}
                    style={{ backgroundColor: getStatusColor(order.status) }}
                  >
                    {getStatusText(order.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Sản phẩm bán chạy</h3>
            <button className={styles.viewAllBtn}>Xem tất cả</button>
          </div>
          <div className={styles.productsList}>
            {topProducts.map((product, index) => (
              <div key={index} className={styles.productItem}>
                <div className={styles.productInfo}>
                  <div className={styles.productName}>{product.name}</div>
                  <div className={styles.productStats}>
                    <span className={styles.sales}>{product.sales} bán</span>
                    <span className={styles.revenue}>{product.revenue} VNĐ</span>
                  </div>
                </div>
                <div className={styles.productRank}>
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className={styles.quickActions}>
        <h3 className={styles.quickActionsTitle}>Thao tác nhanh</h3>
        <div className={styles.quickActionsGrid}>
          <button className={styles.quickActionBtn}>
            <span className={styles.actionIcon}>➕</span>
            <span className={styles.actionText}>Thêm sản phẩm mới</span>
          </button>
          <button className={styles.quickActionBtn}>
            <span className={styles.actionIcon}>📊</span>
            <span className={styles.actionText}>Tạo báo cáo</span>
          </button>
          <button className={styles.quickActionBtn}>
            <span className={styles.actionIcon}>📧</span>
            <span className={styles.actionText}>Gửi email marketing</span>
          </button>
          <button className={styles.quickActionBtn}>
            <span className={styles.actionIcon}>⚙️</span>
            <span className={styles.actionText}>Cài đặt hệ thống</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
