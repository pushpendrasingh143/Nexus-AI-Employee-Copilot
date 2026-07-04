const express = require("express");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employee.controller");

const authenticate = require("../middleware/auth.middleware");
const authorize = require("../middleware/role.middleware");

const router = express.Router();

// Create Employee (Admin Only)
router.post(
  "/",
  authenticate,
  authorize("admin"),
  createEmployee
);

// Get All Employees (Admin & HR)
router.get(
  "/",
  authenticate,
  authorize("admin", "hr"),
  getAllEmployees
);

// Get Employee By ID (Admin & HR)
router.get(
  "/:id",
  authenticate,
  authorize("admin", "hr"),
  getEmployeeById
);

// Update Employee (Admin Only)
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  updateEmployee
);

// Delete Employee (Admin Only)
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteEmployee
);

module.exports = router;