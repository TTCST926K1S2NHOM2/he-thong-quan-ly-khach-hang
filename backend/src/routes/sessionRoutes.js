const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Route tạo session (hỗ trợ test)
router.post('/create', sessionController.createSession);

// Route kiểm tra hiệu lực session
router.get('/check', sessionController.checkSession);

// Route đăng xuất / xóa session
router.post('/logout', sessionController.logout);

module.exports = router;