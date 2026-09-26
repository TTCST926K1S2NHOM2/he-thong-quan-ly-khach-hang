const express = require("express");

const router = express.Router();

const roleController = require("../controllers/roleController");

// Lấy danh sách Role
router.get("/roles", roleController.getRoles);

// Lấy danh sách nhóm nghiệp vụ
router.get(
  "/business-groups",
  roleController.getBusinessGroups
);

// Kiểm tra dữ liệu gán Role / nhóm nghiệp vụ
router.post(
  "/validate-assignment",
  roleController.validateAssignment
);

module.exports = router;