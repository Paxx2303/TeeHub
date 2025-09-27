// Central route configuration
// Each route can define: path, element, layout, guard, roles, children, public

import Home from '../pages/client/Home';
import Products from '../pages/client/Products';
import { ProductDetail } from '../pages/client/Products/index.detail';
import AITryOn from '../pages/client/AITryOn';
import Design from '../pages/client/Design';
import AuthPage from '../pages/client/Login/AuthPage';
import CartCheckout from '../pages/client/Cart';

export const routes = [
  { path: '/', element: <Home />, public: true },
  { path: '/products', element: <Products />, public: true },
  { path: '/products/:id', element: <ProductDetail />, public: true },
  { path: '/ai-try-on', element: <AITryOn />, public: true },
  { path: '/design', element: <Design />, public: true },
  { path: '/cart', element: <CartCheckout />, public: true },
  { path: '/login', element: <AuthPage />, public: true },
];

export default routes;


