const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Yêu cầu reset mật khẩu & Tạo token
const requestPasswordReset = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Email không tồn tại trong hệ thống');
  }

  // Tạo token ngẫu nhiên
  const resetToken = crypto.randomBytes(32).toString('hex');

  // Hash token để lưu an toàn vào DB
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  // Token hết hạn sau 15 phút
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

  await user.save();

  return {
    resetToken, // Trả về token cho FE
    expiresIn: '15 phút',
  };
};

// Xác thực token & Cho phép đặt mật khẩu mới
const resetPassword = async (token, newPassword) => {
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Kiểm tra token khớp và kiểm tra token hết hạn
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new Error('Token reset không hợp lệ hoặc đã hết hạn');
  }

  // Đặt mật khẩu mới
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(newPassword, salt);

  // Xóa token sau khi cập nhật thành công
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;

  await user.save();
  return { message: 'Đặt lại mật khẩu mới thành công' };
};

module.exports = {
  requestPasswordReset,
  resetPassword,
};