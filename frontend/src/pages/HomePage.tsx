import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { User } from '../types';
import '../styles/HomePage.css';

const HomePage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await userApi.getAllUsers();
        setUsers(data);
        setLoading(false);
      } catch (err) {
        setError('無法載入使用者資料');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>載入中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h3>出錯了</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>台灣用戶名片</h1>
        <p>探索我們的用戶檔案，點擊名片查看詳細資訊</p>
      </div>

      {users.length > 0 ? (
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
          <p>目前資料庫中沒有用戶資料。</p>
        </div>
      )}
    </div>
  );
};

export default HomePage; 