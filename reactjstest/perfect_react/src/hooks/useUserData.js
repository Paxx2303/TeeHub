// src/hooks/useUserData.js
import { useState, useEffect } from 'react';
import { userData, ordersData, favoritesData } from '../data/mockData';

export const useUserData = () => {
  const [userInfo, setUserInfo] = useState(userData);
  const [orders, setOrders] = useState(ordersData);
  const [favorites, setFavorites] = useState(favoritesData);
  const [loading, setLoading] = useState(false);

  // Simulate API call
  useEffect(() => {
    setLoading(true);
    // Giả lập gọi API
    setTimeout(() => {
      setUserInfo(userData);
      setOrders(ordersData);
      setFavorites(favoritesData);
      setLoading(false);
    }, 1000);
  }, []);

  const updateUserInfo = (newUserInfo) => {
    setUserInfo(newUserInfo);
    // Gọi API cập nhật thông tin user
    console.log('Updating user info:', newUserInfo);
  };

  const removeFromFavorites = (productId) => {
    setFavorites(prev => prev.filter(item => item.id !== productId));
    // Gọi API xóa khỏi danh sách yêu thích
    console.log('Removing from favorites:', productId);
  };

  const addToFavorites = (product) => {
    setFavorites(prev => [...prev, product]);
    // Gọi API thêm vào danh sách yêu thích
    console.log('Adding to favorites:', product);
  };

  return {
    userInfo,
    orders,
    favorites,
    loading,
    updateUserInfo,
    removeFromFavorites,
    addToFavorites
  };
};