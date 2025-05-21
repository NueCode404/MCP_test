const User = require('../models/userModel');

// 取得所有使用者
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: '取得使用者資料時發生錯誤' });
  }
};

// 取得單一使用者資料
exports.getUserById = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
      return res.status(400).json({ message: '無效的使用者ID' });
    }
    
    const user = await User.getUserById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '找不到使用者' });
    }
    
    // 產生額外使用者資料
    const userData = User.generateUserData(userId, user.name);
    
    // 合併使用者基本資料與生成的資料
    const fullUserData = { ...user, ...userData };
    
    res.status(200).json(fullUserData);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: '取得使用者資料時發生錯誤' });
  }
}; 