const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Route kiểm tra hiệu lực session
router.get('/check', sessionController.checkSession);

// Route xử lý đăng xuất / hủy session
router.post('/logout', sessionController.logout);

module.exports = router;