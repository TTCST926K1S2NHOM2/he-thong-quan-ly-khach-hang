const sessionService = require('../services/sessionService');

/**
 * [GET] /api/sessions/check
 * Kiểm tra trạng thái Session hiện tại
 */
exports.checkSession = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Token xác thực',
      });
    }

    const result = await sessionService.checkSessionValid(token);

    if (!result.isValid) {
      return res.status(401).json({
        success: false,
        message: result.reason,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Session hợp lệ',
      data: {
        userId: result.session.userId,
        expiresAt: result.session.expiresAt,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi kiểm tra session',
      error: error.message,
    });
  }
};

/**
 * [POST] /api/sessions/logout
 * Xử lý hủy Session khi Đăng xuất
 */
exports.logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu Token để thực hiện đăng xuất',
      });
    }

    const isDestroyed = await sessionService.destroySession(token);

    // Xóa cookie token ở phía browser/client nếu dùng Cookie
    res.clearCookie('token');

    if (!isDestroyed) {
      return res.status(404).json({
        success: false,
        message: 'Session không tồn tại hoặc đã được hủy trước đó',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công, session đã bị hủy',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi xử lý đăng xuất',
      error: error.message,
    });
  }
};