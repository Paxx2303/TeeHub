import React, { useState, useEffect, useMemo } from 'react';

// Mock CartService
const CartService = {
  getCart: async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      items: [
        {
          id: 1,
          productItemId: 101,
          price: 299000,
          qty: 2,
          selectedOptions: [
            { name: 'Size', value: 'L' },
            { name: 'Color', value: 'Đỏ' }
          ],
          is_customed: false
        },
        {
          id: 2,
          productItemId: 102,
          price: 450000,
          qty: 1,
          selectedOptions: [
            { name: 'Size', value: 'XL' }
          ],
          is_customed: true
        },
        {
          id: 3,
          productItemId: 103,
          price: 199000,
          qty: 3,
          selectedOptions: [],
          is_customed: false
        }
      ]
    };
  },
  updateItem: async (id, data) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  },
  removeItem: async (id) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return { success: true };
  }
};

const CartCheckout = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const userId = "demo-user";

  useEffect(() => {
    const loadCart = async () => {
      try {
        setIsLoading(true);
        const data = await CartService.getCart();
        setItems((data && Array.isArray(data.items)) ? data.items : []);
      } catch (err) {
        console.error("❌ Lỗi tải giỏ hàng:", err);
        setError("Không thể tải giỏ hàng.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  const handleRetry = async () => {
    try {
      setIsLoading(true);
      const data = await CartService.getCart();
      setItems((data && Array.isArray(data.items)) ? data.items : []);
      setError(null);
    } catch (err) {
      console.error("❌ Lỗi tải giỏ hàng:", err);
      setError("Không thể tải giỏ hàng.");
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price) =>
    price ? `${price.toLocaleString("vi-VN")}₫` : "0₫";

  const toggleSelectItem = (itemId) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map(item => item.id)));
    }
  };

  const handleIncrease = async (item) => {
    const safeQty = Number(item?.qty || 0);
    const newQty = safeQty + 1;
    const previousItems = items;
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, qty: newQty } : i)));
    try {
      setIsLoading(true);
      await CartService.updateItem(item.id, { qty: newQty });
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err);
      setError("Không thể cập nhật số lượng");
      setItems(previousItems);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecrease = async (item) => {
    const safeQty = Number(item?.qty || 0);
    if (safeQty <= 1) return;
    const newQty = safeQty - 1;
    const previousItems = items;
    setItems(prev => prev.map(i => (i.id === item.id ? { ...i, qty: newQty } : i)));
    try {
      setIsLoading(true);
      await CartService.updateItem(item.id, { qty: newQty });
    } catch (err) {
      console.error("❌ Lỗi cập nhật số lượng:", err);
      setError("Không thể cập nhật số lượng");
      setItems(previousItems);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async (cartItemId) => {
    if (!window.confirm("🗑️ Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) return;
    try {
      setIsLoading(true);
      await CartService.removeItem(cartItemId);
      setItems(prev => prev.filter(i => i.id !== cartItemId));
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
      setError("Không thể xóa sản phẩm");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveSelected = async () => {
    if (selectedItems.size === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một sản phẩm để xóa");
      return;
    }
    if (!window.confirm(`🗑️ Bạn có chắc muốn xóa ${selectedItems.size} sản phẩm đã chọn?`)) return;

    try {
      setIsLoading(true);
      for (const itemId of selectedItems) {
        await CartService.removeItem(itemId);
      }
      setItems(prev => prev.filter(i => !selectedItems.has(i.id)));
      setSelectedItems(new Set());
    } catch (err) {
      console.error("❌ Lỗi xóa sản phẩm:", err);
      setError("Không thể xóa các sản phẩm đã chọn");
    } finally {
      setIsLoading(false);
    }
  };

  const getOptionsDisplay = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) return null;
    return selectedOptions.map(opt => opt.value).join(" - ");
  };

  useEffect(() => {
    setSelectedItems(prev => {
      const ids = new Set(items.map(i => i.id));
      const next = new Set();
      prev.forEach(id => { if (ids.has(id)) next.add(id); });
      return next;
    });
  }, [items]);

  const { selectedTotal, selectedCount } = useMemo(() => {
    let total = 0;
    let count = 0;
    for (const item of items) {
      if (selectedItems.has(item.id)) {
        const price = Number(item?.price || 0);
        const qty = Number(item?.qty || 0);
        total += price * qty;
        count += 1;
      }
    }
    return { selectedTotal: total, selectedCount: count };
  }, [items, selectedItems]);

  const handleCheckout = () => {
    if (selectedItems.size === 0) {
      alert("⚠️ Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    setShowCheckoutModal(true);
  };

  const handleConfirmCheckout = () => {
    alert(`✅ Đặt hàng thành công ${selectedCount} sản phẩm!\nTổng tiền: ${formatPrice(selectedTotal)}`);
    setShowCheckoutModal(false);
    setItems(prev => prev.filter(i => !selectedItems.has(i.id)));
    setSelectedItems(new Set());
  };

  if (isLoading && items.length === 0) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-8 flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-700 font-medium">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 p-6 border border-gray-100">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🛒
              </div>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Giỏ hàng của bạn
                </h1>
                <p className="text-gray-500 text-sm mt-1">{items.length} sản phẩm</p>
              </div>
            </div>
            <button
              className="px-6 py-3 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border border-gray-300 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
              onClick={() => alert("Quay lại trang trước")}
            >
              ← Quay lại
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 rounded-xl p-4 mb-6 shadow-md">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <span className="text-red-700 font-medium">{error}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-medium transition-all"
                >
                  Thử lại
                </button>
                <button
                  onClick={() => setError(null)}
                  className="text-red-700 hover:bg-red-100 px-3 py-2 rounded-lg transition-all"
                >
                  ✖
                </button>
              </div>
            </div>
          </div>
        )}

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-6xl">🛍️</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-3">Giỏ hàng trống</h2>
            <p className="text-gray-500 mb-8 text-lg">Hãy thêm vài sản phẩm yêu thích của bạn nhé!</p>
            <button
              className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              onClick={() => alert("Chuyển đến trang shop")}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
                {/* Cart Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 border-b border-gray-200">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedItems.size === items.length && items.length > 0}
                        onChange={toggleSelectAll}
                        className="w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <h2 className="text-lg md:text-xl font-bold text-gray-800">
                        Sản phẩm ({items.length})
                      </h2>
                    </div>
                    <button
                      onClick={handleRemoveSelected}
                      disabled={selectedItems.size === 0}
                      className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm md:text-base"
                    >
                      🗑️ Xóa đã chọn
                    </button>
                  </div>
                </div>

                {/* Items List */}
                <div className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const isSelected = selectedItems.has(item.id);
                    const optionsDisplay = getOptionsDisplay(item.selectedOptions);

                    return (
                      <div
                        key={item.id}
                        className={`p-4 md:p-5 transition-all duration-200 ${isSelected ? 'bg-blue-50/50' : 'hover:bg-gray-50'
                          }`}
                      >
                        <div className="flex gap-3 md:gap-4">
                          {/* Checkbox */}
                          <div className="flex items-start pt-2">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelectItem(item.id)}
                              className="w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                          </div>

                          {/* Product Image */}
                          <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-md">
                            <img
                              src={`https://placehold.co/200x200/e2e8f0/64748b?text=SP+${item.productItemId}`}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 mb-2 text-base md:text-lg">
                              Sản phẩm #{item.productItemId}
                            </h3>

                            {optionsDisplay && (
                              <div className="mb-2">
                                <span className="inline-block text-xs md:text-sm bg-gradient-to-r from-blue-100 to-indigo-100 px-3 py-1.5 rounded-lg text-blue-700 font-medium">
                                  {optionsDisplay}
                                </span>
                              </div>
                            )}

                            {item.is_customed && (
                              <span className="inline-block text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-lg mb-2 font-medium">
                                🎨 Tùy chỉnh
                              </span>
                            )}

                            <p className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                              {formatPrice(item.price)}
                            </p>

                            {/* Quantity Control & Actions */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
                                <button
                                  onClick={() => handleDecrease(item)}
                                  disabled={item.qty <= 1 || isLoading}
                                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-bold text-gray-700"
                                >
                                  −
                                </button>
                                <span className="w-10 h-8 md:w-14 md:h-10 flex items-center justify-center border-x-2 border-gray-200 font-bold text-gray-900 text-sm md:text-base">
                                  {item.qty}
                                </span>
                                <button
                                  onClick={() => handleIncrease(item)}
                                  disabled={isLoading}
                                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center bg-white hover:bg-gray-100 disabled:opacity-50 transition-all font-bold text-gray-700"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="font-bold text-gray-900 text-sm md:text-base">
                                  {formatPrice(item.price * item.qty)}
                                </span>
                                <button
                                  onClick={() => handleRemove(item.id)}
                                  disabled={isLoading}
                                  className="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium text-sm"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-5 md:p-6 sticky top-4 border border-gray-100">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Tóm tắt đơn hàng</h3>
                  <p className="text-gray-600 text-xs md:text-sm">Kiểm tra thông tin trước khi thanh toán</p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-700 items-center">
                    <span className="font-medium text-sm md:text-base">Đã chọn</span>
                    <span className="font-bold text-base md:text-lg">{selectedCount} sản phẩm</span>
                  </div>
                  <div className="flex justify-between text-gray-700 items-center">
                    <span className="font-medium text-sm md:text-base">Tạm tính</span>
                    <span className="font-bold text-base md:text-lg text-gray-900">{formatPrice(selectedTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700 text-sm md:text-base">Phí vận chuyển</span>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-green-600 text-sm md:text-base">Miễn phí</span>
                      <span className="text-lg md:text-xl">🚚</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-gray-900">Tổng cộng</span>
                    <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(selectedTotal)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.size === 0 || isLoading}
                  className="w-full py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold text-base md:text-lg transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Thanh toán ngay 💳
                </button>

                <button
                  onClick={() => { if (!(selectedItems.size === 0 || isLoading)) { alert("Chuyển đến trang checkout"); } }}
                  disabled={selectedItems.size === 0 || isLoading}
                  className="w-full mt-3 py-3 md:py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-800 rounded-xl font-bold text-base md:text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Đi đến trang thanh toán →
                </button>

                {selectedItems.size === 0 && (
                  <p className="text-xs md:text-sm text-gray-500 text-center mt-4 bg-yellow-50 p-3 rounded-lg">
                    ⚠️ Vui lòng chọn sản phẩm để thanh toán
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Checkout Modal */}
        {showCheckoutModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <span className="text-3xl md:text-4xl">✅</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Xác nhận đặt hàng
                </h2>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 md:p-6 mb-6 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-sm md:text-base">Số sản phẩm:</span>
                  <span className="font-bold text-base md:text-lg text-gray-900">{selectedCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-sm md:text-base">Tạm tính:</span>
                  <span className="font-bold text-base md:text-lg text-gray-900">{formatPrice(selectedTotal)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium text-sm md:text-base">Phí vận chuyển:</span>
                  <span className="font-bold text-green-600 flex items-center gap-1 text-sm md:text-base">
                    Miễn phí 🚚
                  </span>
                </div>
                <div className="border-t-2 border-white pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-base md:text-lg font-bold text-gray-900">Tổng cộng:</span>
                    <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      {formatPrice(selectedTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-center text-gray-600 mb-6 md:mb-8 text-sm md:text-base">
                Bạn có chắc chắn muốn đặt hàng <span className="font-bold text-blue-600">{selectedCount}</span> sản phẩm?
              </p>

              <div className="flex gap-3 md:gap-4">
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="flex-1 py-3 md:py-4 border-2 border-gray-300 hover:bg-gray-50 rounded-xl font-bold transition-all text-gray-700 text-sm md:text-base"
                >
                  Hủy
                </button>
                <button
                  onClick={handleConfirmCheckout}
                  className="flex-1 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm md:text-base"
                >
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && items.length > 0 && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-700 font-medium">Đang xử lý...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartCheckout;