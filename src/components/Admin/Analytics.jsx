// src/components/Analytics.jsx
import React, { useState } from 'react';
import { 
  BarChart3, TrendingUp, TrendingDown, Calendar, 
  DollarSign, ShoppingCart, Users, Package,
  Download, RefreshCw, Filter
} from 'lucide-react';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('7days');
  const [chartType, setChartType] = useState('revenue');

  const timeRangeOptions = [
    { value: '7days', label: '7 ngày qua' },
    { value: '30days', label: '30 ngày qua' },
    { value: '3months', label: '3 tháng qua' },
    { value: '1year', label: '1 năm qua' },
  ];

  const chartTypeOptions = [
    { value: 'revenue', label: 'Doanh thu', icon: DollarSign },
    { value: 'orders', label: 'Đơn hàng', icon: ShoppingCart },
    { value: 'users', label: 'Khách hàng', icon: Users },
    { value: 'products', label: 'Sản phẩm', icon: Package },
  ];

  // Mock data for charts
  const revenueData = [
    { day: 'T2', value: 2400000, orders: 45 },
    { day: 'T3', value: 1800000, orders: 32 },
    { day: 'T4', value: 3200000, orders: 58 },
    { day: 'T5', value: 2800000, orders: 49 },
    { day: 'T6', value: 3600000, orders: 65 },
    { day: 'T7', value: 4200000, orders: 78 },
    { day: 'CN', value: 3800000, orders: 72 },
  ];

  const topCategories = [
    { name: 'Basic T-Shirts', value: 45, color: 'bg-blue-500' },
    { name: 'Vintage Collection', value: 30, color: 'bg-green-500' },
    { name: 'Oversize Style', value: 20, color: 'bg-purple-500' },
    { name: 'Limited Edition', value: 5, color: 'bg-red-500' },
  ];

  const performanceMetrics = [
    {
      title: 'Tỷ lệ chuyển đổi',
      value: '3.4%',
      change: '+0.8%',
      trend: 'up',
      description: 'Từ lượt xem đến mua hàng'
    },
    {
      title: 'Giá trị đơn hàng TB',
      value: '425.000đ',
      change: '+12.5%',
      trend: 'up',
      description: 'Trung bình mỗi đơn hàng'
    },
    {
      title: 'Tỷ lệ khách quay lại',
      value: '28.5%',
      change: '-2.1%',
      trend: 'down',
      description: 'Khách hàng mua lần 2+'
    },
    {
      title: 'Thời gian xử lý',
      value: '1.2 giờ',
      change: '-15min',
      trend: 'up',
      description: 'Từ đặt hàng đến xử lý'
    },
  ];

  const handleExportReport = () => {
    console.log('Exporting analytics report...');
    // Implement export functionality
  };

  const handleRefreshData = () => {
    console.log('Refreshing analytics data...');
    // Implement refresh functionality
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Phân tích & Báo cáo</h2>
          <p className="text-sm text-gray-600 mt-1">
            Theo dõi hiệu suất kinh doanh chi tiết
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleRefreshData}
            className="btn-secondary"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button 
            onClick={handleExportReport}
            className="btn-primary"
          >
            <Download size={16} />
            Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Time Range & Chart Type Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {timeRangeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeRange(option.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === option.value
                    ? 'bg-primary-100 text-primary-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {chartTypeOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setChartType(option.value)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    chartType === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={16} />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {performanceMetrics.map((metric, index) => (
          <div key={index} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-600 mb-1">{metric.title}</h3>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
                  <div className={`flex items-center text-sm font-medium ${
                    metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {metric.trend === 'up' ? (
                      <TrendingUp size={16} className="mr-1" />
                    ) : (
                      <TrendingDown size={16} className="mr-1" />
                    )}
                    {metric.change}
                  </div>
                </div>
                <p className="text-xs text-gray-500">{metric.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {chartTypeOptions.find(c => c.value === chartType)?.label} - {timeRangeOptions.find(t => t.value === timeRange)?.label}
            </h3>
          </div>
          
          {/* Simple Bar Chart */}
          <div className="space-y-4">
            <div className="flex items-end justify-between h-64 gap-2">
              {revenueData.map((item, index) => {
                const maxValue = Math.max(...revenueData.map(d => d.value));
                const height = (item.value / maxValue) * 200;
                
                return (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div className="flex items-end h-52">
                      <div 
                        className="bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg w-full transition-all duration-500 hover:from-primary-700 hover:to-primary-500 cursor-pointer relative group"
                        style={{ height: `${height}px` }}
                      >
                        {/* Tooltip */}
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {(item.value / 1000000).toFixed(1)}M đ
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-gray-600 mt-2">{item.day}</span>
                  </div>
                );
              })}
            </div>
            
            {/* Chart Legend */}
            <div className="flex justify-center gap-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary-600 rounded"></div>
                <span className="text-sm text-gray-600">Doanh thu (triệu đồng)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Phân bố theo danh mục</h3>
          </div>
          
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{category.name}</span>
                  <span className="text-gray-900 font-semibold">{category.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${category.color} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${category.value}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Tổng cộng</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Funnel */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Phễu bán hàng</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Lượt truy cập</p>
                  <p className="text-sm text-gray-600">Khách vào website</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-blue-600">12,458</p>
                <p className="text-sm text-gray-500">100%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Package size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Xem sản phẩm</p>
                  <p className="text-sm text-gray-600">Khách xem chi tiết</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-green-600">3,124</p>
                <p className="text-sm text-gray-500">25.1%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Thêm giỏ hàng</p>
                  <p className="text-sm text-gray-600">Khách thêm sản phẩm</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-purple-600">856</p>
                <p className="text-sm text-gray-500">6.9%</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <DollarSign size={20} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Hoàn thành đơn</p>
                  <p className="text-sm text-gray-600">Khách mua thành công</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-orange-600">423</p>
                <p className="text-sm text-gray-500">3.4%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Hoạt động gần đây</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Đơn hàng mới #TS156</p>
                <p className="text-xs text-gray-500">Nguyễn Văn An - 2 phút trước</p>
              </div>
              <span className="text-xs text-green-600 font-medium">+450.000đ</span>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package size={16} className="text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Sản phẩm mới được thêm</p>
                <p className="text-xs text-gray-500">Áo Thun Premium Black - 5 phút trước</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users size={16} className="text-purple-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Khách hàng mới đăng ký</p>
                <p className="text-xs text-gray-500">tranthib@email.com - 8 phút trước</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <TrendingUp size={16} className="text-orange-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">Doanh thu đạt mục tiêu</p>
                <p className="text-xs text-gray-500">Vượt 5% so với tháng trước - 15 phút trước</p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
              Xem tất cả hoạt động
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;