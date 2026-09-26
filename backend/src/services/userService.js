const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Lấy danh sách người dùng (có phân trang & lọc)
const getUsers = async (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.role) filter.role = query.role;
  if (query.status) filter.status = query.status;
 if (query.search) {
    filter.$or = [
      { fullName: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }

  const users = await User.find(filter)
    .select('-password -resetPasswordToken -resetPasswordExpires')
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const total = await User.countDocuments(filter);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Lấy thông tin chi tiết 1 người dùng
const getUserById = async (id) => {
  const user = await User.findById(id).select('-password');
  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }
  return user;
};

// Tạo tài khoản người dùng mới
const createUser = async (userData) => {
  const { fullName, email, password, role } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email đã tồn tại trong hệ thống');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    fullName,
    email,
    password: hashedPassword,
    role: role || 'staff',
  });

  const result = newUser.toObject();
  delete result.password;
  return result;
};

// Cập nhật thông tin người dùng
const updateUser = async (id, updateData) => {
  if (updateData.password) {
    const salt = await bcrypt.genSalt(10);
    updateData.password = await bcrypt.hash(updateData.password, salt);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).select('-password');

  if (!updatedUser) {
    throw new Error('Không tìm thấy người dùng để cập nhật');
  }

  return updatedUser;
};

// Xóa tài khoản người dùng
const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('Không tìm thấy người dùng để xóa');
  }
  return { message: 'Xóa tài khoản người dùng thành công' };
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};