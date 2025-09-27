// src/components/AccountPage/OrdersTab.jsx
import React from 'react';
import { Eye, Star } from 'lucide-react';

const OrdersTab = ({ orders }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Đã giao': return 'text-green-600 bg-green-100';
      case 'Đang giao': return 'text-blue-600 bg-blue-100';
      case 'Đang xử lý': return 'text-yellow-600 bg-yellow-100';
      case 'Đã hủy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewDetails = (orderId) => {
    console.log('View order details:', orderId);
    // Điều hướng đến trang chi tiết đơn hàng
  };

  const handleRateOrder = (orderId) => {
    console.log('Rate order:', orderId);
    // Mở modal đánh giá
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h2>
      
      {orders.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đơn hàng nào</h3>
          <p className="text-gray-600">Hãy bắt đầu mua sắm để xem đơn hàng ở đây</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img 
                    src={order.image} 
                    alt="Product" 
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div>
                    <h3 className="font-semibold text-gray-900">{order.id}</h3>
                    <p className="text-sm text-gray-600">Ngày đặt: {order.date}</p>
                    <p className="text-sm text-gray-600">{order.items} sản phẩm</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </div>
                  <p className="text-lg font-semibold text-gray-900 mt-2">{order.total}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => handleViewDetails(order.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Eye size={16} />
                  Xem chi tiết
                </button>
                {order.status === 'Đã giao' && (
                  <button 
                    onClick={() => handleRateOrder(order.id)}
                    className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Star size={16} />
                    Đánh giá
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;