const userService = require('../services/userService');


// ======================================================
// 1. LẤY DANH SÁCH TÀI KHOẢN
// ======================================================

const getUsers = async (req, res) => {
  try {
    const result = await userService.getUsers(req.query);

    return res.status(200).json({
      success: true,
      data: result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// 2. XEM CHI TIẾT TÀI KHOẢN
// ======================================================

const getUserById = async (req, res) => {
  try {
    const user =
      await userService.getUserById(req.params.id);

    return res.status(200).json({
      success: true,
      data: user,
    });

  } catch (error) {
    const statusCode =
      error.message.includes('Không tìm thấy')
        ? 404
        : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// 3. TẠO TÀI KHOẢN
// ======================================================

const createUser = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
    } = req.body;


    // Kiểm tra dữ liệu bắt buộc
    if (
      !fullName ||
      !email ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Vui lòng cung cấp đầy đủ fullName, email và password',
      });
    }


    // Kiểm tra định dạng email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message:
          'Định dạng email không hợp lệ',
      });
    }


    // Kiểm tra mật khẩu
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }


    const user =
      await userService.createUser(req.body);


    return res.status(201).json({
      success: true,
      message:
        'Tạo tài khoản thành công',
      data: user,
    });

  } catch (error) {
    const statusCode =
      error.message.includes(
        'Email đã tồn tại'
      )
        ? 409
        : 400;


    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// 4. CẬP NHẬT TÀI KHOẢN
// ======================================================

const updateUser = async (req, res) => {
  try {

    // Nếu có email thì kiểm tra định dạng
    if (req.body.email) {

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (
        !emailRegex.test(
          req.body.email
        )
      ) {
        return res.status(400).json({
          success: false,
          message:
            'Định dạng email không hợp lệ',
        });
      }
    }


    // Nếu có password thì kiểm tra độ dài
    if (
      req.body.password &&
      req.body.password.length < 6
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Mật khẩu phải có ít nhất 6 ký tự',
      });
    }


    const user =
      await userService.updateUser(
        req.params.id,
        req.body
      );


    return res.status(200).json({
      success: true,
      message:
        'Cập nhật tài khoản thành công',
      data: user,
    });

  } catch (error) {

    let statusCode = 400;


    if (
      error.message.includes(
        'Không tìm thấy'
      )
    ) {
      statusCode = 404;
    }


    if (
      error.message.includes(
        'Email đã tồn tại'
      )
    ) {
      statusCode = 409;
    }


    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// 5. KHÓA / MỞ KHÓA TÀI KHOẢN
// S1-10
//
// inactive = khóa
// active   = mở khóa
// ======================================================

const updateUserStatus = async (
  req,
  res
) => {
  try {

    const { status } = req.body;


    if (!status) {
      return res.status(400).json({
        success: false,
        message:
          'status là bắt buộc',
      });
    }


    if (
      !['active', 'inactive']
        .includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          'Trạng thái tài khoản không hợp lệ',
      });
    }


    const user =
      await userService.updateUserStatus(
        req.params.id,
        status
      );


    return res.status(200).json({
      success: true,

      message:
        status === 'inactive'
          ? 'Khóa tài khoản thành công'
          : 'Mở khóa tài khoản thành công',

      data: user,
    });

  } catch (error) {

    const statusCode =
      error.message.includes(
        'Không tìm thấy'
      )
        ? 404
        : 400;


    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};


// ======================================================
// 6. XÓA TÀI KHOẢN
// ======================================================

const deleteUser = async (req, res) => {
  try {

    const result =
      await userService.deleteUser(
        req.params.id
      );


    return res.status(200).json({
      success: true,
      ...result,
    });

  } catch (error) {

    const statusCode =
      error.message.includes(
        'Không tìm thấy'
      )
        ? 404
        : 400;


    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
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