// Central route configuration
// Each route can define: path, element, layout, guard, roles, children, public

import Home from '../pages/client/Home';
import Products from '../pages/client/Products';
import { ProductDetail } from '../pages/client/Products/index.detail';
import AITryOn from '../pages/client/AITryOn';
import Design from '../pages/client/Design';
import About from '../pages/client/About';
import AuthPage from '../pages/client/Login/AuthPage';
import CartCheckout from '../pages/client/Cart';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Orders from '../pages/admin/Orders';
import ProductsAdmin from '../pages/admin/Products';
import Users from '../pages/admin/Users';
import { Navigate } from 'react-router-dom';
import UserProfile from '../pages/client/UserProfile/UserProfile';
import Contact from '../pages/client/Contact';

export const routes = [
  { path: '/', element: <Home />, public: true },
  { path: '/products', element: <Products />, public: true },
  { path: '/products/:id', element: <ProductDetail />, public: true },
  { path: '/ai-try-on', element: <AITryOn />, public: true },
  { path: '/design', element: <Design />, public: true },
  { path: '/about', element: <About />, public: true },
  { path: '/cart', element: <CartCheckout />, public: true },
  { path: '/login', element: <AuthPage />, public: true },
  { path: '/user-profile', element: <UserProfile />, public: true },
  { path: '/contact', element: <Contact />, public: true },

  // Các route admin
  { path: '/admin/dashboard', element: <AdminLayout><Dashboard /></AdminLayout>, public: true },
  { path: '/admin/orders', element: <AdminLayout><Orders /></AdminLayout>, public: true },
  { path: '/admin/products', element: <AdminLayout><ProductsAdmin /></AdminLayout>, public: true },
  { path: '/admin/users', element: <AdminLayout><Users /></AdminLayout>, public: true },

  // Redirect /admin về /admin/dashboard (ĐẶT CUỐI CÙNG VÀ CHỈ CÓ 1 DÒNG)
  { path: '/admin', element: <Navigate to="/admin/dashboard" replace />, public: true },
];

export default routes;


