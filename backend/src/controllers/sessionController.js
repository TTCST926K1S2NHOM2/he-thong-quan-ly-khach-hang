const sessionService = require('../services/sessionService');

const getTokenFromRequest = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return req.cookies?.token || null;
};

/**
 * POST /api/sessions/create
 * Tạo session - phục vụ test/integration
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

    const expiresDate = new Date(expiresAt);

    if (Number.isNaN(expiresDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'expiresAt không hợp lệ',
      });
    }

    if (expiresDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: 'expiresAt phải là thời gian trong tương lai',
      });
    }

    const newSession = await sessionService.createSession(
      userId,
      token,
      expiresDate,
      deviceInfo
    );

    return res.status(201).json({
      success: true,
      message: 'Tạo session thành công',
      data: {
        id: newSession._id,
        userId: newSession.userId,
        token: newSession.token,
        expiresAt: newSession.expiresAt,
        isValid: newSession.isValid,
        deviceInfo: newSession.deviceInfo,
      },
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
 * GET /api/sessions/check
 * Kiểm tra trạng thái session
 */
exports.checkSession = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Không tìm thấy Token xác thực trong request',
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
        isValid: result.session.isValid,
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
 * POST /api/sessions/logout
 * Đăng xuất và hủy session
 */
exports.logout = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu Token để thực hiện đăng xuất',
      });
    }

    const isDestroyed = await sessionService.destroySession(token);

    res.clearCookie('token');

    if (!isDestroyed) {
      return res.status(404).json({
        success: false,
        message: 'Session không tồn tại hoặc đã bị hủy trước đó',
      });
    }

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