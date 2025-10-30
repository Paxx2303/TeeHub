// src/routes/adminRoutes.jsx
import { lazy, Suspense } from "react";
import PrivateRoute from "./PrivateRoute";
import AdminLayout from "../components/admin/AdminLayout"; // dùng layout thực tế của bạn

const AdminDashboard = lazy(() => import("../pages/admin/Dashboard"));
const AdminOrders    = lazy(() => import("../pages/admin/Orders"));
const AdminProducts  = lazy(() => import("../pages/admin/Products"));
const AdminUsers     = lazy(() => import("../pages/admin/Users"));

export default [
  {
    path: "/admin",
    element: (
      <PrivateRoute roles={["ROLE_ADMIN"]}>
        <Suspense fallback="...">
          <AdminLayout />   {/* BÊN TRONG AdminLayout.jsx phải có <Outlet /> */}
        </Suspense>
      </PrivateRoute>
    ),
    children: [
      { index: true,        element: <Suspense fallback="..."><AdminDashboard/></Suspense> },
      { path: "dashboard",  element: <Suspense fallback="..."><AdminDashboard/></Suspense> },
      { path: "orders",     element: <Suspense fallback="..."><AdminOrders/></Suspense> },
      { path: "products",   element: <Suspense fallback="..."><AdminProducts/></Suspense> },
      { path: "users",      element: <Suspense fallback="..."><AdminUsers/></Suspense> },
    ],
  },
];
