const User = require('../models/User');

const ROLE_PERMISSIONS = {
  admin: [
    'USER_VIEW',
    'USER_CREATE',
    'USER_UPDATE',
    'USER_DELETE',
    'USER_LOCK',
    'USER_ASSIGN_ROLE',
  ],

  staff: [
    'USER_VIEW',
    'USER_UPDATE',
  ],

  user: [
    'USER_VIEW_SELF',
  ],
};

const ROLE_DATA_SCOPE = {
  admin: 'ALL',
  staff: 'GROUP',
  user: 'SELF',
};

const getUserPermission = async (userId) => {
  if (!userId) {
    throw new Error('userId là bắt buộc');
  }

  const user = await User.findById(userId).select(
    '-password -resetPasswordToken -resetPasswordExpires'
  );

  if (!user) {
    throw new Error('Không tìm thấy người dùng');
  }

  const role = user.role;

  if (!ROLE_PERMISSIONS[role]) {
    throw new Error('Role người dùng không hợp lệ');
  }

  return {
    userId: user._id,
    fullName: user.fullName,
    role,
    permissions: ROLE_PERMISSIONS[role],
    dataScope: ROLE_DATA_SCOPE[role],
  };
};

const hasPermission = async (userId, requiredPermission) => {
  const permissionInfo = await getUserPermission(userId);

  return permissionInfo.permissions.includes(requiredPermission);
};

const getDataScope = async (userId) => {
  const permissionInfo = await getUserPermission(userId);

  return {
    userId: permissionInfo.userId,
    role: permissionInfo.role,
    dataScope: permissionInfo.dataScope,
  };
};

module.exports = {
  getUserPermission,
  hasPermission,
  getDataScope,
};