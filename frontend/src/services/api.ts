import axios from 'axios';

// 設定API基礎URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// 創建axios實例
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 使用者相關API
export const userApi = {
  // 獲取所有使用者
  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },
  
  // 根據ID獲取使用者詳細資料
  getUserById: async (id: number) => {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with id ${id}:`, error);
      throw error;
    }
  }
};

export default api; 