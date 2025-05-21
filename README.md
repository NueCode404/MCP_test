# Vibe Coding 測試

玩玩Vibe Coding，全程自然語言編寫，使用cursor，目前使用到的MCP有MYSQL及FileSystems，除了直接把env寫再code當中以外，挺酷的，除了這兩行以外的內容都由AI產生，無商業用途。

一個現代化的用戶名片管理系統，採用前後端分離架構設計。

## 專案架構

```
.
├── backend/                # 後端 Express.js API
│   ├── src/
│   │   ├── config/         # 配置文件
│   │   ├── controllers/    # 控制器
│   │   ├── models/         # 數據模型
│   │   ├── routes/         # 路由定義
│   │   └── index.js        # 主入口
│   ├── .env.example        # 環境變數範例
│   └── package.json        # 後端依賴
│
├── frontend/               # 前端 React 應用
│   ├── public/             # 靜態資源
│   ├── src/
│   │   ├── components/     # 可重用組件
│   │   ├── pages/          # 頁面組件
│   │   ├── services/       # API 服務
│   │   ├── styles/         # CSS 樣式
│   │   ├── types/          # TypeScript 類型定義
│   │   ├── App.tsx         # 主應用組件
│   │   └── index.tsx       # 入口文件
│   ├── .env.example        # 環境變數範例
│   └── package.json        # 前端依賴
│
└── README.md               # 專案說明
```

## 技術棧

### 後端
- Node.js + Express.js
- MySQL 資料庫
- RESTful API 設計

### 前端
- React + TypeScript
- React Router
- Axios 用於 API 請求
- 自定義 CSS 樣式

## 部署指南

### 後端部署 (Render)
1. 註冊 Render 帳號
2. 創建新的 Web Service
3. 連接 GitHub 倉庫
4. 設定構建命令: `cd backend && npm install`
5. 設定啟動命令: `cd backend && npm start`
6. 添加環境變數 (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)

### 前端部署 (Vercel)
1. 註冊 Vercel 帳號
2. 導入 GitHub 倉庫
3. 設定構建命令: `cd frontend && npm install && npm run build`
4. 設定輸出目錄: `frontend/build`
5. 添加環境變數 (REACT_APP_API_URL)

## 本地開發

### 後端
```bash
cd backend
npm install
# 創建 .env 文件並設定資料庫連接
npm run dev
```

### 前端
```bash
cd frontend
npm install
# 創建 .env 文件並設定 API URL
npm start
```

## 授權
本專案採用 MIT 授權條款 

## 免責聲明
本專案所有資料皆為AI產生模擬的，如有雷同，純屬巧合，無商業用途。 