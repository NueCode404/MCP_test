import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';

const AdminEntryLink: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(adminApi.isLoggedIn());
  const navigate = useNavigate();

  // 檢查登入狀態
  useEffect(() => {
    const checkLoginStatus = async () => {
      if (adminApi.isLoggedIn()) {
        try {
          const isValid = await adminApi.validateToken();
          setIsLoggedIn(isValid);
        } catch (error) {
          setIsLoggedIn(false);
          adminApi.logout(); // 清除無效token
        }
      } else {
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // 處理點擊事件
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isLoggedIn) {
      navigate('/admin/dashboard');
    } else {
      navigate('/admin/login');
    }
  };

  return (
    <Link to="#" onClick={handleClick} className="admin-link">
      <i className="fas fa-lock"></i> {isLoggedIn ? '管理員儀表板' : '管理員入口'}
    </Link>
  );
};

export default AdminEntryLink; 