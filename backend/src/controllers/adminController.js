const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// 管理員資訊
const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET;

// 登入
exports.login = (req, res) => {
  const { username, password } = req.body;
  
  // 簡單驗證
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    // 創建 JWT
    const token = jwt.sign(
      { username, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    return res.status(200).json({
      token,
      username,
      message: '登入成功'
    });
  }
  
  return res.status(401).json({ message: '用戶名或密碼錯誤' });
};

// 獲取所有使用者
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: '獲取使用者資料時發生錯誤' });
  }
};

// 創建使用者
exports.createUser = async (req, res) => {
  try {
    const userData = req.body;
    
    if (!userData.name || !userData.email || !userData.phone) {
      return res.status(400).json({ message: '缺少必要欄位：姓名、電子郵件、電話' });
    }
    
    const newUser = await User.createUser(userData);
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: '創建使用者時發生錯誤' });
  }
};

// 更新使用者
exports.updateUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: '無效的使用者ID' });
    }
    
    const updatedUser = await User.updateUser(userId, userData);
    
    if (!updatedUser) {
      return res.status(404).json({ message: '找不到使用者' });
    }
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: '更新使用者時發生錯誤' });
  }
};

// 刪除使用者
exports.deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: '無效的使用者ID' });
    }
    
    const success = await User.deleteUser(userId);
    
    if (!success) {
      return res.status(404).json({ message: '找不到使用者' });
    }
    
    res.status(200).json({ message: '使用者已成功刪除', deletedUserId: userId });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: '刪除使用者時發生錯誤' });
  }
};

// Token 驗證
exports.verifyToken = (req, res) => {
  // 如果請求通過了 authMiddleware，表示 token 有效
  // authMiddleware 已經解析了 token 到 req.user
  return res.status(200).json({
    valid: true,
    user: {
      username: req.user.username,
      role: req.user.role
    }
  });
}; 