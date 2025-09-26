// src/components/AccountPage/AccountPage.jsx
import React, { useState } from 'react';
import Header from '../common/Header';
import Sidebar from './Sidebar';
import ProfileTab from './ProfileTab';
import OrdersTab from './OrdersTab';
import FavoritesTab from './FavoritesTab';
import SettingsTab from './SettingsTab';
import { useUserData } from '../../hooks/useUserData';

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const { userInfo, orders, favorites } = useUserData();

  const renderContent = () => {
    switch(activeTab) {
      case 'profile': 
        return <ProfileTab userInfo={userInfo} />;
      case 'orders': 
        return <OrdersTab orders={orders} />;
      case 'favorites': 
        return <FavoritesTab favorites={favorites} />;
      case 'settings': 
        return <SettingsTab />;
      default: 
        return <ProfileTab userInfo={userInfo} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header userInfo={userInfo} />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;