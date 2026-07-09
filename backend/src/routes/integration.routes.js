const express = require("express");

const integrationController = require("../controllers/integration.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get(
  "/status",
  authMiddleware,
  integrationController.getIntegrationStatus
);

router.post(
  "/google/workspace/action",
  authMiddleware,
  integrationController.generateGoogleWorkspaceAction
);

router.post(
  "/microsoft365/action",
  authMiddleware,
  integrationController.generateMicrosoft365Action
);

router.post(
  "/collaboration/action",
  authMiddleware,
  integrationController.generateCollaborationAction
);

module.exports = router;