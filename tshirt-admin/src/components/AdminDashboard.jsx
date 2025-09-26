// src/components/AdminDashboard.jsx
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Dashboard from './Dashboard';
import OrdersManagement from './OrdersManagement';
import ProductsManagement from './ProductsManagement';
import UsersManagement from './UsersManagement';
import Analytics from './Analytics';
import { useAdminData } from '@hooks/useAdminData';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { stats, recentOrders, topProducts, products, users, loading } = useAdminData();

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="spinner"></div>
          <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
        </div>
      );
    }

    switch(activeTab) {
      case 'dashboard': 
        return <Dashboard stats={stats} recentOrders={recentOrders} topProducts={topProducts} />;
      case 'orders': 
        return <OrdersManagement orders={recentOrders} />;
      case 'products': 
        return <ProductsManagement products={products} />;
      case 'users': 
        return <UsersManagement users={users} />;
      case 'analytics': 
        return <Analytics stats={stats} />;
      default: 
        return <Dashboard stats={stats} recentOrders={recentOrders} topProducts={topProducts} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">
        <Header 
          activeTab={activeTab}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;