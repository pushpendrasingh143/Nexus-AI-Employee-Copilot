const express = require("express");

const chatController = require("../../controllers/chat.controller");
const authMiddleware = require("../../middleware/auth.middleware");

const router = express.Router();

router.post("/", authMiddleware, chatController.createChatSession);

router.get("/", authMiddleware, chatController.getUserChatSessions);

router.get("/:sessionId", authMiddleware, chatController.getChatSessionById);

router.post(
  "/:sessionId/messages",
  authMiddleware,
  chatController.addMessageToSession
);

router.delete("/:sessionId", authMiddleware, chatController.deleteChatSession);

module.exports = router;