import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import UserDetailPage from './pages/UserDetailPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { adminApi } from './services/api';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// 受保護的路由組件
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, loading } = useAuth();
  
  // 如果正在檢查登入狀態，顯示載入中
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>驗證中...</p>
      </div>
    );
  }
  
  // 如果未登入，重定向到登入頁面
  if (!isLoggedIn) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return <>{children}</>;
};

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(
    localStorage.getItem('darkMode') === 'true'
  );
  
  // 切換深色模式
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.body.classList.toggle('dark-mode', newDarkMode);
  };
  
  // 初始化深色模式
  useEffect(() => {
    // 設置深色模式
    document.body.classList.toggle('dark-mode', darkMode);
  }, [darkMode]);

  return (
    <AuthProvider>
      <div className={`app ${darkMode ? 'dark-mode' : ''}`}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user/:id" element={<UserDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>
        <footer className="footer">
          <div className="container">
            <div className="footer-text">
              &copy; {new Date().getFullYear()} Vibe Coding 測試名片系統 | 設計與開發
            </div>
            <div>
              <i className="fas fa-code"></i> 使用React和TypeScript
            </div>
            <div className="disclaimer">
              免責聲明：本專案所有資料皆為AI產生模擬的，如有雷同，純屬巧合，無商業用途。
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
};

export default App; 