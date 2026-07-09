const chatService = require("../services/chat.service");

const getUserId = (req) => {
  return req.user?.id || req.user?.userId || req.userId;
};

const createChatSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title } = req.body;

    const session = await chatService.createChatSession(userId, title);

    return res.status(201).json({
      success: true,
      message: "Chat session created successfully",
      data: session,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserChatSessions = async (req, res) => {
  try {
    const userId = getUserId(req);

    const sessions = await chatService.getUserChatSessions(userId);

    return res.status(200).json({
      success: true,
      message: "Chat sessions fetched successfully",
      data: sessions,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getChatSessionById = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { sessionId } = req.params;

    const session = await chatService.getChatSessionById(sessionId, userId);

    return res.status(200).json({
      success: true,
      message: "Chat session fetched successfully",
      data: session,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const addMessageToSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { sessionId } = req.params;
    const { role, content } = req.body;

    const message = await chatService.addMessageToSession(
      sessionId,
      userId,
      role,
      content
    );

    return res.status(201).json({
      success: true,
      message: "Message added successfully",
      data: message,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteChatSession = async (req, res) => {
  try {
    const userId = getUserId(req);
    const { sessionId } = req.params;

    await chatService.deleteChatSession(sessionId, userId);

    return res.status(200).json({
      success: true,
      message: "Chat session deleted successfully",
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createChatSession,
  getUserChatSessions,
  getChatSessionById,
  addMessageToSession,
  deleteChatSession,
};