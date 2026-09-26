const Session = require('../models/Session');

class SessionService {
  /**
   * Tạo session mới cho user (dùng khi đăng nhập)
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
   * Kiểm tra session theo token còn hiệu lực hay không
   */
  async checkSessionValid(token) {
    const session = await Session.findOne({ token, isValid: true });

    if (!session) {
      return { isValid: false, reason: 'Session không tồn tại hoặc đã hết hạn' };
    }

    if (new Date() > new Date(session.expiresAt)) {
      session.isValid = false;
      await session.save();
      return { isValid: false, reason: 'Session đã quá thời gian sử dụng' };
    }

    return { isValid: true, session };
  }

  /**
   * Đăng xuất: Đánh dấu không hợp lệ và xóa Session khỏi DB
   */
  async destroySession(token) {
    const deletedSession = await Session.findOneAndDelete({ token });
    return !!deletedSession;
  }

  /**
   * Xóa tất cả session của 1 User (Đăng xuất tất cả thiết bị nếu cần)
   */
  async destroyAllUserSessions(userId) {
    const result = await Session.deleteMany({ userId });
    return result.deletedCount;
  }
}

module.exports = new SessionService();