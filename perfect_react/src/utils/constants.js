// API Endpoints
export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  AI_TRY_ON: '/api/ai/try-on',
  DESIGN: '/api/design',
  CART: '/api/cart',
  ORDERS: '/api/orders',
  USERS: '/api/users',
  UPLOAD: '/api/upload'
};

// Product Categories
export const PRODUCT_CATEGORIES = {
  T_SHIRT: 't-shirt',
  HOODIE: 'hoodie',
  TANK_TOP: 'tank-top',
  LONG_SLEEVE: 'long-sleeve'
};

// Product Sizes
export const PRODUCT_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Product Colors
export const PRODUCT_COLORS = {
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  RED: '#FF0000',
  BLUE: '#0000FF',
  GREEN: '#00FF00',
  YELLOW: '#FFFF00',
  PINK: '#FFC0CB',
  PURPLE: '#800080',
  ORANGE: '#FFA500',
  GRAY: '#808080'
};

// AI Try-On Status
export const AI_TRY_ON_STATUS = {
  IDLE: 'idle',
  UPLOADING: 'uploading',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error'
};

// Design Tools
export const DESIGN_TOOLS = {
  TEXT: 'text',
  IMAGE: 'image',
  SHAPE: 'shape',
  BRUSH: 'brush'
};

// Routes
export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  AI_TRY_ON: '/ai-try-on',
  DESIGN: '/design',
  CART: '/cart',
  CHECKOUT: '/checkout',
  ABOUT: '/about',
  CONTACT: '/contact'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  CART: 'tshirt_store_cart',
  USER: 'tshirt_store_user',
  THEME: 'tshirt_store_theme'
};
