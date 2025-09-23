import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  loadCartFromStorage 
} from '../store/slices/cartSlice';
import { formatPrice } from '../utils/helpers';

export const useCart = () => {
  const dispatch = useDispatch();
  const { items, total, itemCount } = useSelector((state) => state.cart);

  const addItem = useCallback((product, options = {}) => {
    const { quantity = 1, size, color, design } = options;
    dispatch(addToCart({ product, quantity, size, color, design }));
  }, [dispatch]);

  const removeItem = useCallback((itemId) => {
    dispatch(removeFromCart(itemId));
  }, [dispatch]);

  const updateItemQuantity = useCallback((itemId, quantity) => {
    dispatch(updateQuantity({ itemId, quantity }));
  }, [dispatch]);

  const clearAllItems = useCallback(() => {
    dispatch(clearCart());
  }, [dispatch]);

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

  return {
    items,
    total,
    itemCount,
    addItem,
    removeItem,
    updateItemQuantity,
    clearAllItems,
    loadCart,
    getItemById,
    getItemByProduct,
    getTotalPrice,
    getTotalItems,
    isEmpty,
    hasItem,
  };
};
