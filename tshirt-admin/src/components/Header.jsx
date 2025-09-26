// src/components/Header.jsx
import React from 'react';
import { Menu, Search, Bell } from 'lucide-react';

const Header = ({ activeTab, setSidebarOpen }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'orders', label: 'Đơn hàng' },
    { id: 'products', label: 'Sản phẩm' },
    { id: 'users', label: 'Khách hàng' },
    { id: 'analytics', label: 'Phân tích' },
  ];

  const currentPage = menuItems.find(item => item.id === activeTab);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 lg:shadow-none">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <Menu size={20} className="text-gray-600" />
          </button>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentPage?.label || 'Dashboard'}
            </h2>
            <p className="text-sm text-gray-500">
              Chào mừng trở lại, Admin! Hôm nay là {new Date().toLocaleDateString('vi-VN')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="hidden md:block relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm..."
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all w-64"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
              3
            </span>
          </button>

          {/* Admin Avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center text-white font-medium">
              A
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-gray-900">Admin User</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;