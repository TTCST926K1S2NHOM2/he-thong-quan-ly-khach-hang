const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const authMiddleware = require('../middleware/authMiddleware');
const permissionMiddleware = require('../middleware/permissionMiddleware');


// ======================================================
// TẤT CẢ API USER PHẢI ĐĂNG NHẬP
// ======================================================

router.use(authMiddleware);


// ======================================================
// 1. LẤY DANH SÁCH NGƯỜI DÙNG
// ADMIN / STAFF
// Permission: USER_VIEW
// ======================================================

router.get(
  '/',
  permissionMiddleware('USER_VIEW'),
  userController.getUsers
);


// ======================================================
// 2. TẠO TÀI KHOẢN
// CHỈ ADMIN
// Permission: USER_CREATE
// ======================================================

router.post(
  '/',
  permissionMiddleware('USER_CREATE'),
  userController.createUser
);


// ======================================================
// 3. KHÓA / MỞ KHÓA TÀI KHOẢN
// S1-10
// CHỈ ADMIN
// Permission: USER_LOCK
//
// PATCH /api/users/:id/status
// body:
// {
//   "status": "inactive"
// }
//
// hoặc:
//
// {
//   "status": "active"
// }
// ======================================================

router.patch(
  '/:id/status',
  permissionMiddleware('USER_LOCK'),
  userController.updateUserStatus
);


// ======================================================
// 4. XEM CHI TIẾT NGƯỜI DÙNG
// ADMIN / STAFF
// Permission: USER_VIEW
// ======================================================

router.get(
  '/:id',
  permissionMiddleware('USER_VIEW'),
  userController.getUserById
);


// ======================================================
// 5. CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
// ADMIN / STAFF
// Permission: USER_UPDATE
//
// Lưu ý:
// role / businessGroupId / status
// KHÔNG được cập nhật qua API này.
// ======================================================

router.put(
  '/:id',
  permissionMiddleware('USER_UPDATE'),
  userController.updateUser
);


// ======================================================
// 6. XÓA TÀI KHOẢN
// CHỈ ADMIN
// Permission: USER_DELETE
// ======================================================

router.delete(
  '/:id',
  permissionMiddleware('USER_DELETE'),
  userController.deleteUser
);


module.exports = router;