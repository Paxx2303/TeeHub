// src/components/ProductsManagement.jsx
import React, { useState } from 'react';
import { Search, Filter, Plus, Eye, Edit, Trash2, Package, AlertTriangle } from 'lucide-react';
import { getStatusColor, getStatusLabel } from '@data/helpers';

const ProductsManagement = ({ products: initialProducts }) => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddProduct = () => {
    console.log('Adding new product...');
    // Implement add product modal
  };

  const handleViewProduct = (productId) => {
    console.log('Viewing product:', productId);
    // Implement view product details
  };

  const handleEditProduct = (productId) => {
    console.log('Editing product:', productId);
    // Implement edit product
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      setProducts(products.filter(product => product.id !== productId));
      console.log('Deleted product:', productId);
    }
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];
  
  const categoryOptions = [
    { value: 'all', label: 'Tất cả danh mục' },
    ...categories.filter(cat => cat !== 'all').map(cat => ({ value: cat, label: cat }))
  ];

  const statusOptions = [
    { value: 'all', label: 'Tất cả trạng thái' },
    { value: 'active', label: 'Đang bán' },
    { value: 'out_of_stock', label: 'Hết hàng' },
    { value: 'inactive', label: 'Ngừng bán' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h2>
          <p className="text-sm text-gray-600 mt-1">
            Tổng cộng {filteredProducts.length} sản phẩm
          </p>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={handleAddProduct}
            className="btn-primary"
          >
            <Plus size={16} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select 
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]"
            >
              {categoryOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field pr-8 appearance-none cursor-pointer min-w-[160px]"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <div className="flex flex-col items-center gap-4">
              <Package size={64} className="text-gray-300" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Không có sản phẩm nào</h3>
                <p className="text-gray-500">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới</p>
              </div>
              <button onClick={handleAddProduct} className="btn-primary">
                <Plus size={16} />
                Thêm sản phẩm đầu tiên
              </button>
            </div>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div key={product.id} className="card card-hover">
              {/* Product Image */}
              <div className="relative mb-4">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-3 right-3">
                  <span className={`status-badge ${getStatusColor(product.status)}`}>
                    {getStatusLabel(product.status)}
                  </span>
                </div>
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                    <div className="text-center text-white">
                      <AlertTriangle size={24} className="mx-auto mb-2" />
                      <p className="font-medium">Hết hàng</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>Danh mục: {product.category}</span>
                  <span className={`font-medium ${product.stock <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                    Kho: {product.stock}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary-600">{product.price}</span>
                  <span className="text-sm text-gray-500">Đã bán: {product.sold}</span>
                </div>

                {/* Stock Warning */}
                {product.stock > 0 && product.stock <= 10 && (
                  <div className="flex items-center gap-2 p-2 bg-warning-50 rounded-lg">
                    <AlertTriangle size={16} className="text-warning-600" />
                    <span className="text-sm text-warning-700">Sắp hết hàng</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => handleViewProduct(product.id)}
                  className="flex-1 btn-secondary text-sm py-2"
                  title="Xem chi tiết"
                >
                  <Eye size={14} />
                  Xem
                </button>
                <button 
                  onClick={() => handleEditProduct(product.id)}
                  className="flex-1 btn-primary text-sm py-2"
                  title="Chỉnh sửa"
                >
                  <Edit size={14} />
                  Sửa
                </button>
                <button 
                  onClick={() => handleDeleteProduct(product.id)}
                  className="p-2 text-danger-600 hover:bg-danger-50 rounded-lg transition-colors"
                  title="Xóa"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredProducts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-gray-900">
              {filteredProducts.length}
            </div>
            <div className="text-sm text-gray-600">Tổng sản phẩm</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-green-600">
              {filteredProducts.filter(p => p.status === 'active').length}
            </div>
            <div className="text-sm text-gray-600">Đang bán</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-red-600">
              {filteredProducts.filter(p => p.status === 'out_of_stock').length}
            </div>
            <div className="text-sm text-gray-600">Hết hàng</div>
          </div>
          
          <div className="card text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {filteredProducts.filter(p => p.stock > 0 && p.stock <= 10).length}
            </div>
            <div className="text-sm text-gray-600">Sắp hết</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductsManagement;