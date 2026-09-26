const Role = require('../models/role');
const BusinessGroup = require('../models/BusinessGroup');
const User = require('../models/User');

// Lấy danh sách Role
const getRoles = async () => {
  return await Role.find({
    status: true,
  }).sort({ id: 1 });
};

// Lấy danh sách nhóm nghiệp vụ
const getBusinessGroups = async () => {
  return await BusinessGroup.find({
    status: true,
  }).sort({ id: 1 });
};

// Kiểm tra dữ liệu gán Role / nhóm nghiệp vụ
const validateAssignment = (userId, roleId, businessGroupId) => {
  if (!userId) {
    throw new Error('userId là bắt buộc');
  }

  if (!roleId && !businessGroupId) {
    throw new Error(
      'Phải cung cấp roleId hoặc businessGroupId'
    );
  }

  if (
    roleId &&
    (!Number.isInteger(Number(roleId)) ||
      Number(roleId) <= 0)
  ) {
    throw new Error('roleId không hợp lệ');
  }

  if (
    businessGroupId &&
    (!Number.isInteger(Number(businessGroupId)) ||
      Number(businessGroupId) <= 0)
  ) {
    throw new Error('businessGroupId không hợp lệ');
  }
};

// Lấy Role theo id
const getRoleById = async (roleId) => {
  return await Role.findOne({
    id: Number(roleId),
    status: true,
  });
};

// Lấy nhóm nghiệp vụ theo id
const getBusinessGroupById = async (businessGroupId) => {
  return await BusinessGroup.findOne({
    id: Number(businessGroupId),
    status: true,
  });
};

// Gán Role / nhóm nghiệp vụ cho User
const assignRoleAndBusinessGroup = async (
  userId,
  roleId,
  businessGroupId
) => {
  validateAssignment(
    userId,
    roleId,
    businessGroupId
  );

  const user = await User.findById(userId);

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  // Gán Role
  if (roleId) {
    const role = await getRoleById(roleId);

    if (!role) {
      throw new Error('Role không tồn tại');
    }

    user.role = role.name;
  }

  // Gán nhóm nghiệp vụ
  if (businessGroupId) {
    const group = await getBusinessGroupById(
      businessGroupId
    );

    if (!group) {
      throw new Error(
        'Nhóm nghiệp vụ không tồn tại'
      );
    }

    user.businessGroupId = group.id;
  }

  await user.save();

  return {
    userId: user._id,
    role: user.role,
    businessGroupId: user.businessGroupId,
  };
};

module.exports = {
  getRoles,
  getBusinessGroups,
  validateAssignment,
  getRoleById,
  getBusinessGroupById,
  assignRoleAndBusinessGroup,
};