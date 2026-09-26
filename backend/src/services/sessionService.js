const Session = require('../models/Session');

class SessionService {
  /**
   * Tạo session mới khi đăng nhập thành công
   */
  async createSession(userId, token, expiresAt, deviceInfo = '') {
    return await Session.create({
      userId,
      token,
      expiresAt,
      deviceInfo,
      isValid: true,
    });
  }

  /**
   * Kiểm tra session còn hiệu lực hay không
   */
  async checkSessionValid(token) {
    const session = await Session.findOne({ token, isValid: true });

    if (!session) {
      return { isValid: false, reason: 'Session không tồn tại hoặc đã bị hủy' };
    }

    if (new Date() > new Date(session.expiresAt)) {
      session.isValid = false;
      await session.save();
      return { isValid: false, reason: 'Session đã hết hạn sử dụng' };
    }

    return { isValid: true, session };
  }

  /**
   * Xóa session khi đăng xuất
   */
  async destroySession(token) {
    const deletedSession = await Session.findOneAndDelete({ token });
    return !!deletedSession;
  }

  /**
   * Xóa tất cả session của User
   */
  async destroyAllUserSessions(userId) {
    const result = await Session.deleteMany({ userId });
    return result.deletedCount;
  }
}

module.exports = new SessionService();