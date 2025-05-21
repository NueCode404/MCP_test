import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { User, UserDetail } from '../types';

// 設定API基礎URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// API響應錯誤類
class ApiError extends Error {
  public status: number;
  public data: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

// API代理類 - 代理模式實現
class ApiProxy {
  private api: AxiosInstance;
  private isConnected: boolean;

  constructor() {
    // 創建axios實例
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 從localStorage初始化連線狀態
    this.isConnected = localStorage.getItem('api_connection_status') === 'true';

    // 設置請求攔截器
    this.setupInterceptors();
  }

  private setupInterceptors() {
    this.api.interceptors.request.use(
      (config) => {
        // 如果未連線並且不是健康檢查請求，則中止請求
        if (!this.isConnected && !config.url?.includes('/health')) {
          return Promise.reject(new Error('後端服務未連線'));
        }
        
        // 檢查並添加授權令牌
        const token = localStorage.getItem('admin_token');
        if (token && config.headers) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 添加響應攔截器處理錯誤
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          // 伺服器回傳了錯誤響應
          const errorMessage = (() => {
            try {
              const data = error.response.data as any;
              return data && typeof data === 'object' && 'message' in data
                ? data.message
                : '伺服器錯誤';
            } catch {
              return '伺服器錯誤';
            }
          })();
          
          throw new ApiError(
            errorMessage,
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // 請求已發送但未收到響應
          throw new ApiError('無法連接到伺服器', 0);
        } else {
          // 設置請求時發生錯誤
          throw new ApiError(error.message, 0);
        }
      }
    );
  }

  // 獲取連線狀態
  public getConnectionStatus(): boolean {
    return this.isConnected;
  }

  // 設置連線狀態
  public setConnectionStatus(status: boolean): void {
    this.isConnected = status;
    // 將狀態保存到localStorage
    localStorage.setItem('api_connection_status', status.toString());
  }

  // 執行API請求的代理方法
  public async request<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.api(config);
      return response.data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // 健康檢查方法，可繞過連線狀態檢查
  public async checkHealth(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_URL}/health`, { timeout: 5000 });
      const isConnected = response.status === 200;
      this.setConnectionStatus(isConnected);
      return isConnected;
    } catch (error) {
      this.setConnectionStatus(false);
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // 驗證管理員Token
  public async validateAdminToken(): Promise<boolean> {
    try {
      await this.request<{ valid: boolean }>({ method: 'GET', url: '/admin/verify-token' });
      return true;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  }
}

// 創建全局API代理實例
const apiProxy = new ApiProxy();

// 使用者相關API
export const userApi = {
  // 獲取所有使用者
  getAllUsers: async (): Promise<User[]> => {
    return apiProxy.request<User[]>({ method: 'GET', url: '/users' });
  },
  
  // 根據ID獲取使用者詳細資料
  getUserById: async (id: number): Promise<UserDetail> => {
    return apiProxy.request<UserDetail>({ method: 'GET', url: `/users/${id}` });
  }
};

// 連線管理API
export const connectionApi = {
  // 檢查後端健康狀態
  checkHealth: async (): Promise<boolean> => {
    return apiProxy.checkHealth();
  },
  
  // 獲取連線狀態
  getStatus: (): boolean => {
    return apiProxy.getConnectionStatus();
  },
  
  // 設置連線狀態
  setStatus: (status: boolean): boolean => {
    apiProxy.setConnectionStatus(status);
    return status;
  }
};

// 管理員API
export const adminApi = {
  // 管理員登入
  login: async (username: string, password: string): Promise<{token: string; username: string}> => {
    const data = await apiProxy.request<{token: string; username: string}>({
      method: 'POST',
      url: '/admin/login',
      data: { username, password }
    });
    
    if (data.token) {
      localStorage.setItem('admin_token', data.token);
    }
    return data;
  },
  
  // 登出
  logout: (): void => {
    localStorage.removeItem('admin_token');
  },
  
  // 檢查是否已登入
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('admin_token');
  },
  
  // 驗證 Token 是否有效
  validateToken: async (): Promise<boolean> => {
    return apiProxy.validateAdminToken();
  },
  
  // 獲取所有使用者 (管理員用)
  getAllUsers: async (): Promise<User[]> => {
    return apiProxy.request<User[]>({ method: 'GET', url: '/admin/users' });
  },
  
  // 創建使用者
  createUser: async (userData: Omit<User, 'id'>): Promise<User> => {
    return apiProxy.request<User>({
      method: 'POST',
      url: '/admin/users',
      data: userData
    });
  },
  
  // 更新使用者
  updateUser: async (id: number, userData: Partial<User>): Promise<User> => {
    return apiProxy.request<User>({
      method: 'PUT',
      url: `/admin/users/${id}`,
      data: userData
    });
  },
  
  // 刪除使用者
  deleteUser: async (id: number): Promise<{success: boolean}> => {
    return apiProxy.request<{success: boolean}>({
      method: 'DELETE',
      url: `/admin/users/${id}`
    });
  }
};

// 導出API代理實例和連線狀態
export { apiProxy };
export default apiProxy; 