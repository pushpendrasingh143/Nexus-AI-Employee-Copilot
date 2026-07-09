const aiService = require("../services/ai.service");
const documentService = require("../services/document.service");
const chatService = require("../services/chat.service");

const getUserId = (req) => {
  return req.user?.id || req.user?.userId || req.userId;
};

const createSessionTitle = (text) => {
  if (!text) return "New Chat";

  return text.length > 50 ? `${text.substring(0, 50)}...` : text;
};

const getOrCreateChatSession = async (userId, sessionId, titleSource) => {
  if (sessionId) {
    return chatService.getChatSessionById(sessionId, userId);
  }

  return chatService.createChatSession(userId, createSessionTitle(titleSource));
};

const chat = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const session = await getOrCreateChatSession(userId, sessionId, message);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      message
    );

    const response = await aiService.chat(message);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      response
    );

    return res.status(200).json({
      success: true,
      sessionId: session.id,
      response,
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { query, documentId } = req.body;

    const chunks = await documentService.searchRelevantChunks(query, documentId);

    return res.status(200).json({
      success: true,
      count: chunks.length,
      results: chunks,
    });
  } catch (error) {
    next(error);
  }
};

const ask = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { question, documentId, sessionId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const session = await getOrCreateChatSession(userId, sessionId, question);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      question
    );

    const chunks = await documentService.searchRelevantChunks(
      question,
      documentId
    );

    if (!chunks.length) {
      const fallbackAnswer =
        "I could not find this information in the uploaded documents.";

      await chatService.addMessageToSession(
        session.id,
        userId,
        "assistant",
        fallbackAnswer
      );

      return res.status(200).json({
        success: true,
        sessionId: session.id,
        answer: fallbackAnswer,
        sources: [],
      });
    }

    const answer = await aiService.answerWithContext(question, chunks);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      answer
    );

    const sources = chunks.map((chunk) => ({
  documentId: chunk.documentId,
  documentName: chunk.sourceName || chunk.document?.fileName || "Unknown Document",
  chunkIndex: chunk.chunkIndex,
  score: Number(chunk.score),
  source: `${chunk.sourceName || chunk.document?.fileName || "Unknown Document"} - Chunk ${chunk.chunkIndex}`,
  preview:
    chunk.content.length > 120
      ? `${chunk.content.substring(0, 120)}...`
      : chunk.content,
}));
    return res.status(200).json({
      success: true,
      sessionId: session.id,
      answer,
      sources,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  search,
  ask,
};