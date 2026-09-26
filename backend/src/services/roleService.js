const Role = require("../models/Role");
const BusinessGroup = require("../models/BusinessGroup");

const getRoles = async () => {
  return await Role.findAll({
    where: {
      status: true,
    },
    order: [["id", "ASC"]],
  });
};

const getBusinessGroups = async () => {
  return await BusinessGroup.findAll({
    where: {
      status: true,
    },
    order: [["id", "ASC"]],
  });
};

const validateAssignment = (userId, roleId, businessGroupId) => {
  if (!userId) {
    throw new Error("userId là bắt buộc");
  }

  if (!roleId && !businessGroupId) {
    throw new Error(
      "Phải cung cấp roleId hoặc businessGroupId"
    );
  }

  if (roleId && (!Number.isInteger(Number(roleId)) || Number(roleId) <= 0)) {
    throw new Error("roleId không hợp lệ");
  }

  if (
    businessGroupId &&
    (!Number.isInteger(Number(businessGroupId)) ||
      Number(businessGroupId) <= 0)
  ) {
    throw new Error("businessGroupId không hợp lệ");
  }
};

const getRoleById = async (roleId) => {
  return await Role.findByPk(roleId);
};

const getBusinessGroupById = async (businessGroupId) => {
  return await BusinessGroup.findByPk(businessGroupId);
};

module.exports = {
  getRoles,
  getBusinessGroups,
  validateAssignment,
  getRoleById,
  getBusinessGroupById,
};