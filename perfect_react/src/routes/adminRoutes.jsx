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


