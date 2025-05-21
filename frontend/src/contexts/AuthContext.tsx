import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { adminApi } from '../services/api';

// 身份驗證狀態類型
interface AuthContextType {
  isLoggedIn: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

// 創建上下文
const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  loading: true,
  login: async () => false,
  logout: () => {},
  checkAuthStatus: async () => false
});

// Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Provider組件
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // 登入函數
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      await adminApi.login(username, password);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.error('登入失敗:', error);
      return false;
    }
  };

  // 登出函數
  const logout = (): void => {
    adminApi.logout();
    setIsLoggedIn(false);
  };

  // 檢查身份驗證狀態
  const checkAuthStatus = async (): Promise<boolean> => {
    setLoading(true);
    try {
      if (adminApi.isLoggedIn()) {
        const isValid = await adminApi.validateToken();
        setIsLoggedIn(isValid);
        return isValid;
      } else {
        setIsLoggedIn(false);
        return false;
      }
    } catch (error) {
      console.error('檢查身份驗證狀態失敗:', error);
      setIsLoggedIn(false);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // 組件掛載時檢查身份驗證狀態
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // 提供上下文值
  const contextValue: AuthContextType = {
    isLoggedIn,
    loading,
    login,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 自定義Hook用於使用身份驗證狀態
export const useAuth = () => useContext(AuthContext);

export default AuthContext; 