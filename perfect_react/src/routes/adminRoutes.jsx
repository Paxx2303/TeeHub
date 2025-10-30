<<<<<<< HEAD
import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import Orders from '../pages/admin/Orders';
import Products from '../pages/admin/Products';
import Users from '../pages/admin/Users';

export const adminRoutes = [
    {
        path: '/admin',
        element: (
            <AdminLayout>
                <Dashboard />
            </AdminLayout>
        ),
        // public: false,
        // roles: ['admin']
    },
    {
        path: '/admin/dashboard',
        element: (
            <AdminLayout>
                <Dashboard />
            </AdminLayout>
        ),
        // public: false,
        // roles: ['admin']
    },
    {
        path: '/admin/orders',
        element: (
            <AdminLayout>
                <Orders />
            </AdminLayout>
        ),
        // public: false,
        // roles: ['admin']
    },
    {
        path: '/admin/products',
        element: (
            <AdminLayout>
                <Products />
            </AdminLayout>
        ),
        // public: false,
        // roles: ['admin']
    },
    {
        path: '/admin/users',
        element: (
            <AdminLayout>
                <Users />
            </AdminLayout>
        ),
        // public: false,
        // roles: ['admin']
    }
];

export default adminRoutes;


=======
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
>>>>>>> origin/tan
