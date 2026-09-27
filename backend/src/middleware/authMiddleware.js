const sessionService = require('../services/sessionService');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  try {
    // =====================================
    // LẤY TOKEN
    // =====================================

    let token = null;

    const authorization = req.headers.authorization;

    // Bearer token
    if (
      authorization &&
      authorization.startsWith('Bearer ')
    ) {
      token = authorization.substring(7).trim();
    }

    // Cookie token
    if (!token && req.cookies?.token) {
      token = req.cookies.token;
    }


    // =====================================
    // KHÔNG CÓ TOKEN
    // =====================================

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Bạn chưa đăng nhập',
      });
    }


    // =====================================
    // KIỂM TRA SESSION
    // =====================================

    const sessionResult =
      await sessionService.checkSessionValid(token);

    if (!sessionResult.isValid) {
      return res.status(401).json({
        success: false,
        message:
          sessionResult.reason ||
          'Phiên đăng nhập không hợp lệ',
      });
    }


    // =====================================
    // LẤY USER THẬT
    // =====================================

    const user = await User.findById(
      sessionResult.session.userId
    ).select(
      '-password -resetPasswordToken -resetPasswordExpires'
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Người dùng không tồn tại',
      });
    }


    // =====================================
    // KIỂM TRA TRẠNG THÁI
    // =====================================

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Tài khoản đã bị khóa hoặc không hoạt động',
      });
    }


    // =====================================
    // GẮN USER VÀO REQUEST
    // =====================================

    req.user = user;
    req.sessionData = sessionResult.session;

    next();

  } catch (error) {
    console.error('Auth middleware error:', error);

    return res.status(500).json({
      success: false,
      message: 'Lỗi xác thực người dùng',
      error: error.message,
    });
  }
};

module.exports = authMiddleware;