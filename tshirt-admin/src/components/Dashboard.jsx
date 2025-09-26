// src/components/Dashboard.jsx
import React from 'react';
import { 
  DollarSign, ShoppingBag, Package, Users, TrendingUp, 
  Star, Eye, Edit, CheckCircle, Clock, Truck 
} from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@data/helpers';

const Dashboard = ({ stats, recentOrders, topProducts }) => {
  const statCards = [
    {
      title: 'Doanh thu',
      value: stats.totalRevenue,
      change: '+12.5%',
      icon: DollarSign,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600'
    },
    {
      title: 'Đơn hàng',
      value: stats.totalOrders,
      change: '+8.2%',
      icon: ShoppingBag,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600'
    },
    {
      title: 'Sản phẩm',
      value: stats.totalProducts,
      change: '+5.1%',
      icon: Package,
      color: 'purple',
      bgColor: 'bg-purple-100',
      textColor: 'text-purple-600'
    },
    {
      title: 'Khách hàng',
      value: stats.totalUsers,
      change: '+15.3%',
      icon: Users,
      color: 'orange',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-600'
    }
  ];

  const handleViewOrder = (orderId) => {
    console.log('Viewing order:', orderId);
    // Handle view order logic
  };

  const handleEditOrder = (orderId) => {
    console.log('Editing order:', orderId);
    // Handle edit order logic
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card card-hover">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-2">{stat.value}</p>
                  <div className="flex items-center">
                    <TrendingUp size={16} className="text-green-500 mr-1" />
                    <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <Icon className={stat.textColor} size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors">
              Xem tất cả
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Mã đơn</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Khách hàng</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Sản phẩm</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Tổng tiền</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Trạng thái</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-600 text-sm">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="table-row">
                    <td className="py-3 px-2">
                      <span className="font-medium text-primary-600">{order.id}</span>
                    </td>
                    <td className="py-3 px-2 text-gray-700">{order.customer}</td>
                    <td className="py-3 px-2 text-gray-600 text-sm">{order.product}</td>
                    <td className="py-3 px-2 font-medium text-gray-900">{order.total}</td>
                    <td className="py-3 px-2">
                      <span className={`status-badge ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-1">
                        <button 
                          onClick={() => handleViewOrder(order.id)}
                          className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => handleEditOrder(order.id)}
                          className="p-1.5 text-success-600 hover:bg-success-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
            <Star className="text-yellow-500" size={20} />
          </div>
          
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover shadow-sm"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">{product.sales} đã bán</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">{product.revenue}</p>
                  <div className="flex items-center mt-1">
                    <div className="w-8 h-1.5 bg-gray-200 rounded-full mr-2">
                      <div 
                        className="h-1.5 bg-primary-500 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min((product.sales / 250) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">#{index + 1}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Xem tất cả sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card card-hover cursor-pointer" onClick={() => console.log('Quick add product')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <Package className="text-primary-600" size={24} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Thêm sản phẩm mới</h4>
              <p className="text-sm text-gray-500">Tạo sản phẩm nhanh chóng</p>
            </div>
          </div>
        </div>

        <div className="card card-hover cursor-pointer" onClick={() => console.log('View pending orders')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Clock className="text-warning-600" size={24} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Đơn hàng chờ xử lý</h4>
              <p className="text-sm text-gray-500">5 đơn hàng cần xử lý</p>
            </div>
          </div>
        </div>

        <div className="card card-hover cursor-pointer" onClick={() => console.log('View shipping orders')}>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
              <Truck className="text-success-600" size={24} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Đang giao hàng</h4>
              <p className="text-sm text-gray-500">12 đơn hàng đang giao</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;