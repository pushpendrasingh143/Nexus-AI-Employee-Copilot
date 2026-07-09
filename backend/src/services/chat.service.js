const chatRepository = require("../repositories/chat.repository");

const createChatSession = async (userId, title) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return chatRepository.createChatSession({
    userId,
    title: title || "New Chat",
  });
};

const getUserChatSessions = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return chatRepository.getUserChatSessions(userId);
};

const getChatSessionById = async (sessionId, userId) => {
  if (!sessionId) {
    throw new Error("Chat session ID is required");
  }

  const session = await chatRepository.getChatSessionById(sessionId, userId);

  if (!session) {
    throw new Error("Chat session not found");
  }

  return session;
};

const addMessageToSession = async (sessionId, userId, role, content) => {
  if (!sessionId) {
    throw new Error("Chat session ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  if (!role) {
    throw new Error("Message role is required");
  }

  if (!content) {
    throw new Error("Message content is required");
  }

  const allowedRoles = ["user", "assistant", "system"];

  if (!allowedRoles.includes(role)) {
    throw new Error("Invalid message role");
  }

  const session = await chatRepository.getChatSessionById(sessionId, userId);

  if (!session) {
    throw new Error("Chat session not found");
  }

  return chatRepository.addMessageToSession({
    sessionId,
    role,
    content,
  });
};

const deleteChatSession = async (sessionId, userId) => {
  if (!sessionId) {
    throw new Error("Chat session ID is required");
  }

  if (!userId) {
    throw new Error("User ID is required");
  }

  const session = await chatRepository.getChatSessionById(sessionId, userId);

  if (!session) {
    throw new Error("Chat session not found");
  }

  return chatRepository.deleteChatSession(sessionId);
};

module.exports = {
  createChatSession,
  getUserChatSessions,
  getChatSessionById,
  addMessageToSession,
  deleteChatSession,
};