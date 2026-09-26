const express = require("express");

const router = express.Router();

const roleController = require("../controllers/roleController");

// Lấy danh sách Role
router.get(
  "/roles",
  roleController.getRoles
);

// Lấy danh sách nhóm nghiệp vụ
router.get(
  "/business-groups",
  roleController.getBusinessGroups
);

// Gán Role / nhóm nghiệp vụ cho User
router.post(
  "/assign",
  roleController.assignRoleAndBusinessGroup
);

module.exports = router;