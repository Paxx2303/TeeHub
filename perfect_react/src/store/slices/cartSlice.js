import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../utils/constants';

// Mock cart data để test
const MOCK_CART_DATA = [
  {
    id: 'cart-item-001',
    productId: 'demo-tee-001',
    name: 'Áo thun Perfect React',
    price: 199000,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop',
    quantity: 2,
    size: 'M',
    color: 'white',
    design: null,
    customizations: {},
    addedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'cart-item-002',
    productId: 'demo-tee-002',
    name: 'Áo thun Vintage Classic',
    price: 249000,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop',
    quantity: 1,
    size: 'L',
    color: 'black',
    design: {
      type: 'text',
      content: 'VINTAGE',
      position: { x: 50, y: 50 },
      color: '#FFFFFF',
      fontSize: 24,
    },
    customizations: {
      textColor: '#FFFFFF',
      backgroundColor: 'transparent',
    },
    addedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

const getInitialCart = () => {
  if (typeof window === 'undefined') return [];
  
  const savedCart = localStorage.getItem(STORAGE_KEYS.CART);
  
  // Nếu có cart đã lưu, trả về cart đó
  if (savedCart) {
    return JSON.parse(savedCart);
  }
  
  // Nếu chưa có cart, thêm mock data và lưu vào localStorage
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(MOCK_CART_DATA));
  console.log('✅ Mock cart data đã được thêm tự động!');
  
  return MOCK_CART_DATA;
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
