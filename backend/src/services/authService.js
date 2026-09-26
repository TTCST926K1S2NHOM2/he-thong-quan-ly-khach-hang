const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const sessionService = require('./sessionService');

const login = async (email, password, deviceInfo = '') => {
  if (!email || !password) {
    throw new Error('Vui lòng nhập email và mật khẩu');
  }

  const user = await User.findOne({
    email: email.toLowerCase().trim(),
  });

  if (!user) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  if (user.status !== 'active') {
    throw new Error('Tài khoản đã bị khóa hoặc không hoạt động');
  }

  const passwordValid = await bcrypt.compare(password, user.password);

  if (!passwordValid) {
    throw new Error('Email hoặc mật khẩu không đúng');
  }

  // Tạo token session ngẫu nhiên
  const token = crypto.randomBytes(32).toString('hex');

  // Session có hiệu lực 2 giờ
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000);

  const session = await sessionService.createSession(
    user._id,
    token,
    expiresAt,
    deviceInfo
  );

  return {
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      businessGroupId: user.businessGroupId,
      status: user.status,
    },
    session: {
      token: session.token,
      expiresAt: session.expiresAt,
    },
  };
};

module.exports = {
  login,
};