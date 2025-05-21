import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../styles/AdminLogin.css';

const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isLoggedIn, login } = useAuth();

  // 如果已登入，重定向到儀表板
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('請輸入用戶名和密碼');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      const success = await login(username, password);
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('登入失敗，請檢查您的憑證');
      }
    } catch (err) {
      setError('登入失敗，請檢查您的憑證');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <i className="fas fa-lock"></i>
          <h1>管理員登入</h1>
          <p>請輸入您的管理員憑證以繼續</p>
        </div>
        
        {error && (
          <div className="admin-login-error">
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="username">用戶名</label>
            <div className="input-wrapper">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密碼</label>
            <div className="input-wrapper">
              <i className="fas fa-key"></i>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="同上"
                disabled={loading}
              />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="admin-login-button"
            disabled={loading}
          >
            {loading ? '登入中...' : '登入'}
          </button>
        </form>
        
        <div className="admin-login-footer">
          <Link to="/" className="back-link">
            <i className="fas fa-arrow-left"></i> 返回主頁
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage; 