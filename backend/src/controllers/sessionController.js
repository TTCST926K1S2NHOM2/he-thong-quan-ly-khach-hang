const sessionService = require('../services/sessionService');

// Lấy token từ Authorization Bearer hoặc cookie
const getTokenFromRequest = (req) => {
  const authorization = req.headers.authorization;

  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.substring(7).trim();
  }

  if (req.cookies?.token) {
    return req.cookies.token;
  }

  return null;
};

// POST /api/sessions/create
// Endpoint hỗ trợ tạo Session để test
exports.createSession = async (req, res) => {
  try {
    const {
      userId,
      token,
      expiresAt,
      deviceInfo = '',
    } = req.body;

    if (!userId || !token || !expiresAt) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu userId, token hoặc expiresAt',
      });
    }

    const session = await sessionService.createSession(
      userId,
      token,
      expiresAt,
      deviceInfo
    );

    return res.status(201).json({
      success: true,
      message: 'Tạo session thành công',
      data: {
        id: session._id,
        userId: session.userId,
        token: session.token,
        expiresAt: session.expiresAt,
        isValid: session.isValid,
        deviceInfo: session.deviceInfo,
      },
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// GET /api/sessions/check
// Kiểm tra session hiện tại
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
        deviceInfo: result.session.deviceInfo,
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

// POST /api/sessions/logout
// Hủy session hiện tại
exports.logout = async (req, res) => {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu Token để thực hiện đăng xuất',
      });
    }

    const destroyed = await sessionService.destroySession(token);

    res.clearCookie('token');

    if (!destroyed) {
      return res.status(404).json({
        success: false,
        message: 'Session không tồn tại hoặc đã bị hủy',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Đăng xuất thành công, session đã bị vô hiệu hóa',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Lỗi server khi đăng xuất',
      error: error.message,
    });
  }
};