import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types';
import '../styles/AdminDashboard.css';

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  useEffect(() => {
    // 檢查是否已登入
    if (!adminApi.isLoggedIn()) {
      navigate('/admin/login');
      return;
    }
    
    fetchUsers();
  }, [navigate]);
  
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAllUsers();
      setUsers(response as User[]);
      setError(null);
    } catch (err) {
      setError('無法載入使用者資料');
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const openAddUserForm = () => {
    setFormData({ name: '', email: '', phone: '' });
    setEditingUser(null);
    setIsFormOpen(true);
  };
  
  const openEditUserForm = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone
    });
    setEditingUser(user);
    setIsFormOpen(true);
  };
  
  const closeForm = () => {
    setIsFormOpen(false);
    setEditingUser(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingUser) {
        // 更新現有使用者
        await adminApi.updateUser(editingUser.id, formData);
      } else {
        // 添加新使用者
        await adminApi.createUser(formData);
      }
      
      closeForm();
      fetchUsers();
    } catch (err) {
      alert(editingUser ? '更新使用者失敗' : '創建使用者失敗');
      console.error('Error saving user:', err);
    }
  };
  
  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('確定要刪除此使用者嗎?')) {
      return;
    }
    
    try {
      await adminApi.deleteUser(id);
      fetchUsers();
    } catch (err) {
      alert('刪除使用者失敗');
      console.error('Error deleting user:', err);
    }
  };
  
  if (loading && users.length === 0) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>載入中...</p>
      </div>
    );
  }
  
  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="admin-title">
          <i className="fas fa-user-shield"></i>
          <h1>管理員儀表板</h1>
        </div>
        <button className="admin-logout-btn" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt"></i> 登出
        </button>
      </header>
      
      {error && (
        <div className="admin-error">
          <i className="fas fa-exclamation-triangle"></i>
          <p>{error}</p>
        </div>
      )}
      
      <div className="admin-content">
        <div className="admin-actions">
          <button className="admin-add-btn" onClick={openAddUserForm}>
            <i className="fas fa-plus"></i> 新增使用者
          </button>
        </div>
        
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>姓名</th>
                <th>電子郵件</th>
                <th>電話</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map(user => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td className="admin-actions-cell">
                      <button 
                        className="admin-edit-btn" 
                        onClick={() => openEditUserForm(user)}
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="admin-delete-btn" 
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="admin-empty-message">
                    <div>
                      <i className="fas fa-users-slash"></i>
                      <p>尚未找到使用者</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {isFormOpen && (
        <div className="admin-modal">
          <div className="admin-modal-content">
            <div className="admin-modal-header">
              <h2>{editingUser ? '編輯使用者' : '新增使用者'}</h2>
              <button className="admin-modal-close" onClick={closeForm}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="admin-form">
              <div className="admin-form-group">
                <label htmlFor="name">姓名</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="email">電子郵件</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="admin-form-group">
                <label htmlFor="phone">電話</label>
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className="admin-form-actions">
                <button type="button" className="admin-cancel-btn" onClick={closeForm}>
                  取消
                </button>
                <button type="submit" className="admin-submit-btn">
                  {editingUser ? '更新使用者' : '新增使用者'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 