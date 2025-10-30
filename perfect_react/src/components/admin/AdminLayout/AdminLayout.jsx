<<<<<<< HEAD
import React, { useState } from 'react';
import AdminHeader from '../AdminHeader';
import AdminSidebar from '../AdminSidebar';
import styles from './AdminLayout.module.css';

const AdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={styles.adminLayout}>
      {/* Sidebar */}
      <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <AdminSidebar />
      </div>

      {/* Main content area */}
      <div className={styles.mainContent}>
        {/* Header */}
        <AdminHeader onToggleSidebar={toggleSidebar} />

        {/* Page content */}
        <main className={styles.pageContent}>
          <div className={styles.contentWrapper}>
            {children}
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className={styles.mobileOverlay}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

=======
// AdminLayout.jsx
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import styles from "./AdminLayout.module.css";

export default function AdminLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(v => !v);

  return (
    <div className={styles.adminLayout}>
      <div className={`${styles.sidebarWrapper} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <AdminSidebar />
      </div>
      <div className={styles.mainContent}>
        <AdminHeader onToggleSidebar={toggleSidebar} />
        <main className={styles.pageContent}>
          <div className={styles.contentWrapper}>
            {/* QUAN TRỌNG: nơi render các route con */}
            <Outlet />
          </div>
        </main>
      </div>
      {isSidebarOpen && <div className={styles.mobileOverlay} onClick={() => setIsSidebarOpen(false)} />}
    </div>
  );
}
>>>>>>> origin/tan
