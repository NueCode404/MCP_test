require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const db = require('./config/db');

// 建立 Express 應用程式
const app = express();
const PORT = process.env.PORT || 5000;

// 中間件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/users', userRoutes);

// 基本路由
app.get('/', (req, res) => {
  res.send('台灣用戶名片系統 API 運行中');
});

// 啟動服務器
app.listen(PORT, () => {
  console.log(`伺服器執行於 http://localhost:${PORT}`);
}); 