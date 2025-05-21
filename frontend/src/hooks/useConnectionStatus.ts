import { useState, useEffect, useCallback } from 'react';
import connectionManager from '../services/ConnectionManager';

interface ConnectionStatusHook {
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<boolean>;
  disconnect: () => void;
}

export const useConnectionStatus = (): ConnectionStatusHook => {
  const [isConnected, setIsConnected] = useState<boolean>(connectionManager.isConnected());
  const [isConnecting, setIsConnecting] = useState<boolean>(false);

  // 連接監聽器
  useEffect(() => {
    // 定義狀態變化監聽器
    const handleStatusChange = (status: boolean) => {
      setIsConnected(status);
    };

    // 添加監聽器
    connectionManager.addListener(handleStatusChange);

    // 初始同步狀態
    setIsConnected(connectionManager.isConnected());

    // 清理函數：移除監聽器
    return () => {
      connectionManager.removeListener(handleStatusChange);
    };
  }, []);

  // 連接函數
  const connect = useCallback(async (): Promise<boolean> => {
    if (isConnecting) return false;
    
    setIsConnecting(true);
    try {
      const result = await connectionManager.connect();
      return result;
    } catch (error) {
      console.error('連接錯誤:', error);
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  // 斷開連接函數
  const disconnect = useCallback(() => {
    connectionManager.disconnect();
  }, []);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect
  };
};

export default useConnectionStatus; 