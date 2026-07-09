const express = require("express");

const healthRoutes = require("../health.routes");
const authRoutes = require("../auth.routes");
const employeeRoutes = require("../employee.routes");
const departmentRoutes = require("../department.routes");
const documentRoutes = require("../document.routes");
const aiRoutes = require("../ai.routes");
const chatRoutes = require("./chat.routes");
const dashboardRoutes = require("../dashboard.routes");
const analyticsRoutes = require("../analytics.routes");
const agentRoutes = require("../agent.routes");
const taskRoutes = require("../task.routes");
const integrationRoutes = require("../integration.routes");
const featureRoutes = require("../feature.routes");
const systemRoutes = require("../system.routes");

const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/documents", documentRoutes);
router.use("/ai", aiRoutes);
router.use("/chats", chatRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/analytics", analyticsRoutes);
router.use("/agents", agentRoutes);
router.use("/tasks", taskRoutes);
router.use("/integrations", integrationRoutes);
router.use("/features", featureRoutes);
router.use("/system", systemRoutes);

module.exports = router;