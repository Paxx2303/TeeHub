import React, { useState } from 'react';
import styles from './Users.module.css';

const Users = () => {
  const [selectedRole, setSelectedRole] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Mock data - sẽ thay thế bằng API calls
  const users = [
    {
      id: 'USER001',
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0123456789',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-10',
      lastLogin: '2024-01-15',
      totalOrders: 5,
      totalSpent: 2500000,
      avatar: 'https://via.placeholder.com/50x50/4F46E5/FFFFFF?text=NA'
    },
    {
      id: 'USER002',
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0987654321',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-08',
      lastLogin: '2024-01-14',
      totalOrders: 3,
      totalSpent: 1200000,
      avatar: 'https://via.placeholder.com/50x50/10B981/FFFFFF?text=TB'
    },
    {
      id: 'USER003',
      name: 'Lê Văn C',
      email: 'levanc@email.com',
      phone: '0369852147',
      role: 'admin',
      status: 'active',
      joinDate: '2024-01-05',
      lastLogin: '2024-01-15',
      totalOrders: 0,
      totalSpent: 0,
      avatar: 'https://via.placeholder.com/50x50/F59E0B/FFFFFF?text=LC'
    },
    {
      id: 'USER004',
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      phone: '0741852963',
      role: 'customer',
      status: 'inactive',
      joinDate: '2024-01-03',
      lastLogin: '2024-01-12',
      totalOrders: 2,
      totalSpent: 800000,
      avatar: 'https://via.placeholder.com/50x50/EF4444/FFFFFF?text=PD'
    }
  ];

  const roleOptions = [
    { value: 'all', label: 'Tất cả vai trò' },
    { value: 'customer', label: 'Khách hàng' },
    { value: 'admin', label: 'Quản trị viên' },
    { value: 'moderator', label: 'Điều hành viên' }
  ];

  const getRoleColor = (role) => {
    const colors = {
      customer: '#3b82f6',
      admin: '#ef4444',
      moderator: '#f59e0b'
    };
    return colors[role] || '#6b7280';
  };

  const getRoleText = (role) => {
    const texts = {
      customer: 'Khách hàng',
      admin: 'Quản trị viên',
      moderator: 'Điều hành viên'
    };
    return texts[role] || role;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#10b981',
      inactive: '#6b7280',
      banned: '#ef4444'
    };
    return colors[status] || '#6b7280';
  };

  const getStatusText = (status) => {
    const texts = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      banned: 'Bị cấm'
    };
    return texts[status] || status;
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      console.log(`Xóa người dùng ${userId}`);
    }
  };

  const handleToggleStatus = (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    console.log(`Thay đổi trạng thái người dùng ${userId} thành ${newStatus}`);
  };

  const handleChangeRole = (userId, newRole) => {
    console.log(`Thay đổi vai trò người dùng ${userId} thành ${newRole}`);
  };

  return (
    <div className={styles.users}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Quản lý người dùng</h1>
        <p className={styles.pageSubtitle}>Quản lý tài khoản và quyền hạn người dùng</p>
      </div>

      {/* Filters and actions */}
      <div className={styles.filters}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.roleFilter}>
          <label className={styles.filterLabel}>Vai trò:</label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className={styles.roleSelect}
          >
            {roleOptions.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button 
            className={styles.addBtn}
            onClick={() => setShowAddModal(true)}
          >
            ➕ Thêm người dùng
          </button>
          <button className={styles.exportBtn}>
            📊 Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Users table */}
      <div className={styles.usersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableCell}>Người dùng</div>
          <div className={styles.tableCell}>Vai trò</div>
          <div className={styles.tableCell}>Trạng thái</div>
          <div className={styles.tableCell}>Thống kê</div>
          <div className={styles.tableCell}>Ngày tham gia</div>
          <div className={styles.tableCell}>Đăng nhập cuối</div>
          <div className={styles.tableCell}>Thao tác</div>
        </div>

        {filteredUsers.map((user, index) => (
          <div key={index} className={styles.tableRow}>
            <div className={styles.tableCell}>
              <div className={styles.userInfo}>
                <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
                <div className={styles.userDetails}>
                  <div className={styles.userName}>{user.name}</div>
                  <div className={styles.userContact}>
                    {user.email} • {user.phone}
                  </div>
                  <div className={styles.userId}>{user.id}</div>
                </div>
              </div>
            </div>
            <div className={styles.tableCell}>
              <select
                value={user.role}
                onChange={(e) => handleChangeRole(user.id, e.target.value)}
                className={styles.roleSelect}
                style={{ 
                  backgroundColor: getRoleColor(user.role),
                  color: 'white',
                  border: 'none'
                }}
              >
                {roleOptions.slice(1).map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.tableCell}>
              <span 
                className={styles.statusBadge}
                style={{ backgroundColor: getStatusColor(user.status) }}
              >
                {getStatusText(user.status)}
              </span>
            </div>
            <div className={styles.tableCell}>
              <div className={styles.userStats}>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Đơn hàng:</span>
                  <span className={styles.statValue}>{user.totalOrders}</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statLabel}>Chi tiêu:</span>
                  <span className={styles.statValue}>{formatCurrency(user.totalSpent)}</span>
                </div>
              </div>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.joinDate}>
                {new Date(user.joinDate).toLocaleDateString('vi-VN')}
              </span>
            </div>
            <div className={styles.tableCell}>
              <span className={styles.lastLogin}>
                {new Date(user.lastLogin).toLocaleDateString('vi-VN')}
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
                  className={styles.toggleBtn}
                  onClick={() => handleToggleStatus(user.id, user.status)}
                  title={user.status === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                >
                  {user.status === 'active' ? '⏸️' : '▶️'}
                </button>
                <button 
                  className={styles.deleteBtn}
                  onClick={() => handleDeleteUser(user.id)}
                  title="Xóa"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Thêm người dùng mới</h3>
              <button 
                className={styles.closeBtn}
                onClick={() => setShowAddModal(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.modalContent}>
              <form className={styles.addUserForm}>
                <div className={styles.formGroup}>
                  <label>Họ và tên</label>
                  <input type="text" placeholder="Nhập họ và tên" />
                </div>
                <div className={styles.formGroup}>
                  <label>Email</label>
                  <input type="email" placeholder="Nhập email" />
                </div>
                <div className={styles.formGroup}>
                  <label>Số điện thoại</label>
                  <input type="tel" placeholder="Nhập số điện thoại" />
                </div>
                <div className={styles.formGroup}>
                  <label>Vai trò</label>
                  <select>
                    <option value="customer">Khách hàng</option>
                    <option value="moderator">Điều hành viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Mật khẩu</label>
                  <input type="password" placeholder="Nhập mật khẩu" />
                </div>
                <div className={styles.formActions}>
                  <button type="button" onClick={() => setShowAddModal(false)}>
                    Hủy
                  </button>
                  <button type="submit">Thêm người dùng</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
