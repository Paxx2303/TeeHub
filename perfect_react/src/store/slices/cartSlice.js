import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

const getInitialCart = () => {
  if (typeof window === 'undefined') return [];
  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  return savedCart ? JSON.parse(savedCart) : [];
};

const saveCartToStorage = (cart) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
  }
};

const initialState = {
  items: getInitialCart(),
  total: 0,
  itemCount: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1, size, color, design } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => 
          item.id === product.id && 
          item.size === size && 
          item.color === color &&
          JSON.stringify(item.design) === JSON.stringify(design)
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += quantity;
      } else {
        state.items.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          size,
          color,
          design,
          productId: product.id,
        });
      }

      saveCartToStorage(state.items);
      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const itemId = action.payload;
      state.items = state.items.filter(item => item.id !== itemId);
      saveCartToStorage(state.items);
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { itemId, quantity } = action.payload;
      const item = state.items.find(item => item.id === itemId);
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== itemId);
        } else {
          item.quantity = quantity;
        }
        saveCartToStorage(state.items);
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      if (typeof window !== 'undefined') {
        localStorage.removeItem(STORAGE_KEYS.CART);
      }
    },

    calculateTotals: (state) => {
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    loadCartFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
        if (savedCart) {
          state.items = JSON.parse(savedCart);
          cartSlice.caseReducers.calculateTotals(state);
        }
      }
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  calculateTotals,
  loadCartFromStorage,
} = cartSlice.actions;

export default cartSlice.reducer;
