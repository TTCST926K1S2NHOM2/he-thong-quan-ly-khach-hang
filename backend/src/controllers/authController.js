const authService = require('../services/authService');

const login = async (req, res) => {
  try {
    const { email, password, deviceInfo = '' } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng nhập email và mật khẩu',
      });
    }

    const result = await authService.login(
      email,
      password,
      deviceInfo
    );

    // Lưu token vào cookie
    res.cookie('token', result.session.token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      expires: new Date(result.session.expiresAt),
    });

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: result,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};