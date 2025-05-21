import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userApi } from '../services/api';
import { UserDetail } from '../types';
import '../styles/UserDetailPage.css';

const UserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        if (id) {
          const data = await userApi.getUserById(parseInt(id));
          setUser(data as UserDetail);
        }
        setLoading(false);
      } catch (err) {
        setError('無法載入使用者詳細資料');
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>載入中...</p>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="error-container">
        <div className="error-icon">
          <i className="fas fa-exclamation-circle"></i>
        </div>
        <h3>出錯了</h3>
        <p>{error || '找不到使用者資料'}</p>
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i>
          返回首頁
        </Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            {user.name.charAt(0)}
          </div>
          <h1 className="profile-name">{user.name}</h1>
          <p>{user.job_title} | {user.department}</p>
        </div>
        
        <div className="profile-body">
          {/* 聯絡資訊 */}
          <div className="profile-section">
            <h2 className="profile-section-title">聯絡資訊</h2>
            <div className="profile-info">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">電子郵件</div>
                  <div className="profile-info-text">{user.email}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">手機</div>
                  <div className="profile-info-text">{user.phone}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-building"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">辦公室</div>
                  <div className="profile-info-text">{user.office}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">個人網站</div>
                  <div className="profile-info-text">{user.website}</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 個人資訊 */}
          <div className="profile-section">
            <h2 className="profile-section-title">個人資訊</h2>
            <div className="profile-info">
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-briefcase"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">職位</div>
                  <div className="profile-info-text">{user.job_title}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-users"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">部門</div>
                  <div className="profile-info-text">{user.department}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-id-badge"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">員工編號</div>
                  <div className="profile-info-text">{user.employee_id}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">到職日期</div>
                  <div className="profile-info-text">{user.join_date}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-birthday-cake"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">生日</div>
                  <div className="profile-info-text">{user.birthday}</div>
                </div>
              </div>
              
              <div className="profile-info-item">
                <div className="profile-info-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="profile-info-content">
                  <div className="profile-info-label">地址</div>
                  <div className="profile-info-text">{user.address}</div>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/" className="back-btn">
            <i className="fas fa-arrow-left"></i>
            返回首頁
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage; 