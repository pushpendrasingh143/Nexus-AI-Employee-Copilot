const express = require("express");

const agentController = require("../controllers/agent.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");

const router = express.Router();

router.post("/hr/ask", authMiddleware, agentController.askHrAgent);

router.post(
  "/email/generate",
  authMiddleware,
  agentController.generateEmailDraft
);

router.post(
  "/meeting/schedule",
  authMiddleware,
  agentController.generateMeetingSchedule
);

router.post(
  "/task/generate",
  authMiddleware,
  agentController.generateTaskPlan
);

router.post(
  "/report/generate",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  agentController.generateReport
);

router.post(
  "/knowledge/search",
  authMiddleware,
  agentController.searchKnowledge
);

router.post(
  "/voice/process",
  authMiddleware,
  agentController.processVoiceCommand
);
module.exports = router;