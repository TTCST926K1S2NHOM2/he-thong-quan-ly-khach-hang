const express = require('express');

const router = express.Router();

const permissionController = require('../controllers/permissionController');
const permissionMiddleware = require('../middleware/permissionMiddleware');

// Lấy thông tin quyền của User
router.get(
  '/me',
  permissionController.getMyPermissions
);

// Lấy phạm vi dữ liệu của User
router.get(
  '/scope',
  permissionController.getMyDataScope
);

// Kiểm tra một quyền cụ thể
router.post(
  '/check',
  permissionController.checkPermission
);

// API test Middleware phân quyền
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