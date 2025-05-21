import { connectionApi } from './api';

// 重連配置類型
interface ReconnectConfig {
  maxAttempts: number;
  initialDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

// 默認重連配置
const DEFAULT_RECONNECT_CONFIG: ReconnectConfig = {
  maxAttempts: 3,
  initialDelay: 2000, // 2秒
  maxDelay: 30000,    // 30秒
  backoffFactor: 1.5  // 每次延遲增加的倍數
};

// 連接管理器類
class ConnectionManager {
  private isConnecting: boolean = false;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts: number = 0;
  private config: ReconnectConfig;
  private listeners: Array<(isConnected: boolean) => void> = [];

  constructor(config: Partial<ReconnectConfig> = {}) {
    // 合併默認配置與用戶配置
    this.config = { ...DEFAULT_RECONNECT_CONFIG, ...config };
    
    // 從 localStorage 初始化連接狀態
    const isConnected = localStorage.getItem('api_connection_status') === 'true';
    connectionApi.setStatus(isConnected);
  }

  // 查詢連接狀態
  public isConnected(): boolean {
    return connectionApi.getStatus();
  }

  // 添加連接狀態變更的監聽器
  public addListener(listener: (isConnected: boolean) => void): void {
    this.listeners.push(listener);
  }

  // 移除監聽器
  public removeListener(listener: (isConnected: boolean) => void): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  // 通知所有監聽器
  private notifyListeners(isConnected: boolean): void {
    this.listeners.forEach(listener => listener(isConnected));
  }

  // 連接到後端
  public async connect(): Promise<boolean> {
    // 如果已在連接中，返回
    if (this.isConnecting) {
      return false;
    }

    this.isConnecting = true;
    this.reconnectAttempts = 0;

    try {
      const isConnected = await connectionApi.checkHealth();
      localStorage.setItem('api_connection_status', isConnected.toString());
      this.notifyListeners(isConnected);
      return isConnected;
    } catch (error) {
      console.error('連接失敗:', error);
      return false;
    } finally {
      this.isConnecting = false;
    }
  }

  // 斷開連接
  public disconnect(): void {
    connectionApi.setStatus(false);
    localStorage.setItem('api_connection_status', 'false');
    this.stopReconnect();
    this.notifyListeners(false);
  }

  // 啟動自動重連
  public startAutoReconnect(): void {
    this.reconnectAttempts = 0;
    this.attemptReconnect();
  }

  // 停止重連
  public stopReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  // 嘗試重連
  private attemptReconnect(): void {
    if (this.isConnected() || this.isConnecting) {
      this.stopReconnect();
      return;
    }

    // 如果已超過最大嘗試次數，停止重連
    if (this.reconnectAttempts >= this.config.maxAttempts) {
      console.log(`已達到最大重連嘗試次數 (${this.config.maxAttempts})，中止重連`);
      this.stopReconnect();
      return;
    }

    // 計算延遲時間 (使用指數退避算法)
    const delay = Math.min(
      this.config.initialDelay * Math.pow(this.config.backoffFactor, this.reconnectAttempts),
      this.config.maxDelay
    );

    console.log(`嘗試第 ${this.reconnectAttempts + 1} 次重連，延遲 ${delay}ms`);

    // 設定重連定時器
    this.reconnectTimer = setTimeout(async () => {
      this.reconnectAttempts++;
      
      try {
        const isConnected = await this.connect();
        if (isConnected) {
          console.log('重連成功');
          this.stopReconnect();
        } else {
          console.log('重連失敗，繼續嘗試');
          this.attemptReconnect();
        }
      } catch (error) {
        console.error('重連過程中出錯:', error);
        this.attemptReconnect();
      }
    }, delay);
  }

  // 初始化自動連接
  public async initialize(autoConnect: boolean = true): Promise<void> {
    if (autoConnect) {
      try {
        const isConnected = await this.connect();
        if (!isConnected) {
          this.startAutoReconnect();
        }
      } catch (error) {
        console.error('初始連接失敗:', error);
        this.startAutoReconnect();
      }
    }
  }
}

// 創建單例實例
const connectionManager = new ConnectionManager();

export default connectionManager; 