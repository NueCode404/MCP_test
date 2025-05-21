const mysql = require('mysql2/promise');
require('dotenv').config();

// 創建連接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4'
});

// 測試資料庫連接
pool.getConnection()
  .then(connection => {
    console.log('資料庫連接成功');
    connection.release();
  })
  .catch(err => {
    console.error('無法連接到資料庫:', err);
  });

module.exports = pool; 