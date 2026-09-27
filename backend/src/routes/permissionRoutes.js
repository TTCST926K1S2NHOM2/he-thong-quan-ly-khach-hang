const express = require('express');

const router = express.Router();

const permissionController = require('../controllers/permissionController');
const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');

// ========================================
// TẤT CẢ API PERMISSION PHẢI ĐĂNG NHẬP
// ========================================
router.use(authMiddleware);

// Lấy quyền của chính User đang đăng nhập
router.get(
  '/me',
  permissionController.getMyPermissions
);

// Lấy phạm vi dữ liệu của chính User đang đăng nhập
router.get(
  '/scope',
  permissionController.getMyDataScope
);

// Kiểm tra một quyền cụ thể
router.post(
  '/check',
  permissionController.checkPermission
);

// API test middleware phân quyền
router.get(
  '/test/user-view',
  permissionMiddleware('USER_VIEW'),
  (req, res) => {
    return res.status(200).json({
      success: true,
      message: 'Bạn có quyền USER_VIEW',
      permission: req.permission,
    });
  }
);

module.exports = router;