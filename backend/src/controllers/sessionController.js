const sessionService = require('../services/sessionService');

/**
 * [POST] /api/sessions/create (Endpoint hỗ trợ tạo Session test)
 */
exports.createSession = async (req, res) => {
  try {
    const { userId, token, expiresAt, deviceInfo } = req.body;

    if (!userId || !token || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc: userId, token, expiresAt',
      });
    }

    const newSession = await sessionService.createSession(userId, token, expiresAt, deviceInfo);

    return res.status(201).json({
      success: true,
      message: 'Tạo session thành công',
      data: newSession,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo session',
      error: error.message,
    });
  }
};

/**
 * [GET] /api/sessions/check
 * Kiểm tra trạng thái Session
 */
exports.checkSession = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.token;

    // Kịch bản: Không có token -> trả lỗi
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Token xác thực trong request',
      });
    }

    // Kịch bản: Token không tồn tại hoặc hết hạn -> trả lỗi
    const result = await sessionService.checkSessionValid(token);

    if (!result.isValid) {
      return res.status(401).json({
        success: false,
        message: result.reason,
      });
    }

    // Kịch bản: Token hợp lệ -> Session hợp lệ
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
 * Xử lý đăng xuất & Hủy Session
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

    res.clearCookie('token');

    // Kịch bản: Logout với Session không tồn tại (hoặc đã bị xóa trước đó) -> trả lỗi phù hợp
    if (!isDestroyed) {
      return res.status(404).json({
        success: false,
        message: 'Session không tồn tại hoặc đã bị hủy từ trước',
      });
    }

    // Kịch bản: Logout thành công -> Session bị xóa
    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công, session đã bị xóa khỏi database',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng xuất',
      error: error.message,
    });
  }
};