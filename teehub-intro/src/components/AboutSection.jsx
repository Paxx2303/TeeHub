import React from 'react';
import { Users } from 'lucide-react';

const AboutSection = () => {
  return (
    <section id="about" className="py-20 bg-sky-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Câu Chuyện TeeHub</h2>
            <p className="text-lg text-gray-600 mb-6">
              Được thành lập vào năm 2020, TeeHub ra đời từ niềm đam mê tạo ra những chiếc áo thun 
              không chỉ đẹp mà còn thoải mái và bền bỉ theo thời gian.
            </p>
            <p className="text-lg text-gray-600 mb-6">
              Chúng tôi tin rằng thời trang không chỉ là về vẻ bề ngoài, mà còn là cách thể hiện 
              cá tính và phong cách sống của mỗi người.
            </p>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">50K+</div>
                <div className="text-gray-600">Khách hàng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">100+</div>
                <div className="text-gray-600">Thiết kế</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-sky-600">4.8★</div>
                <div className="text-gray-600">Đánh giá</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop" 
              alt="About TeeHub"
              className="rounded-xl shadow-lg"
            />
            <div className="absolute -bottom-4 -right-4 bg-sky-500 text-white p-4 rounded-xl">
              <Users className="w-8 h-8" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;