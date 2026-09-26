const Session = require('../models/Session');

class SessionService {
  // Tạo session mới
  async createSession(userId, token, expiresAt, deviceInfo = '') {
    if (!userId) {
      throw new Error('userId là bắt buộc');
    }

    if (!token) {
      throw new Error('token là bắt buộc');
    }

    if (!expiresAt) {
      throw new Error('expiresAt là bắt buộc');
    }

    const expiryDate = new Date(expiresAt);

    if (Number.isNaN(expiryDate.getTime())) {
      throw new Error('expiresAt không hợp lệ');
    }

    if (expiryDate <= new Date()) {
      throw new Error('expiresAt phải là thời điểm trong tương lai');
    }

    return await Session.create({
      userId,
      token,
      expiresAt: expiryDate,
      deviceInfo,
      isValid: true,
    });
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

  // Hủy session khi logout
  async destroySession(token) {
    if (!token) {
      throw new Error('Token là bắt buộc');
    }

    const session = await Session.findOne({
      token,
    });

    if (!session) {
      return false;
    }

    // Không xóa ngay, chỉ đánh dấu session không còn hiệu lực
    session.isValid = false;
    await session.save();

    return true;
  }

  // Hủy tất cả session của một User
  async destroyAllUserSessions(userId) {
    if (!userId) {
      throw new Error('userId là bắt buộc');
    }

    const result = await Session.updateMany(
      {
        userId,
        isValid: true,
      },
      {
        $set: {
          isValid: false,
        },
      }
    );

    return result.modifiedCount;
  }
}

module.exports = new SessionService();