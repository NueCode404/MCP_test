const express = require('express');
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// 管理員登入
router.post('/login', adminController.login);

// Token 驗證端點
router.get('/verify-token', authMiddleware, adminController.verifyToken);

// 需要驗證的路由
router.get('/users', authMiddleware, adminController.getAllUsers);
router.post('/users', authMiddleware, adminController.createUser);
router.put('/users/:id', authMiddleware, adminController.updateUser);
router.delete('/users/:id', authMiddleware, adminController.deleteUser);

module.exports = router; 