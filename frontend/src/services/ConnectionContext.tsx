import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { connectionApi } from './api';

// 連接狀態類型
interface ConnectionContextType {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

// 創建Context
const ConnectionContext = createContext<ConnectionContextType>({
  isConnected: false,
  isConnecting: false,
  connect: async () => false,
  disconnect: () => {},
});

// Provider Props
interface ConnectionProviderProps {
  children: ReactNode;
  autoConnect?: boolean;
}

// Provider組件
export const ConnectionProvider: React.FC<ConnectionProviderProps> = ({ 
  children, 
  autoConnect = true 
}) => {
  const [isConnected, setIsConnected] = useState<boolean>(
    // 從localStorage初始化連接狀態
    localStorage.getItem('api_connection_status') === 'true'
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // 連接後端
  const connect = async (): Promise<boolean> => {
    setIsConnecting(true);
    try {
      const success = await connectionApi.checkHealth();
      setIsConnected(success);
      localStorage.setItem('api_connection_status', success.toString());
      return success;
    } catch (error) {
      console.error('連接後端失敗:', error);
      setIsConnected(false);
      localStorage.setItem('api_connection_status', 'false');
      return false;
    } finally {
      setIsConnecting(false);
    }
  };

  // 斷開連接
  const disconnect = () => {
    setIsConnected(false);
    connectionApi.setStatus(false);
    localStorage.setItem('api_connection_status', 'false');
  };

  // 初始化時自動連接
  useEffect(() => {
    // 同步內部狀態與API狀態
    connectionApi.setStatus(isConnected);
    
    // 如果設置了自動連接且尚未連接，則自動嘗試連接
    if (autoConnect && !isConnected) {
      connect();
    }
  }, [autoConnect, isConnected]);

  // 提供Context值
  const contextValue: ConnectionContextType = {
    isConnected,
    isConnecting,
    connect,
    disconnect,
  };

  return (
    <ConnectionContext.Provider value={contextValue}>
      {children}
    </ConnectionContext.Provider>
  );
};

// 自定義Hook用於使用連接狀態
export const useConnection = () => useContext(ConnectionContext);

export default ConnectionContext; 