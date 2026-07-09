const express = require("express");

const systemController = require("../controllers/system.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.get(
  "/status",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  systemController.getSystemStatus
);

module.exports = router;