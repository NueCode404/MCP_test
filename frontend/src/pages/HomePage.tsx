import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userApi } from '../services/api';
import useConnectionStatus from '../hooks/useConnectionStatus';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isConnected, isConnecting, connect, disconnect } = useConnectionStatus();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!isConnected) {
          setLoading(false);
          setError('後端服務未連線，請點擊連線按鈕');
          return;
        }

        const data = await userApi.getAllUsers();
        setUsers(data);
        setLoading(false);
        setError(null);
      } catch (err) {
        setError('無法載入使用者資料');
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isConnected]);

  const handleConnectionToggle = async () => {
    if (!isConnected) {
      // 顯示提醒視窗
      alert('後端連線因採用免費伺服器需要冷重啟約50秒，請耐心等待...');
      
      // 嘗試連接後端
      const success = await connect();
      if (success) {
        setLoading(true);
      } else {
        alert('無法連接到後端服務，請稍後再試');
      }
    } else {
      disconnect();
      setError('後端服務已斷開連線');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>載入中...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Vibe Coding 測試名片系統</h1>
        <p>探索我們的用戶檔案，點擊名片查看詳細資訊</p>
        
        <div className="actions-container">
          <button 
            className={`connection-btn ${isConnected ? 'connected' : 'disconnected'}`}
            onClick={handleConnectionToggle}
            disabled={isConnecting}
          >
            {isConnecting ? '連線中...' : isConnected ? '中斷連線' : '連線至伺服器'}
          </button>
          
          <Link 
            to="#" 
            onClick={(e) => {
              e.preventDefault();
              navigate(isLoggedIn ? '/admin/dashboard' : '/admin/login');
            }} 
            className="admin-link"
          >
            <i className="fas fa-lock"></i> {isLoggedIn ? '管理員儀表板' : '管理員登入'}
          </Link>
        </div>
      </div>

      {error ? (
        <div className="error-container">
          <div className="error-icon">
            <i className="fas fa-exclamation-circle"></i>
          </div>
          <h3>出錯了</h3>
          <p>{error}</p>
        </div>
      ) : users.length > 0 ? (
        <div className="card-grid">
          {users.map((user) => (
            <div className="card" key={user.id}>
              <div className="card-img">
                <div className="initial">
                  {user.name.charAt(0)}
                </div>
              </div>
              <div className="card-body">
                <h2 className="card-title">{user.name}</h2>
                <div className="card-text">
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-envelope"></i>
                    </div>
                    <div className="info-text">{user.email}</div>
                  </div>
                  <div className="info-item">
                    <div className="info-icon">
                      <i className="fas fa-phone"></i>
                    </div>
                    <div className="info-text">{user.phone}</div>
                  </div>
                </div>
                <Link to={`/user/${user.id}`} className="card-link">查看資料</Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-users-slash"></i>
          </div>
          <h3>尚未找到用戶</h3>
          <p>目前資料庫中沒有用戶資料或未連接後端。</p>
        </div>
      )}
    </div>
  );
};

export default HomePage; 