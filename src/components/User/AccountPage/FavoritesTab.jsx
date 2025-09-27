// src/components/AccountPage/FavoritesTab.jsx
import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';

const FavoritesTab = ({ favorites }) => {
  const handleRemoveFromFavorites = (productId) => {
    console.log('Remove from favorites:', productId);
    // Xóa sản phẩm khỏi danh sách yêu thích
  };

  const handleAddToCart = (productId) => {
    console.log('Add to cart:', productId);
    // Thêm sản phẩm vào giỏ hàng
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Sản phẩm yêu thích</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart size={40} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm yêu thích</h3>
          <p className="text-gray-600">Hãy thêm các sản phẩm bạn yêu thích để xem ở đây</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-48 object-cover"
                />
                <button 
                  onClick={() => handleRemoveFromFavorites(item.id)}
                  className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                >
                  <Heart size={16} className="text-red-500 fill-current" />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                <p className="text-lg font-semibold text-blue-600 mb-3">{item.price}</p>
                <button 
                  onClick={() => handleAddToCart(item.id)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <ShoppingBag size={16} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritesTab;