// src/components/OrdersManagement.jsx
import React, { useState } from 'react';
import { Search, Filter, Eye, Edit, Trash2, Download, RefreshCw } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@data/helpers';

const OrdersManagement = ({ orders: initialOrders }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'total':
          comparison = parseFloat(a.total.replace(/[^\d]/g, '')) - parseFloat(b.total.replace(/[^\d]/g, ''));
          break;
        case 'customer':
          comparison = a.customer.localeCompare(b.customer);
          break;
        default:
          comparison = 0;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleViewOrder = (orderId) => {
    console.log('Viewing order:', orderId);
    // Implement view order details
  };

  const handleEditOrder = (orderId) => {
    console.log('Editing order:', orderId);
    // Implement edit order
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) {
      setOrders(orders.filter(order => order.id !== orderId));
      console.log('Deleted order:', orderId);
    }
  };

  const handleExport = () => {
    console.log('Exporting orders...');
    // Implement export functionality
  };

  const handleRefresh = () => {
    console.log('Refreshing orders...');
    // Implement refresh functionality
  };

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'pending', label: 'Chờ xử lý' },
    { value: 'completed', label: 'Hoàn thành' },
    { value: 'shipping', label: 'Đang giao' },
    { value: 'cancelled', label: 'Đã hủy' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng cộng {filteredOrders.length} đơn hàng
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleRefresh}
            className="btn-secondary"
            title="Làm mới"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button 
            onClick={handleExport}
            className="btn-secondary"
          >
            <Download size={16} />
            Xuất Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo mã đơn, khách hàng, sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pr-8 appearance-none cursor-pointer min-w-[180px]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Sort */}
          <div className="flex gap-2">
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field min-w-[120px]"
            >
              <option value="date">Ngày đặt</option>
              <option value="total">Tổng tiền</option>
              <option value="customer">Khách hàng</option>
            </select>
            <button 
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="btn-secondary px-3"
              title={`Sắp xếp ${sortOrder === 'asc' ? 'giảm dần' : 'tăng dần'}`}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Mã đơn hàng</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Khách hàng</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Sản phẩm</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Số lượng</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Tổng tiền</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Trạng thái</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Ngày đặt</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Search size={48} className="text-gray-300" />
                      <p>Không tìm thấy đơn hàng nào</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="py-4 px-6">
                      <span className="font-medium text-primary-600">{order.id}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900">{order.customer}</div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={order.image} 
                          alt={order.product}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <span className="text-gray-700">{order.product}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.quantity}</td>
                    <td className="py-4 px-6">
                      <span className="font-semibold text-gray-900">{order.total}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-600">{order.date}</td>
                    <td className="py-4 px-6">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewOrder(order.id)}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order.id)}
                          className="p-2 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDeleteOrder(order.id)}
                          className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Hiển thị {filteredOrders.length} đơn hàng
          </div>
          <div className="flex gap-2">
            <button className="btn-secondary px-3 py-2">Trước</button>
            <button className="btn-primary px-3 py-2">1</button>
            <button className="btn-secondary px-3 py-2">2</button>
            <button className="btn-secondary px-3 py-2">Sau</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;