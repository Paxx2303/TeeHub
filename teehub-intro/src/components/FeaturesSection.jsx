import React from 'react';
import { Award, Truck, Shield, Heart } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Award className="w-8 h-8 text-sky-500" />,
      title: "Chất Lượng Premium",
      description: "100% cotton cao cấp, bền đẹp theo thời gian"
    },
    {
      icon: <Truck className="w-8 h-8 text-sky-500" />,
      title: "Giao Hàng Nhanh",
      description: "Miễn phí vận chuyển toàn quốc cho đơn từ 500k"
    },
    {
      icon: <Shield className="w-8 h-8 text-sky-500" />,
      title: "Đảm Bảo Chất Lượng",
      description: "Hoàn tiền 100% nếu không hài lòng trong 30 ngày"
    },
    {
      icon: <Heart className="w-8 h-8 text-sky-500" />,
      title: "Thiết Kế Độc Đáo",
      description: "Đội ngũ designer sáng tạo, luôn cập nhật xu hướng"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Tại Sao Chọn TeeHub?</h2>
          <p className="text-xl text-gray-600">Những giá trị cốt lõi tạo nên sự khác biệt</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;