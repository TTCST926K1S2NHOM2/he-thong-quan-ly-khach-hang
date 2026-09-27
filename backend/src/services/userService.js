const User = require('../models/User');
const bcrypt = require('bcryptjs');
const sessionService = require('./sessionService');


// ======================================================
// 1. LẤY DANH SÁCH NGƯỜI DÙNG
// Có phân trang + lọc role/status + tìm kiếm
// ======================================================

const getUsers = async (query = {}) => {
  const page = Math.max(
    parseInt(query.page) || 1,
    1
  );

  const limit = Math.max(
    parseInt(query.limit) || 10,
    1
  );

  const skip = (page - 1) * limit;

  const filter = {};


  // Lọc theo role
  if (query.role) {
    filter.role = query.role;
  }


  // Lọc theo trạng thái
  if (query.status) {
    filter.status = query.status;
  }


  // Tìm kiếm theo tên hoặc email
  if (query.search) {
    const search = query.search.trim();

    filter.$or = [
      {
        fullName: {
          $regex: search,
          $options: 'i',
        },
      },
      {
        email: {
          $regex: search,
          $options: 'i',
        },
      },
    ];
  }


  const users = await User.find(filter)
    .select(
      '-password -resetPasswordToken -resetPasswordExpires'
    )
    .skip(skip)
    .limit(limit)
    .sort({
      createdAt: -1,
    });


  const total =
    await User.countDocuments(filter);


  return {
    users,

    pagination: {
      page,
      limit,
      total,
      totalPages:
        Math.ceil(total / limit),
    },
  };
};


// ======================================================
// 2. LẤY CHI TIẾT MỘT NGƯỜI DÙNG
// ======================================================

const getUserById = async (id) => {
  const user = await User.findById(id)
    .select(
      '-password -resetPasswordToken -resetPasswordExpires'
    );


  if (!user) {
    throw new Error(
      'Không tìm thấy người dùng'
    );
  }


  return user;
};


// ======================================================
// 3. TẠO TÀI KHOẢN MỚI
// ======================================================

const createUser = async (userData) => {
  const {
    fullName,
    email,
    password,
    role,
    businessGroupId,
  } = userData;


  // Chuẩn hóa email
  const normalizedEmail =
    email.toLowerCase().trim();


  // Kiểm tra email tồn tại
  const existingUser =
    await User.findOne({
      email: normalizedEmail,
    });


  if (existingUser) {
    throw new Error(
      'Email đã tồn tại trong hệ thống'
    );
  }


  // Hash mật khẩu
  const salt =
    await bcrypt.genSalt(10);

  const hashedPassword =
    await bcrypt.hash(
      password,
      salt
    );


  // Tạo tài khoản
  const newUser =
    await User.create({

      fullName:
        fullName.trim(),

      email:
        normalizedEmail,

      password:
        hashedPassword,

      role:
        role || 'staff',

      businessGroupId:
        businessGroupId !== undefined
          ? businessGroupId
          : null,

      status:
        'active',
    });


  // Không trả password ra frontend
  const result =
    newUser.toObject();

  delete result.password;


  return result;
};


// ======================================================
// 4. CẬP NHẬT THÔNG TIN NGƯỜI DÙNG
// USER_UPDATE
//
// KHÔNG cho API này sửa:
// - role
// - businessGroupId
// - status
//
// Các trường đó phải dùng API riêng.
// ======================================================

const updateUser = async (
  id,
  updateData
) => {

  // Không cho thay đổi các trường nhạy cảm
  delete updateData._id;

  delete updateData.role;

  delete updateData.businessGroupId;

  delete updateData.status;


  // Chuẩn hóa email nếu có
  if (updateData.email) {

    const normalizedEmail =
      updateData.email
        .toLowerCase()
        .trim();


    // Kiểm tra email có thuộc user khác không
    const existingUser =
      await User.findOne({

        email:
          normalizedEmail,

        _id: {
          $ne: id,
        },

      });


    if (existingUser) {
      throw new Error(
        'Email đã tồn tại trong hệ thống'
      );
    }


    updateData.email =
      normalizedEmail;
  }


  // Hash password nếu cập nhật password
  if (updateData.password) {

    if (
      updateData.password.length < 6
    ) {
      throw new Error(
        'Mật khẩu phải có ít nhất 6 ký tự'
      );
    }


    const salt =
      await bcrypt.genSalt(10);


    updateData.password =
      await bcrypt.hash(
        updateData.password,
        salt
      );
  }


  const updatedUser =
    await User.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
    .select(
      '-password -resetPasswordToken -resetPasswordExpires'
    );


  if (!updatedUser) {
    throw new Error(
      'Không tìm thấy người dùng để cập nhật'
    );
  }


  return updatedUser;
};


// ======================================================
// 5. KHÓA / MỞ KHÓA TÀI KHOẢN
// S1-10
//
// active   = đang hoạt động
// inactive = bị khóa
//
// Khi khóa:
// → đổi status thành inactive
// → thu hồi toàn bộ session của User
// ======================================================

const updateUserStatus = async (
  id,
  status
) => {

  // Kiểm tra trạng thái hợp lệ
  if (
    ![
      'active',
      'inactive',
    ].includes(status)
  ) {
    throw new Error(
      'Trạng thái tài khoản không hợp lệ'
    );
  }


  const user =
    await User.findByIdAndUpdate(
      id,
      {
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .select(
      '-password -resetPasswordToken -resetPasswordExpires'
    );


  if (!user) {
    throw new Error(
      'Không tìm thấy người dùng'
    );
  }


  // ==================================================
  // KHI KHÓA TÀI KHOẢN
  // THU HỒI TẤT CẢ SESSION ĐANG HOẠT ĐỘNG
  // ==================================================

  if (status === 'inactive') {

    await sessionService
      .destroyAllUserSessions(id);

  }


  return user;
};


// ======================================================
// 6. XÓA TÀI KHOẢN
// ======================================================

const deleteUser = async (id) => {

  const user =
    await User.findById(id);


  if (!user) {
    throw new Error(
      'Không tìm thấy người dùng để xóa'
    );
  }


  // Thu hồi session trước khi xóa tài khoản
  await sessionService
    .destroyAllUserSessions(id);


  await User.findByIdAndDelete(id);


  return {
    message:
      'Xóa tài khoản người dùng thành công',
  };
};


// ======================================================
// EXPORT
// ======================================================

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
  deleteUser,
};