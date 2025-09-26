import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-sky-400 mb-4">TeeHub</h3>
            <p className="text-gray-400 mb-4">
              Thương hiệu áo thun hàng đầu Việt Nam, mang đến phong cách và chất lượng tốt nhất.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">f</div>
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">i</div>
              <div className="w-8 h-8 bg-sky-500 rounded-full flex items-center justify-center cursor-pointer hover:bg-sky-600 transition-colors">t</div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Sản Phẩm</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Áo thun nam</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Áo thun nữ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Áo thun trẻ em</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bộ sưu tập mới</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Hỗ Trợ</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Bảng size</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Liên Hệ</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📍 123 Nguyễn Văn Cừ, Q1, TP.HCM</li>
              <li>📞 0123 456 789</li>
              <li>✉️ hello@teehub.vn</li>
              <li>🕒 T2-CN: 9:00 - 22:00</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2024 TeeHub. Tất cả quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
