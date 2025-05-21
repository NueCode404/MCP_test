require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const db = require('./config/db');

// 建立 Express 應用程式
const app = express();
const PORT = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 健康檢查端點
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 路由
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// 基本路由
app.get('/', (req, res) => {
  res.send('Vibe Coding 測試名片系統 API 運行中');
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`伺服器執行於 http://localhost:${PORT}`);
}); 