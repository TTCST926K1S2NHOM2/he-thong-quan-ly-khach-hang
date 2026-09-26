const roleService = require("../services/roleService");

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

const validateAssignment = async (req, res) => {
  try {
    const { userId, roleId, businessGroupId } = req.body;

    roleService.validateAssignment(
      userId,
      roleId,
      businessGroupId
    );

    if (roleId) {
      const role = await roleService.getRoleById(roleId);

      if (!role) {
        return res.status(404).json({
          success: false,
          message: "Role không tồn tại",
        });
      }
    }

    if (businessGroupId) {
      const group =
        await roleService.getBusinessGroupById(
          businessGroupId
        );

      if (!group) {
        return res.status(404).json({
          success: false,
          message: "Nhóm nghiệp vụ không tồn tại",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Dữ liệu hợp lệ",
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
  validateAssignment,
};