const permissionService = require('../services/permissionService');

/**
 * Lấy thông tin quyền của User hiện tại
 * GET /api/permissions/me
 */
const getMyPermissions = async (req, res) => {
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

    const permission = await permissionService.getUserPermission(userId);

    return res.status(200).json({
      success: true,
      data: permission,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Lấy phạm vi dữ liệu của User
 * GET /api/permissions/scope
 */
const getMyDataScope = async (req, res) => {
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

    const scope = await permissionService.getDataScope(userId);

    return res.status(200).json({
      success: true,
      data: scope,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Kiểm tra một quyền cụ thể
 * POST /api/permissions/check
 */
const checkPermission = async (req, res) => {
  try {
    const userId =
      req.user?._id ||
      req.user?.id ||
      req.headers['x-user-id'];

    const { permission } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Chưa xác định được người dùng',
      });
    }

    if (!permission) {
      return res.status(400).json({
        success: false,
        message: 'permission là bắt buộc',
      });
    }

    const allowed = await permissionService.hasPermission(
      userId,
      permission
    );

    if (!allowed) {
      return res.status(403).json({
        success: false,
        allowed: false,
        code: 'ACCESS_DENIED',
        message: 'Bạn không có quyền thực hiện thao tác này',
      });
    }

    return res.status(200).json({
      success: true,
      allowed: true,
      message: 'Có quyền thực hiện',
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyPermissions,
  getMyDataScope,
  checkPermission,
};