<<<<<<< HEAD
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


=======
// src/routes/routeConfig.jsx
import { lazy, Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";

import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import adminRoutes from "./adminRoutes";

// ===== import Header/Footer (client) =====
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

// ===== pages (có thể lazy hoặc import trực tiếp) =====
const Home        = lazy(() => import("../pages/client/Home"));
const Login       = lazy(() => import("../pages/client/Login"));
const Products    = lazy(() => import("../pages/client/Products"));
const ProductDetail = lazy(() => import("../pages/client/Products/ProductDetail"));
const About    = lazy(() => import("../pages/client/About"))
const Cart        = lazy(() => import("../pages/client/Cart"));
const Design      = lazy(() => import("../pages/client/Design"));
const Contact     = lazy(() => import("../pages/client/Contact"));
const UserProfile = lazy(() => import("../pages/client/UserProfile"));
const AItryOn     = lazy(() => import("../pages/client/AItryOn"));

/** Layout client: bọc Header/Footer + nơi render con */
function ClientLayout() {
  const { pathname } = useLocation();
  // Nếu muốn ẩn header/footer ở trang login:
  const hideChrome = pathname === "/login";

  return (
    <div className="client-layout">
      {!hideChrome && <Header />}
      <main style={{ minHeight: "60vh" }}>
        <Outlet />
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
}

const MeLayout = () => <Outlet />;
const Forbidden = () => <div style={{ padding: 24 }}>403 — Forbidden</div>;
const NotFound  = () => <div style={{ padding: 24 }}>404 — Not Found</div>;

const routes = [
  {
    path: "/",
    element: (
      <Suspense fallback="...">
        <ClientLayout />
      </Suspense>
    ),
    children: [
      { index: true, element: <Suspense fallback="..."><Home/></Suspense> },
      { path: "home",      element: <Suspense fallback="..."><Home/></Suspense> },
      { path: "about",      element: <Suspense fallback="..."><About/></Suspense> },
      { path: "products",  element: <Suspense fallback="..."><Products/></Suspense> },
      { path: "products/:id", element: <Suspense fallback="..."><ProductDetail/></Suspense> },
      { path: "cart",      element: <Suspense fallback="..."><Cart/></Suspense> },
      { path: "design",    element: <Suspense fallback="..."><Design/></Suspense> },
      { path: "contact",   element: <Suspense fallback="..."><Contact/></Suspense> },
      { path: "ai-try-on", element: <Suspense fallback="..."><AItryOn/></Suspense> },

      // user area (cần đăng nhập)
      {
        path: "me",
        element: (
          <PrivateRoute roles={["ROLE_USER", "ROLE_ADMIN"]}>
            <MeLayout />
          </PrivateRoute>
        ),
        children: [
          { path: "profile", element: <Suspense fallback="..."><UserProfile/></Suspense> },
        ],
      },

      // login là public
      {
        path: "login",
        element: (
          <PublicRoute>
            <Suspense fallback="..."><Login/></Suspense>
          </PublicRoute>
        ),
      },

      { path: "403", element: <Forbidden/> },
      { path: "*",   element: <NotFound/> },
    ],
  },

  // admin routes (giữ nguyên file adminRoutes.jsx của bạn)
  ...adminRoutes,
];

export default routes;
>>>>>>> origin/tan
