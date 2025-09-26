import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  loadCartFromStorage 
} from '../store/slices/cartSlice';
import { formatPrice, generateId } from '../utils/helpers';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state) => state.cart);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Auto-load cart from storage on mount
  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  // Tracking function for analytics
  const trackCartAction = useCallback((action, data) => {
    // Console log for development
    console.log(`Cart Action: ${action}`, data);
  }, []);

  const addItem = useCallback((product, options = {}) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const { quantity = 1, size, color, design, customizations = {} } = options;
      
      // Validation
      if (!product || !product.id) {
        throw new Error('Sản phẩm không hợp lệ');
      }
      
      if (quantity < 1 || quantity > 99) {
        throw new Error('Số lượng phải từ 1 đến 99');
      }
      
      if (product.stock && quantity > product.stock) {
        throw new Error(`Chỉ còn ${product.stock} sản phẩm trong kho`);
      }

      dispatch(addToCart({ 
        product, 
        quantity, 
        size, 
        color, 
        design,
        customizations,
        addedAt: new Date().toISOString()
      }));
      
      // Track cart action
      trackCartAction('add_item', { 
        productId: product.id, 
        quantity, 
        size, 
        color 
      });
      
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, trackCartAction]);

  const removeItem = useCallback((itemId) => {
    try {
      setError(null);
      const item = items.find(item => item.id === itemId);
      
      if (item) {
        trackCartAction('remove_item', { 
          productId: item.productId, 
          quantity: item.quantity 
        });
      }
      
      dispatch(removeFromCart(itemId));
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [dispatch, items, trackCartAction]);

  const updateItemQuantity = useCallback((itemId, quantity) => {
    try {
      setError(null);
      
      if (quantity < 1 || quantity > 99) {
        throw new Error('Số lượng phải từ 1 đến 99');
      }
      
      const item = items.find(item => item.id === itemId);
      if (item && item.product?.stock && quantity > item.product.stock) {
        throw new Error(`Chỉ còn ${item.product.stock} sản phẩm trong kho`);
      }
      
      const oldQuantity = item?.quantity || 0;
      dispatch(updateQuantity({ itemId, quantity }));
      
      trackCartAction('update_quantity', { 
        productId: item?.productId, 
        oldQuantity, 
        newQuantity: quantity 
      });
      
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [dispatch, items, trackCartAction]);

  const clearAllItems = useCallback(() => {
    try {
      setError(null);
      
      trackCartAction('clear_cart', { 
        itemCount, 
        totalValue: total 
      });
      
      dispatch(clearCart());
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [dispatch, itemCount, total, trackCartAction]);

  const loadCart = useCallback(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  const getItemById = useCallback((itemId) => {
    return items.find(item => item.id === itemId);
  }, [items]);

  const getItemByProduct = useCallback((productId, size, color, design) => {
    return items.find(item => 
      item.productId === productId && 
      item.size === size && 
      item.color === color &&
      JSON.stringify(item.design) === JSON.stringify(design)
    );
  }, [items]);

  const getTotalPrice = useCallback(() => {
    return formatPrice(total);
  }, [total]);

  const getTotalItems = useCallback(() => {
    return itemCount;
  }, [itemCount]);

  const isEmpty = useCallback(() => {
    return items.length === 0;
  }, [items.length]);

  const hasItem = useCallback((productId, size, color, design) => {
    return getItemByProduct(productId, size, color, design) !== undefined;
  }, [getItemByProduct]);

  // Enhanced utility functions
  const getCartSummary = useCallback(() => {
    const uniqueProducts = new Set(items.map(item => item.productId)).size;
    const totalWeight = items.reduce((weight, item) => {
      return weight + ((item.product?.weight || 0.2) * item.quantity);
    }, 0);
    
    return {
      itemCount,
      uniqueProducts,
      totalValue: total,
      totalWeight: Math.round(totalWeight * 100) / 100,
      formattedTotal: formatPrice(total),
      isEmpty: items.length === 0
    };
  }, [items, itemCount, total]);

  const getShippingEstimate = useCallback(() => {
    const baseShipping = 30000;
    const freeShippingThreshold = 500000;
    
    if (total >= freeShippingThreshold) {
      return {
        cost: 0,
        formattedCost: 'Miễn phí',
        isFree: true,
        message: 'Đơn hàng được miễn phí vận chuyển'
      };
    }
    
    return {
      cost: baseShipping,
      formattedCost: formatPrice(baseShipping),
      isFree: false,
      message: `Mua thêm ${formatPrice(freeShippingThreshold - total)} để được miễn phí vận chuyển`
    };
  }, [total]);

  const validateCart = useCallback(() => {
    const errors = [];
    
    items.forEach((item, index) => {
      if (!item.productId) {
        errors.push(`Sản phẩm ${index + 1}: Thiếu ID sản phẩm`);
      }
      
      if (!item.quantity || item.quantity < 1) {
        errors.push(`Sản phẩm ${index + 1}: Số lượng không hợp lệ`);
      }
      
      if (!item.price || item.price <= 0) {
        errors.push(`Sản phẩm ${index + 1}: Giá không hợp lệ`);
      }
    });
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }, [items]);

  const getCartForCheckout = useCallback(() => {
    const validation = validateCart();
    
    if (!validation.isValid) {
      throw new Error(`Giỏ hàng không hợp lệ: ${validation.errors.join(', ')}`);
    }
    
    const shipping = getShippingEstimate();
    
    return {
      items: items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        design: item.design,
        customizations: item.customizations || {}
      })),
      summary: getCartSummary(),
      shipping,
      totals: {
        subtotal: total,
        shipping: shipping.cost,
        total: total + shipping.cost,
        formattedSubtotal: formatPrice(total),
        formattedShipping: shipping.formattedCost,
        formattedTotal: formatPrice(total + shipping.cost)
      }
    };
  }, [items, total, validateCart, getShippingEstimate, getCartSummary]);

  const saveCartToWishlist = useCallback((itemId) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      // Save to localStorage wishlist
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      const existingIndex = wishlist.findIndex(w => w.productId === item.productId);
      
      if (existingIndex === -1) {
        wishlist.push({
          id: generateId(),
          productId: item.productId,
          name: item.name,
          price: item.price,
          image: item.image,
          addedAt: new Date().toISOString()
        });
        
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        trackCartAction('save_to_wishlist', { productId: item.productId });
        
        return true;
      }
    }
    return false;
  }, [items, trackCartAction]);

  const duplicateItem = useCallback((itemId) => {
    const item = items.find(item => item.id === itemId);
    if (item) {
      const newItem = {
        ...item,
        id: generateId(),
        addedAt: new Date().toISOString()
      };
      
      dispatch(addToCart(newItem));
      trackCartAction('duplicate_item', { productId: item.productId });
      
      return true;
    }
    return false;
  }, [items, dispatch, trackCartAction]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshCart = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      dispatch(loadCartFromStorage());
    } catch (err) {
      setError('Không thể tải giỏ hàng');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch]);

  return {
    // Core cart data
    items,
    total,
    itemCount,
    
    // Core cart actions
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    loadCart,
    
    // Item utilities
    getItemById,
    getItemByProduct,
    getTotalPrice,
    getTotalItems,
    isEmpty,
    hasItem,
    
    // Enhanced utilities
    getCartSummary,
    getShippingEstimate,
    validateCart,
    getCartForCheckout,
    saveCartToWishlist,
    duplicateItem,
    
    // State management
    isLoading,
    error,
    clearError,
    refreshCart,
    
    // Analytics
    trackCartAction,
  };
};