import React, { useState, useEffect } from 'react';
import { useCart } from '../../../hooks/useCart';
import { formatPrice } from '../../../utils/helpers';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import CartMockHelper from '../../../components/dev/CartMockHelper';
import styles from './CartCheckout.module.css';

const CartCheckout = () => {
  const {
    items,
    total,
    itemCount,
    updateItemQuantity,
    removeItem,
    clearAllItems,
    isEmpty,
    getCartSummary,
    getShippingEstimate,
    getCartForCheckout,
    saveCartToWishlist,
    duplicateItem,
    isLoading,
    error,
    clearError,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // 'cart' or 'checkout'
  const [shippingInfo, setShippingInfo] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod', 'bank', 'momo'
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Get shipping estimate and cart summary
  const shippingEstimate = getShippingEstimate();
  const cartSummary = getCartSummary();
  const finalTotal = total + shippingEstimate.cost;

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      updateItemQuantity(itemId, newQuantity);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSaveToWishlist = (itemId) => {
    const success = saveCartToWishlist(itemId);
    if (success) {
      alert('Đã lưu vào danh sách yêu thích!');
    } else {
      alert('Sản phẩm đã có trong danh sách yêu thích!');
    }
  };

  const handleDuplicateItem = (itemId) => {
    const success = duplicateItem(itemId);
    if (success) {
      alert('Đã nhân bản sản phẩm!');
    }
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
  };

  const handleInputChange = (field, value) => {
    setShippingInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProceedToCheckout = () => {
    if (isEmpty()) return;
    setCheckoutStep('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCart = () => {
    setCheckoutStep('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    try {
      const checkoutData = getCartForCheckout();
      setShowConfirmModal(true);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clear cart after successful order
      clearAllItems();
      setCheckoutStep('cart');

      // Show success message
      alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    } catch (error) {
      console.error('Order failed:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isEmpty() && checkoutStep === 'cart') {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <div className={styles.emptyIcon}>🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/products'}
            className={styles.shopButton}
          >
            Tiếp tục mua sắm
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Mock Helper - chỉ hiển thị trong development */}
      <CartMockHelper isVisible={process.env.NODE_ENV === 'development'} />

      <div className={styles.header}>
        <h1>
          {checkoutStep === 'cart' ? 'Giỏ hàng' : 'Thanh toán'}
        </h1>
        {checkoutStep === 'checkout' && (
          <button
            className={styles.backButton}
            onClick={handleBackToCart}
          >
            ← Quay lại giỏ hàng
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>⏳</div>
          <span>Đang xử lý...</span>
        </div>
      )}

      <div className={styles.content}>
        {checkoutStep === 'cart' ? (
          <>
            {/* Cart Items */}
            <div className={styles.cartSection}>
              <div className={styles.cartHeader}>
                <h2>Sản phẩm ({itemCount})</h2>
                {!isEmpty() && (
                  <button
                    className={styles.clearButton}
                    onClick={clearAllItems}
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              <div className={styles.cartItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.cartItem}>
                    <div className={styles.itemImage}>
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className={styles.itemInfo}>
                      <h3>{item.name}</h3>
                      <div className={styles.itemDetails}>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Màu: {item.color}</span>}
                      </div>
                      <div className={styles.itemPrice}>
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className={styles.itemButtons}>
                        <button
                          className={styles.wishlistButton}
                          onClick={() => handleSaveToWishlist(item.id)}
                          title="Lưu vào yêu thích"
                        >
                          ❤️
                        </button>

                        <button
                          className={styles.duplicateButton}
                          onClick={() => handleDuplicateItem(item.id)}
                          title="Nhân bản sản phẩm"
                        >
                          📋
                        </button>

                        <button
                          className={styles.removeButton}
                          onClick={() => handleRemoveItem(item.id)}
                          title="Xóa khỏi giỏ hàng"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    <div className={styles.itemTotal}>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Summary */}
            <div className={styles.summarySection}>
              <div className={styles.summaryCard}>
                <h3>Tóm tắt đơn hàng</h3>

                <div className={styles.summaryRow}>
                  <span>Tạm tính:</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span>{shippingEstimate.formattedCost}</span>
                </div>

                {!shippingEstimate.isFree && (
                  <div className={styles.shippingMessage}>
                    <small>{shippingEstimate.message}</small>
                  </div>
                )}

                <div className={styles.summaryRowTotal}>
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>

                <Button
                  variant="primary"
                  size="large"
                  onClick={handleProceedToCheckout}
                  className={styles.checkoutButton}
                  disabled={isEmpty()}
                >
                  Tiến hành thanh toán
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Checkout Form */}
            <div className={styles.checkoutSection}>
              <div className={styles.shippingInfo}>
                <h2>Thông tin giao hàng</h2>

                <div className={styles.formGrid}>
                  <Input
                    label="Họ và tên *"
                    value={shippingInfo.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="Nhập họ và tên"
                    required
                  />

                  <Input
                    label="Email *"
                    type="email"
                    value={shippingInfo.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Nhập email"
                    required
                  />

                  <Input
                    label="Số điện thoại *"
                    value={shippingInfo.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                    required
                  />

                  <Input
                    label="Địa chỉ *"
                    value={shippingInfo.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Số nhà, tên đường"
                    required
                  />

                  <Input
                    label="Thành phố *"
                    value={shippingInfo.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    placeholder="Nhập thành phố"
                    required
                  />

                  <Input
                    label="Quận/Huyện *"
                    value={shippingInfo.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    placeholder="Nhập quận/huyện"
                    required
                  />

                  <Input
                    label="Phường/Xã *"
                    value={shippingInfo.ward}
                    onChange={(e) => handleInputChange('ward', e.target.value)}
                    placeholder="Nhập phường/xã"
                    required
                  />
                </div>

                <div className={styles.notesSection}>
                  <label>Ghi chú đơn hàng</label>
                  <textarea
                    value={shippingInfo.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Ghi chú thêm về đơn hàng (không bắt buộc)"
                    rows={4}
                  />
                </div>
              </div>

              <div className={styles.paymentMethod}>
                <h2>Phương thức thanh toán</h2>

                <div className={styles.paymentOptions}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Thanh toán khi nhận hàng (COD)</span>
                      <span className={styles.paymentDesc}>Thanh toán bằng tiền mặt khi nhận hàng</span>
                    </div>
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank"
                      checked={paymentMethod === 'bank'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Chuyển khoản ngân hàng</span>
                      <span className={styles.paymentDesc}>Chuyển khoản qua tài khoản ngân hàng</span>
                    </div>
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="payment"
                      value="momo"
                      checked={paymentMethod === 'momo'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Ví MoMo</span>
                      <span className={styles.paymentDesc}>Thanh toán qua ví điện tử MoMo</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h2>Đơn hàng của bạn</h2>

              <div className={styles.orderItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <img src={item.image} alt={item.name} />
                    <div className={styles.orderItemInfo}>
                      <h4>{item.name}</h4>
                      <span>Số lượng: {item.quantity}</span>
                    </div>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className={styles.orderTotals}>
                <div className={styles.totalRow}>
                  <span>Tạm tính:</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className={styles.totalRow}>
                  <span>Phí vận chuyển:</span>
                  <span>{shippingEstimate.formattedCost}</span>
                </div>
                <div className={styles.totalRowFinal}>
                  <span>Tổng cộng:</span>
                  <span>{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                size="large"
                onClick={handlePlaceOrder}
                className={styles.placeOrderButton}
                disabled={isProcessing}
              >
                {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
              </Button>
            </div>
          </>
        )}
      </div>

      {/* Confirm Order Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="Xác nhận đặt hàng"
      >
        <div className={styles.confirmModal}>
          <p>Bạn có chắc chắn muốn đặt hàng với thông tin này?</p>

          <div className={styles.confirmInfo}>
            <div className={styles.confirmSection}>
              <h4>Thông tin giao hàng:</h4>
              <p><strong>Người nhận:</strong> {shippingInfo.fullName}</p>
              <p><strong>Điện thoại:</strong> {shippingInfo.phone}</p>
              <p><strong>Địa chỉ:</strong> {shippingInfo.address}, {shippingInfo.ward}, {shippingInfo.district}, {shippingInfo.city}</p>
            </div>

            <div className={styles.confirmSection}>
              <h4>Phương thức thanh toán:</h4>
              <p>
                {paymentMethod === 'cod' && 'Thanh toán khi nhận hàng (COD)'}
                {paymentMethod === 'bank' && 'Chuyển khoản ngân hàng'}
                {paymentMethod === 'momo' && 'Ví MoMo'}
              </p>
            </div>

            <div className={styles.confirmSection}>
              <h4>Tổng tiền:</h4>
              <p className={styles.finalAmount}>{formatPrice(finalTotal)}</p>
            </div>
          </div>

          <div className={styles.confirmActions}>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmModal(false)}
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirmOrder}
            >
              Xác nhận đặt hàng
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartCheckout;
