const jwt = require('jsonwebtoken');

// JWT 認證中間件
const authMiddleware = (req, res, next) => {
  try {
    // 獲取 Authorization 頭部
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '認證失敗：未提供有效的令牌' });
    }
    
    // 獲取令牌
    const token = authHeader.split(' ')[1];
    
    // 驗證令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_key');
    
    // 將 decoded 數據附加到請求對象
    req.user = decoded;
    
    // 繼續處理
    next();
  } catch (error) {
    console.error('認證錯誤:', error);
    return res.status(401).json({ message: '認證失敗：無效或過期的令牌' });
  }
};

module.exports = authMiddleware; 