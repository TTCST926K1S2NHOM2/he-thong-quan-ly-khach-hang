const userService = require('../services/userService');

// 1. Lấy danh sách tài khoản
const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Xem thông tin chi tiết tài khoản
const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

// 3. Thêm tài khoản + Validate dữ liệu đầu vào & email trùng
const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    // Validate dữ liệu đầu vào
    if (!fullName || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vui lòng cung cấp đầy đủ fullName, email và password' 
      });
    }

    // Validate định dạng email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Định dạng email không hợp lệ' });
    }

    // Validate độ dài mật khẩu
    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' });
    }

    const user = await userService.createUser(req.body);
    return res.status(201).json({ success: true, message: 'Tạo tài khoản thành công', data: user });
  } catch (error) {
    const statusCode = error.message.includes('Email đã tồn tại') ? 409 : 400;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

// 4. Cập nhật tài khoản
const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Cập nhật tài khoản thành công', data: user });
  } catch (error) {
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

// 5. Xóa tài khoản
const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    const statusCode = error.message.includes('Không tìm thấy') ? 404 : 400;
    return res.status(statusCode).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};