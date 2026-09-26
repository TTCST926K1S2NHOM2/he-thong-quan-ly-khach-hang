const permissionService = require('../services/permissionService');

/**
 * Middleware kiểm tra quyền của User
 *
 * User ID hiện tại được lấy từ header:
 * x-user-id
 *
 * Khi hệ thống có authentication middleware,
 * có thể thay bằng req.user._id.
 */
const permissionMiddleware = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const userId =
        req.user?._id ||
        req.user?.id ||
        req.headers['x-user-id'];

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Chưa xác định được người dùng',
        });
      }

      const allowed = await permissionService.hasPermission(
        userId,
        requiredPermission
      );

      if (!allowed) {
        return res.status(403).json({
          success: false,
          code: 'ACCESS_DENIED',
          message: 'Bạn không có quyền truy cập chức năng này',
        });
      }

      // Lưu thông tin quyền để Controller có thể sử dụng
      req.permission = await permissionService.getUserPermission(userId);

      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Lỗi khi kiểm tra quyền',
        error: error.message,
      });
    }
  };
};

module.exports = permissionMiddleware;