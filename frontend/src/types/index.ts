// 使用者基本資料類型
export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
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