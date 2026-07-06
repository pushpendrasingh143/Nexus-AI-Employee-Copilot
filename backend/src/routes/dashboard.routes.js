const express = require("express");

const router = express.Router();

const dashboardController = require("../controllers/dashboard.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

router.get(
  "/stats",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  dashboardController.getDashboardStats
);

module.exports = router;