const mysql = require('mysql2/promise');
require('dotenv').config();

// 根據環境配置SSL選項
let sslConfig = {};

// 在生產環境中使用SSL連接
if (process.env.NODE_ENV === 'production') {
  // 從環境變數中讀取CA證書
  if (process.env.DB_CA_CERT) {
    // 處理可能的編碼問題，確保證書格式正確
    let caCert = process.env.DB_CA_CERT;
    
    // 如果環境變數中的換行被替換成了 \n 字符串，需要轉換回實際的換行符
    if (!caCert.includes('-----BEGIN CERTIFICATE-----')) {
      caCert = caCert.replace(/\\n/g, '\n');
    }
    
    sslConfig = {
      ssl: {
        ca: caCert,
        rejectUnauthorized: true
      }
    };
    
    // 確認CA證書格式
    console.log('CA certificate loaded successfully.');
  } else {
    // 如果沒有提供CA證書，使用基本SSL選項
    console.log('No CA certificate provided, using default SSL settings.');
    sslConfig = {
      ssl: {
        rejectUnauthorized: true
      }
    };
  }
  
  // 輸出連接配置（安全地屏蔽敏感信息）
  console.log(`Connecting to database in production mode with SSL. Host: ${process.env.DB_HOST}, Port: 4000, SSL enabled: true`);
}

// 創建連接池
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.NODE_ENV === 'production' ? 4000 : (process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  ...sslConfig
});

// 測試資料庫連接
pool.getConnection()
  .then(connection => {
    console.log('資料庫連接成功');
    connection.release();
  })
  .catch(err => {
    console.error('無法連接到資料庫:', err);
    
    // 提供更詳細的錯誤信息以幫助診斷問題
    if (err.code === 'ER_UNKNOWN_ERROR' && err.message.includes('insecure transport')) {
      console.error('連接錯誤: TiDB 要求使用安全連接 (SSL/TLS)。請確認環境變數中包含正確的 CA 證書。');
    }
    
    if (process.env.NODE_ENV === 'production') {
      console.error('生產環境連接失敗。請確認您的 TiDB 連接設定是否正確，包括主機、端口、用戶名、密碼和 CA 證書。');
    }
  });

module.exports = pool; 