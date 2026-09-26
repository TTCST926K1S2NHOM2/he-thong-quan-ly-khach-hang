const Session = require('../models/Session');

class SessionService {
  // Tạo session mới
  async createSession(userId, token, expiresAt, deviceInfo = '') {
    if (!userId || !token || !expiresAt) {
      throw new Error('userId, token và expiresAt là bắt buộc');
    }

    const session = await Session.create({
      userId,
      token,
      expiresAt,
      deviceInfo,
      isValid: true,
    });

    return session;
  }

  // Kiểm tra session còn hiệu lực
  async checkSessionValid(token) {
    if (!token) {
      return {
        isValid: false,
        reason: 'Token là bắt buộc',
      };
    }

    const session = await Session.findOne({
      token,
      isValid: true,
    });

    if (!session) {
      return {
        isValid: false,
        reason: 'Session không tồn tại hoặc đã bị hủy',
      };
    }

    // Kiểm tra hết hạn
    if (new Date() >= new Date(session.expiresAt)) {
      session.isValid = false;
      await session.save();

      return {
        isValid: false,
        reason: 'Session đã hết hạn sử dụng',
      };
    }

    return {
      isValid: true,
      session,
    };
  }

  // Hủy session khi đăng xuất
  async destroySession(token) {
    if (!token) {
      return false;
    }

    const session = await Session.findOne({
      token,
    });

    if (!session) {
      return false;
    }

    session.isValid = false;
    await session.save();

    return true;
  }

  // Hủy tất cả session của User
  async destroyAllUserSessions(userId) {
    if (!userId) {
      throw new Error('userId là bắt buộc');
    }

    const result = await Session.updateMany(
      { userId, isValid: true },
      { $set: { isValid: false } }
    );

    return result.modifiedCount;
  }
}

module.exports = new SessionService();