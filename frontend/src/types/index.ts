// 使用者基本資料類型
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  deleted?: boolean; // 軟刪除標記
}

// 使用者詳細資料類型
export interface UserDetail extends User {
  job_title: string;
  department: string;
  location: string;
  join_date: string;
  employee_id: string;
  website: string;
  office: string;
  birthday: string;
  address: string;
}

// 管理員登入請求類型
export interface AdminLoginRequest {
  username: string;
  password: string;
}

// 管理員登入響應類型
export interface AdminLoginResponse {
  token: string;
  username: string;
}

// 連線狀態類型
export interface ConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
} 