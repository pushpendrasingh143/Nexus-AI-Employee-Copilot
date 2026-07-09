const express = require("express");

const taskController = require("../controllers/task.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  taskController.createTask
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  taskController.getAllTasks
);

router.get("/my", authMiddleware, taskController.getMyTasks);

router.patch("/:id/status", authMiddleware, taskController.updateTaskStatus);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  taskController.deleteTask
);

module.exports = router;