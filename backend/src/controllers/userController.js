const userService = require('../services/userService');

const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res.status(404).json({ success: false, message: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    const user = await userService.createUser(req.body);
    return res.status(201).json({ success: true, message: 'Tạo tài khoản thành công', data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({ success: true, message: 'Cập nhật thành công', data: user });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await userService.deleteUser(req.params.id);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};