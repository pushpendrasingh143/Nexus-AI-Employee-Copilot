const express = require("express");

const analyticsController = require("../controllers/analytics.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  analyticsController.getDashboardAnalytics
);

module.exports = router;