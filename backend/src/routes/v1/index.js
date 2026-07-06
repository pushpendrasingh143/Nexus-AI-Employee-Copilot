const express = require("express");

const healthRoutes = require("../health.routes");
const authRoutes = require("../auth.routes");
const employeeRoutes = require("../employee.routes");
const departmentRoutes = require("../department.routes");
const documentRoutes = require("../document.routes");
const aiRoutes = require("../ai.routes");
const dashboardRoutes = require("../dashboard.routes");

const router = express.Router();

router.use("/", healthRoutes);
router.use("/auth", authRoutes);
router.use("/employees", employeeRoutes);
router.use("/departments", departmentRoutes);
router.use("/documents", documentRoutes);
router.use("/ai", aiRoutes);
router.use("/dashboard", dashboardRoutes);

module.exports = router;