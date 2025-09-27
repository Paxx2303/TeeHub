// src/components/common/Header.jsx
import React from 'react';

const Header = ({ userInfo }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Tài khoản của tôi</h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
              {userInfo.name.charAt(0)}
            </div>
            <div>
              <p className="font-medium text-gray-900">{userInfo.name}</p>
              <p className="text-sm text-gray-600">{userInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;