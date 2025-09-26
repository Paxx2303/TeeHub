// src/components/AccountPage/SettingsTab.jsx
import React, { useState } from 'react';
import { CreditCard, Settings, LogOut, Edit2 } from 'lucide-react';

const SettingsTab = () => {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false
  });

  const handleChangePassword = () => {
    console.log('Change password');
    // Mở modal đổi mật khẩu
  };

  const handleToggle2FA = () => {
    console.log('Toggle 2FA');
    // Bật/tắt xác thực 2 bước
  };

  const handleLogout = () => {
    console.log('Logout');
    // Xử lý đăng xuất
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      // Thực hiện đăng xuất
    }
  };

  const handleNotificationChange = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt tài khoản</h2>
      
      <div className="space-y-6">
        {/* Bảo mật */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h3>
          <div className="space-y-4">
            <button 
              onClick={handleChangePassword}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CreditCard size={20} className="text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Đổi mật khẩu</p>
                  <p className="text-sm text-gray-600">Cập nhật mật khẩu của bạn</p>
                </div>
              </div>
              <Edit2 size={16} className="text-gray-400" />
            </button>
            
            <button 
              onClick={handleToggle2FA}
              className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Settings size={20} className="text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">Xác thực 2 bước</p>
                  <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
                </div>
              </div>
              <Edit2 size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Thông báo */}
        <div className="border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Thông báo</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email thông báo</p>
                <p className="text-sm text-gray-600">Nhận thông báo về đơn hàng qua email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">SMS thông báo</p>
                <p className="text-sm text-gray-600">Nhận thông báo về đơn hàng qua SMS</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Đăng xuất */}
        <div className="pt-6 border-t border-gray-200">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            Đăng xuất
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;