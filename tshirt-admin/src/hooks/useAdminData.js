// src/hooks/useAdminData.js
import { useState, useEffect } from 'react';
import { adminMockData } from '@data/adminMockData';

export const useAdminData = () => {
  const [data, setData] = useState({
    stats: {},
    recentOrders: [],
    topProducts: [],
    products: [],
    users: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulate API call
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setData(adminMockData);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const refreshData = async () => {
    await fetchData();
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setData(prevData => ({
      ...prevData,
      recentOrders: prevData.recentOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    }));
  };

  const deleteOrder = (orderId) => {
    setData(prevData => ({
      ...prevData,
      recentOrders: prevData.recentOrders.filter(order => order.id !== orderId)
    }));
  };

  const updateProduct = (productId, updatedProduct) => {
    setData(prevData => ({
      ...prevData,
      products: prevData.products.map(product => 
        product.id === productId ? { ...product, ...updatedProduct } : product
      )
    }));
  };

  const deleteProduct = (productId) => {
    setData(prevData => ({
      ...prevData,
      products: prevData.products.filter(product => product.id !== productId)
    }));
  };

  const updateUser = (userId, updatedUser) => {
    setData(prevData => ({
      ...prevData,
      users: prevData.users.map(user => 
        user.id === userId ? { ...user, ...updatedUser } : user
      )
    }));
  };

  return {
    ...data,
    loading,
    error,
    refreshData,
    updateOrderStatus,
    deleteOrder,
    updateProduct,
    deleteProduct,
    updateUser
  };
};