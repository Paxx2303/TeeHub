import React from 'react';
import { ShoppingBag } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-sky-600">TeeHub</h1>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-700 hover:text-sky-600 transition-colors">Trang chủ</a>
            <a href="#products" className="text-gray-700 hover:text-sky-600 transition-colors">Sản phẩm</a>
            <a href="#about" className="text-gray-700 hover:text-sky-600 transition-colors">Về chúng tôi</a>
            <a href="#team" className="text-gray-700 hover:text-sky-600 transition-colors">Đội ngũ</a>
            <a href="#contact" className="text-gray-700 hover:text-sky-600 transition-colors">Liên hệ</a>
          </nav>
          <div className="flex items-center space-x-4">
            <ShoppingBag className="w-6 h-6 text-gray-700 hover:text-sky-600 cursor-pointer transition-colors" />
            <button className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 transition-colors">
              Đăng nhập
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;