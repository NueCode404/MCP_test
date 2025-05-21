const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// 取得所有使用者
router.get('/', userController.getAllUsers);

// 取得單一使用者
router.get('/:id', userController.getUserById);

module.exports = router; 