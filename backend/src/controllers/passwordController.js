const passwordService = require('../services/passwordService');

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Vui lòng nhập Email' });
    }

    const result = await passwordService.requestPasswordReset(email);
    return res.status(200).json({
      success: true,
      message: 'Mã/Token reset mật khẩu đã được khởi tạo',
      data: result,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res.status(400).json({ message: 'Token và mật khẩu mới không được để trống' });
    }

    const result = await passwordService.resetPassword(token, newPassword);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  forgotPassword,
  resetPassword,
};