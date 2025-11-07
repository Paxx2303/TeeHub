import React, { useState, useEffect, useMemo } from 'react';
import { Button } from "../../../components/ui/cart/button.jsx";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/cart/card.jsx";
import { Checkbox } from "../../../components/ui/cart/checkbox.jsx";
import { Label } from "../../../components/ui/cart/label.jsx";
import { RadioGroup, RadioGroupItem } from "../../../components/ui/cart/radio-group.jsx";
import { Input } from "../../../components/ui/cart/input.jsx";
import { Separator } from "../../../components/ui/cart/separator.jsx";
import CartService from "../../../services/cart_service.js";
import OrderService from "../../../services/orderService.js";
import PaymentQR from "../../../components/ui/cart/PaymentQR.jsx";
import AddressSelector from "../../../components/ui/cart/AddressSelector.jsx";
import { getUserId } from "../../../utils/auth";

// Toast
const toast = {
  success: (m) => { try { console.log(m); alert(m); } catch (_) { console.log(m); } },
  error: (m) => { try { console.error(m); alert(m); } catch (_) { console.error(m); } },
  warning: (m) => { try { console.warn(m); alert(m); } catch (_) { console.warn(m); } },
};

const CartCheckout = () => {
  const [cart, setCart] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qr');
  const [shippingMethod, setShippingMethod] = useState('express');
  const [isProcessingOrder, setIsProcessingOrder] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isActing, setIsActing] = useState(false);

  const userId = getUserId();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      setIsLoading(true);
      const data = await CartService.getCart();
      const normalized = {
        ...data,
        items: Array.isArray(data?.items)
          ? data.items.map((i) => ({
            ...i,
            id: i?.id ?? i?.cartItemId ?? i?.cart_item_id,
          }))
          : [],
      };
      setCart(normalized);
      setError(null);
    } catch (err) {
      console.error("Lỗi tải giỏ hàng:", err);
      setError("Không thể tải giỏ hàng.");
      toast.error("Không thể tải giỏ hàng");
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
    if (!cart?.items) return;
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(cart.items.map(item => item.id)));
    }
  };

  const handleQuantityChange = async (item, newQty) => {
    if (newQty < 1) return;

    const previousCart = cart;
    if (cart) {
      setCart({
        ...cart,
        items: cart.items.map(i =>
          i.id === item.id ? { ...i, qty: newQty } : i
        )
      });
    }

    try {
      await CartService.updateCart(item.id, newQty);
      toast.success("Đã cập nhật số lượng");
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err);
      toast.error("Không thể cập nhật số lượng");
      setCart(previousCart);
    }
  };

  useEffect(() => {
    if (!cart?.items) {
      setSelectedItems(new Set());
      return;
    }
    setSelectedItems((prev) => {
      const ids = new Set(cart.items.map((i) => i.id));
      const next = new Set();
      prev.forEach((id) => { if (ids.has(id)) next.add(id); });
      return next;
    });
  }, [cart?.items]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      await CartService.removeFromCart(cartItemId);
      if (cart) {
        setCart({
          ...cart,
          items: cart.items.filter(i => i.id !== cartItemId)
        });
      }
      setSelectedItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
      toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err);
      toast.error("Không thể xóa sản phẩm");
    }
  };

  const getOptionsDisplay = (selectedOptions) => {
    if (!selectedOptions || selectedOptions.length === 0) return null;
    return selectedOptions.map(opt => opt.value).join(" - ");
  };

  const handleRemoveSelected = async () => {
    if (!cart?.items || selectedItems.size === 0) return;
    setIsActing(true);
    try {
      for (const id of Array.from(selectedItems)) {
        await CartService.removeFromCart(id);
      }
      setCart((current) => current ? { ...current, items: current.items.filter((i) => !selectedItems.has(i.id)) } : current);
      setSelectedItems(new Set());
      toast.success("Đã xóa các sản phẩm đã chọn");
    } catch (err) {
      console.error("Lỗi xóa đã chọn:", err);
      toast.error("Không thể xóa các sản phẩm đã chọn");
    } finally {
      setIsActing(false);
    }
  };

  const { selectedTotal, selectedCount, shippingPrice } = useMemo(() => {
    if (!cart?.items) return { selectedTotal: 0, selectedCount: 0, shippingPrice: 0 };

    let total = 0;
    let count = 0;

    for (const item of cart.items) {
      if (selectedItems.has(item.id)) {
        total += item.price * item.qty;
        count += 1;
      }
    }

    const shipping = shippingMethod === 'express' ? 35000 : 20000;

    return { selectedTotal: total, selectedCount: count, shippingPrice: shipping };
  }, [cart?.items, selectedItems, shippingMethod]);

  const handleProceedToPayment = () => {
    if (selectedItems.size === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    if (!selectedAddressId) {
      toast.warning("Vui lòng chọn địa chỉ giao hàng");
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmOrder = async () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập để đặt hàng");
      return;
    }

    setIsProcessingOrder(true);

    try {
      const paymentProviderMap = {
        qr: 'VietQR',
        card: 'VISA',
        cod: 'Tiền mặt'
      };

      const paymentTypeMap = {
        qr: 'Chuyển khoản ngân hàng',
        card: 'Thẻ tín dụng',
        cod: 'Thanh toán khi nhận hàng'
      };

      const orderRequest = {
        userId,
        paymentTypeName: paymentTypeMap[paymentMethod],
        paymentProvider: paymentProviderMap[paymentMethod],
        paymentAccountNumber: paymentMethod === 'qr' ? '4605016865' : '',
        paymentStatus: paymentMethod === 'cod' ? 'Chưa thanh toán' : 'Đang chờ',
        shippingMethodName: shippingMethod === 'express' ? 'Giao nhanh' : 'Giao tiêu chuẩn',
        shippingPrice: shippingPrice,
        orderStatus: 'Đang xử lý',
        selectedItemIds: Array.from(selectedItems)
      };

      await OrderService.createOrder(orderRequest);

      toast.success("Đặt hàng thành công!");

      if (cart) {
        setCart({
          ...cart,
          items: cart.items.filter(i => !selectedItems.has(i.id))
        });
      }
      setSelectedItems(new Set());
      setShowPaymentModal(false);
    } catch (err) {
      console.error("Lỗi tạo đơn hàng:", err);
      toast.error("Không thể tạo đơn hàng. Vui lòng thử lại!");
    } finally {
      setIsProcessingOrder(false);
    }
  };

  if (isLoading && !cart) {
    return (
      <div className="loading-container">
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .loading-card {
            padding: 2rem;
            background: white;
            border-radius: 1rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .spinner {
            width: 4rem;
            height: 4rem;
            border: 4px solid #e5e7eb;
            border-top-color: #3b82f6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          .loading-text {
            color: #6b7280;
            font-weight: 500;
          }
        `}</style>
        <div className="loading-card">
          <div className="spinner"></div>
          <p className="loading-text">Đang tải giỏ hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        /* Global Container */
        .cart-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          font-family: system-ui, -apple-system, sans-serif;
        }
        .container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1rem;
        }
        @media (min-width: 768px) {
          .container { padding: 2rem; }
        }

        /* Card */
        .card {
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 1.5rem;
        }
        .card-header {
          padding: 1.5rem;
          background: rgba(243, 244, 246, 0.5);
          border-radius: 1rem 1rem 0 0;
        }
        .card-content {
          padding: 1.5rem;
        }

        /* Header */
        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-icon {
          width: 3rem;
          height: 3rem;
          background: #3b82f6;
          color: white;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .header-title {
          font-size: 1.5rem;
          font-weight: bold;
          color: #1f2937;
        }
        @media (min-width: 768px) {
          .header-title { font-size: 2.25rem; }
        }
        .header-subtitle {
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }
        .back-button {
          padding: 0.5rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.875rem;
        }
        .back-button:hover {
          background: #f9fafb;
        }

        /* Error */
        .error-card {
          border-left: 4px solid #ef4444;
          margin-bottom: 1.5rem;
        }
        .error-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
          padding: 1rem;
        }
        .error-text {
          color: #ef4444;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .retry-button {
          padding: 0.25rem 0.75rem;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 0.375rem;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .close-button {
          padding: 0.25rem 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
        }

        /* Empty Cart */
        .empty-cart {
          padding: 4rem;
          text-align: center;
        }
        .empty-icon {
          width: 8rem;
          height: 8rem;
          background: #f3f4f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 4rem;
        }
        .empty-title {
          font-size: 1.875rem;
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.75rem;
        }
        .empty-text {
          color: #6b7280;
          font-size: 1.125rem;
          margin-bottom: 2rem;
        }
        .continue-button {
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          cursor: pointer;
        }
        .continue-button:hover {
          background: #2563eb;
        }

        /* Grid */
        .grid-container {
          display: grid;
          grid-template-columns: 1fr;
          gap: 1.5rem;
        }
        @media (min-width: 1024px) {
          .grid-container {
            grid-template-columns: 2fr 1fr;
          }
        }

        /* Cart Items */
        .cart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.75rem;
        }
        .cart-title {
          font-size: 1.125rem;
          font-weight: bold;
        }
        @media (min-width: 768px) {
          .cart-title { font-size: 1.25rem; }
        }
        .delete-selected {
          padding: 0.5rem 1rem;
          background: transparent;
          color: #ef4444;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
        }
        .delete-selected:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .cart-item {
          padding: 1rem;
          transition: all 0.2s;
          border-bottom: 1px solid #e5e7eb;
        }
        @media (min-width: 768px) {
          .cart-item { padding: 1.25rem; }
        }
        .cart-item:hover {
          background: rgba(243, 244, 246, 0.3);
        }
        .cart-item.selected {
          background: rgba(243, 244, 246, 0.5);
        }
        .cart-item-content {
          display: flex;
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .cart-item-content { gap: 1rem; }
        }
        .product-image {
          width: 5rem;
          height: 5rem;
          background: #f3f4f6;
          border-radius: 0.75rem;
          overflow: hidden;
          flex-shrink: 0;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        @media (min-width: 768px) {
          .product-image {
            width: 7rem;
            height: 7rem;
          }
        }
        .product-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .product-name {
          font-weight: bold;
          color: #1f2937;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        @media (min-width: 768px) {
          .product-name { font-size: 1.125rem; }
        }
        .options-badge {
          display: inline-block;
          font-size: 0.75rem;
          background: #f3f4f6;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          color: #6b7280;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        @media (min-width: 768px) {
          .options-badge { font-size: 0.875rem; }
        }
        .custom-badge {
          display: inline-block;
          font-size: 0.75rem;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          padding: 0.375rem 0.75rem;
          border-radius: 0.5rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }
        .product-price {
          font-size: 1.125rem;
          font-weight: bold;
          color: #3b82f6;
          margin-bottom: 0.75rem;
        }
        @media (min-width: 768px) {
          .product-price { font-size: 1.25rem; }
        }
        .quantity-control {
          display: flex;
          align-items: center;
          border: 2px solid #e5e7eb;
          border-radius: 0.75rem;
          overflow: hidden;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .quantity-button {
          height: 2rem;
          width: 2rem;
          padding: 0;
          background: transparent;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        .quantity-button:hover:not(:disabled) {
          background: #f3f4f6;
        }
        .quantity-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .quantity-display {
          width: 2.5rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-left: 2px solid #e5e7eb;
          border-right: 2px solid #e5e7eb;
          font-weight: bold;
          color: #1f2937;
        }
        .price-total {
          font-weight: bold;
          color: #1f2937;
          font-size: 0.875rem;
        }
        @media (min-width: 768px) {
          .price-total { font-size: 1rem; }
        }
        .remove-button {
          height: 2rem;
          padding: 0 0.5rem;
          background: transparent;
          border: none;
          color: #ef4444;
          cursor: pointer;
          transition: all 0.2s;
        }
        .remove-button:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        /* Summary */
        .summary-card {
          position: sticky;
          top: 1rem;
        }
        .summary-title {
          font-size: 1.25rem;
          font-weight: bold;
        }
        @media (min-width: 768px) {
          .summary-title { font-size: 1.5rem; }
        }
        .summary-subtitle {
          color: #6b7280;
          font-size: 0.75rem;
        }
        @media (min-width: 768px) {
          .summary-subtitle { font-size: 0.875rem; }
        }
        .summary-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #1f2937;
        }
        .summary-label {
          font-weight: 500;
          font-size: 0.875rem;
        }
        @media (min-width: 768px) {
          .summary-label { font-size: 1rem; }
        }
        .summary-value {
          font-weight: bold;
          font-size: 1rem;
        }
        @media (min-width: 768px) {
          .summary-value { font-size: 1.125rem; }
        }
        .separator {
          height: 1px;
          background: #e5e7eb;
          margin: 1rem 0;
        }
        .shipping-option {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
        }
        .shipping-option:hover {
          background: rgba(243, 244, 246, 0.5);
        }
        .total-box {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 0.75rem;
          padding: 1rem;
          margin: 1.5rem 0;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .total-label {
          font-size: 1rem;
          font-weight: bold;
          color: #1f2937;
        }
        @media (min-width: 768px) {
          .total-label { font-size: 1.125rem; }
        }
        .total-amount {
          font-size: 1.25rem;
          font-weight: bold;
          color: #3b82f6;
        }
        @media (min-width: 768px) {
          .total-amount { font-size: 1.5rem; }
        }
        .checkout-button {
          width: 100%;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .checkout-button:hover:not(:disabled) {
          background: #2563eb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .checkout-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .warning-box {
          font-size: 0.75rem;
          color: #6b7280;
          text-align: center;
          background: rgba(251, 191, 36, 0.1);
          padding: 0.75rem;
          border-radius: 0.5rem;
          margin-top: 1rem;
        }
        @media (min-width: 768px) {
          .warning-box { font-size: 0.875rem; }
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
        }
        .modal-card {
          max-width: 42rem;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
        }
        .modal-header {
          text-align: center;
          padding: 1.5rem;
        }
        .modal-icon {
          width: 4rem;
          height: 4rem;
          background: #3b82f6;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          font-size: 1.875rem;
        }
        @media (min-width: 768px) {
          .modal-icon {
            width: 5rem;
            height: 5rem;
            font-size: 2.25rem;
          }
        }
        .modal-title {
          font-size: 1.5rem;
          font-weight: bold;
        }
        @media (min-width: 768px) {
          .modal-title { font-size: 1.875rem; }
        }
        .order-summary-box {
          background: rgba(243, 244, 246, 0.5);
          border-radius: 0.75rem;
          padding: 1.25rem;
          margin-bottom: 1.5rem;
        }
        @media (min-width: 768px) {
          .order-summary-box { padding: 1.5rem; }
        }
        .summary-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
        }
        .payment-option {
          display: flex;
          align-items: center;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
          margin-bottom: 0.5rem;
        }
        .payment-option:hover {
          background: rgba(243, 244, 246, 0.5);
        }
        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .input-label {
          font-weight: 500;
          font-size: 0.875rem;
        }
        .input {
          padding: 0.5rem 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          font-size: 1rem;
          transition: all 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        .cod-info {
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
          color: #1f2937;
        }
        .modal-actions {
          display: flex;
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .modal-actions { gap: 1rem; }
        }
        .cancel-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .cancel-button:hover {
          background: #f9fafb;
        }
        .confirm-button {
          flex: 1;
          padding: 0.75rem 1.5rem;
          background: #3b82f6;
          color: white;
          border: none;
          border-radius: 0.5rem;
          font-size: 1.125rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .confirm-button:hover:not(:disabled) {
          background: #2563eb;
        }
        .confirm-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `}</style>

      <div className="cart-page">
        <div className="container">
          {/* Header */}
          <div className="card">
            <div className="card-content">
              <div className="header-content">
                <div className="header-left">
                  <div className="header-icon">Cart</div>
                  <div>
                    <h1 className="header-title">Giỏ hàng của bạn</h1>
                    <p className="header-subtitle">{cart?.items.length || 0} sản phẩm</p>
                  </div>
                </div>
                <button className="back-button" onClick={() => window.history.back()}>
                  Quay lại
                </button>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="error-card">
              <div className="error-content">
                <div className="error-text">
                  <span>Lỗi</span>
                  <span>{error}</span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="retry-button" onClick={loadCart}>Thử lại</button>
                  <button className="close-button" onClick={() => setError(null)}>x</button>
                </div>
              </div>
            </div>
          )}

          {/* Empty Cart */}
          {!cart?.items || cart.items.length === 0 ? (
            <div className="card">
              <div className="empty-cart">
                <div className="empty-icon">Shopping Bag</div>
                <h2 className="empty-title">Giỏ hàng trống</h2>
                <p className="empty-text">Hãy thêm vài sản phẩm yêu thích của bạn nhé!</p>
                <button className="continue-button" onClick={() => window.history.back()}>
                  Tiếp tục mua sắm
                </button>
              </div>
            </div>
          ) : (
            <div style={{ marginTop: '1.5rem' }}>
              <AddressSelector
                selectedAddressId={selectedAddressId}
                onSelectAddress={setSelectedAddressId}
              />

              <div className="grid-container">
                {/* Cart Items */}
                <div>
                  <div className="card">
                    <div className="card-header">
                      <div className="cart-header">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <Checkbox
                            checked={selectedItems.size === cart.items.length && cart.items.length > 0}
                            onCheckedChange={toggleSelectAll}
                          />
                          <h3 className="cart-title">Sản phẩm ({cart.items.length})</h3>
                        </div>
                        <button
                          className="delete-selected"
                          disabled={selectedItems.size === 0 || isActing}
                          onClick={handleRemoveSelected}
                        >
                          Xóa đã chọn
                        </button>
                      </div>
                    </div>
                    <div className="card-content" style={{ padding: 0 }}>
                      {cart.items.map((item) => {
                        const isSelected = selectedItems.has(item.id);
                        const optionsDisplay = getOptionsDisplay(item.selectedOptions);

                        return (
                          <div
                            key={item.id}
                            className={`cart-item ${isSelected ? 'selected' : ''}`}
                          >
                            <div className="cart-item-content">
                              <div style={{ paddingTop: '0.5rem' }}>
                                <Checkbox
                                  checked={isSelected}
                                  onCheckedChange={() => toggleSelectItem(item.id)}
                                />
                              </div>

                              <div className="product-image">
                                <img
                                  src={`https://placehold.co/200x200/e2e8f0/64748b?text=${item.productImage}`}
                                  alt="Product"
                                />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <h3 className="product-name">Sản phẩm #{item.productItemId}</h3>

                                {optionsDisplay && (
                                  <span className="options-badge">{optionsDisplay}</span>
                                )}

                                {item.is_customed && (
                                  <span className="custom-badge">Tùy chỉnh</span>
                                )}

                                <p className="product-price">{formatPrice(item.price)}</p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                                  <div className="quantity-control">
                                    <button
                                      className="quantity-button"
                                      onClick={() => handleQuantityChange(item, item.qty - 1)}
                                      disabled={item.qty <= 1}
                                    >−</button>
                                    <span className="quantity-display">{item.qty}</span>
                                    <button
                                      className="quantity-button"
                                      onClick={() => handleQuantityChange(item, item.qty + 1)}
                                    >+</button>
                                  </div>

                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span className="price-total">{formatPrice(item.price * item.qty)}</span>
                                    <button
                                      className="remove-button"
                                      onClick={() => handleRemoveItem(item.id)}
                                    >Trash</button>
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

                {/* Summary */}
                <div>
                  <div className="card summary-card">
                    <div className="card-header">
                      <h3 className="summary-title">Tóm tắt đơn hàng</h3>
                      <p className="summary-subtitle">Kiểm tra thông tin trước khi thanh toán</p>
                    </div>
                    <div className="card-content" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="summary-row">
                          <span className="summary-label">Đã chọn</span>
                          <span className="summary-value">{selectedCount} sản phẩm</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Tạm tính</span>
                          <span className="summary-value">{formatPrice(selectedTotal)}</span>
                        </div>

                        <div className="separator"></div>

                        <div>
                          <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>
                            Phương thức vận chuyển
                          </label>
                          <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                            <div className="shipping-option">
                              <RadioGroupItem value="express" id="express" />
                              <label htmlFor="express" style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Giao nhanh</span>
                                <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>35.000₫</span>
                              </label>
                            </div>
                            <div className="shipping-option">
                              <RadioGroupItem value="standard" id="standard" />
                              <label htmlFor="standard" style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Giao tiêu chuẩn</span>
                                <span style={{ fontWeight: 'bold' }}>20.000₫</span>
                              </label>
                            </div>
                          </RadioGroup>
                        </div>
                      </div>

                      <div className="total-box">
                        <div className="total-row">
                          <span className="total-label">Tổng cộng</span>
                          <span className="total-amount">{formatPrice(selectedTotal + shippingPrice)}</span>
                        </div>
                      </div>

                      <button
                        className="checkout-button"
                        onClick={handleProceedToPayment}
                        disabled={selectedItems.size === 0 || !selectedAddressId}
                      >
                        Thanh toán ngay
                      </button>

                      {selectedItems.size === 0 && (
                        <p className="warning-box">
                          Vui lòng chọn sản phẩm để thanh toán
                        </p>
                      )}

                      {selectedItems.size > 0 && !selectedAddressId && (
                        <p className="warning-box">
                          Vui lòng chọn địa chỉ giao hàng
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="modal-overlay">
              <div className="modal-card">
                <div className="modal-header">
                  <div className="modal-icon">Check</div>
                  <h3 className="modal-title">Xác nhận thanh toán</h3>
                </div>
                <div className="card-content" style={{ padding: '0 1.5rem 1.5rem' }}>
                  <div className="order-summary-box">
                    <div className="summary-item-row">
                      <span style={{ color: '#6b7280', fontWeight: 500 }}>Số sản phẩm:</span>
                      <span style={{ fontWeight: 'bold' }}>{selectedCount}</span>
                    </div>
                    <div className="summary-item-row">
                      <span style={{ color: '#6b7280', fontWeight: 500 }}>Tạm tính:</span>
                      <span style={{ fontWeight: 'bold' }}>{formatPrice(selectedTotal)}</span>
                    </div>
                    <div className="summary-item-row">
                      <span style={{ color: '#6b7280', fontWeight: 500 }}>Phí vận chuyển:</span>
                      <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{formatPrice(shippingPrice)}</span>
                    </div>
                    <div className="separator"></div>
                    <div className="summary-item-row">
                      <span style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>Tổng cộng:</span>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                        {formatPrice(selectedTotal + shippingPrice)}
                      </span>
                    </div>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Phương thức thanh toán
                    </label>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="payment-option">
                        <RadioGroupItem value="qr" id="qr" />
                        <label htmlFor="qr" style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>Chuyển khoản QR (VietQR)</span>
                          <span>Phone</span>
                        </label>
                      </div>
                      <div className="payment-option">
                        <RadioGroupItem value="card" id="card" />
                        <label htmlFor="card" style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>Thẻ tín dụng/ghi nợ</span>
                          <span>Credit Card</span>
                        </label>
                      </div>
                      <div className="payment-option">
                        <RadioGroupItem value="cod" id="cod" />
                        <label htmlFor="cod" style={{ flex: 1, marginLeft: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span>Thanh toán khi nhận hàng (COD)</span>
                          <span>Cash</span>
                        </label>
                      </div>
                    </RadioGroup>
                  </div>

                  {paymentMethod === 'qr' && (
                    <PaymentQR
                      bankCode="BIDV"
                      accountNumber="4605016865"
                      amount={selectedTotal + shippingPrice}
                      info={`Thanh toan don hang ${cart?.id || ''}`}
                    />
                  )}

                  {paymentMethod === 'card' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
                      <div className="input-group">
                        <label className="input-label" htmlFor="cardNumber">Số thẻ</label>
                        <input className="input" id="cardNumber" placeholder="1234 5678 9012 3456" />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="input-group">
                          <label className="input-label" htmlFor="expiry">Ngày hết hạn</label>
                          <input className="input" id="expiry" placeholder="MM/YY" />
                        </div>
                        <div className="input-group">
                          <label className="input-label" htmlFor="cvv">CVV</label>
                          <input className="input" id="cvv" placeholder="123" type="password" />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'cod' && (
                    <div className="cod-info">
                      Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng. Vui lòng chuẩn bị đủ số tiền{' '}
                      <span style={{ fontWeight: 'bold', color: '#3b82f6' }}>{formatPrice(selectedTotal + shippingPrice)}</span>
                    </div>
                  )}

                  <div className="modal-actions">
                    <button
                      className="cancel-button"
                      onClick={() => setShowPaymentModal(false)}
                    >
                      Hủy
                    </button>
                    <button
                      className="confirm-button"
                      onClick={handleConfirmOrder}
                      disabled={isProcessingOrder}
                    >
                      {isProcessingOrder ? "Đang xử lý..." : "Xác nhận đặt hàng"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartCheckout;