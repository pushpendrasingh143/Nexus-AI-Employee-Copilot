const express = require("express");

const departmentController = require("../controllers/department.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  departmentController.createDepartment
);

router.get(
  "/",
  authMiddleware,
  departmentController.getAllDepartments
);

router.get(
  "/:id",
  authMiddleware,
  departmentController.getDepartmentById
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  departmentController.updateDepartment
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  departmentController.deleteDepartment
);

module.exports = router;