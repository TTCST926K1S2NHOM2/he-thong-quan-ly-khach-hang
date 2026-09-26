const roleService = require("../services/roleService");

// 1. Lấy danh sách Role
const getRoles = async (req, res) => {
  try {
    const roles = await roleService.getRoles();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách Role thành công",
      data: roles,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 2. Lấy danh sách nhóm nghiệp vụ
const getBusinessGroups = async (req, res) => {
  try {
    const groups = await roleService.getBusinessGroups();

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách nhóm nghiệp vụ thành công",
      data: groups,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3. Gán Role / nhóm nghiệp vụ cho User
const assignRoleAndBusinessGroup = async (req, res) => {
  try {
    const {
      userId,
      roleId,
      businessGroupId,
    } = req.body;

    const result = await roleService.assignRoleAndBusinessGroup(
      userId,
      roleId,
      businessGroupId
    );

    return res.status(200).json({
      success: true,
      message: "Gán Role / nhóm nghiệp vụ thành công",
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getRoles,
  getBusinessGroups,
  assignRoleAndBusinessGroup,
};