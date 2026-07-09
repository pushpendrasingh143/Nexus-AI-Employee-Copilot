const collaborationService = require("../services/collaboration.service");
const microsoft365Service = require("../services/microsoft365.service");
const googleWorkspaceService = require("../services/google-workspace.service");
const chatService = require("../services/chat.service");

const getUserId = (req) => {
  return req.user?.id || req.user?.userId || req.userId;
};

const createSessionTitle = (text) => {
  if (!text) return "Google Workspace Integration";

  return text.length > 50 ? `${text.substring(0, 50)}...` : text;
};

const getOrCreateChatSession = async (userId, sessionId, titleSource) => {
  if (sessionId) {
    return chatService.getChatSessionById(sessionId, userId);
  }

  return chatService.createChatSession(userId, createSessionTitle(titleSource));
};

const generateGoogleWorkspaceAction = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const {
      actionType,
      prompt,
      recipient,
      date,
      time,
      participants,
      sessionId,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const session = await getOrCreateChatSession(userId, sessionId, prompt);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Google Workspace Integration] ${prompt}`
    );

    const result = await googleWorkspaceService.generateWorkspaceAction({
      actionType,
      prompt,
      recipient,
      date,
      time,
      participants,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.result
    );

    return res.status(200).json({
      success: true,
      integration: "Google Workspace",
      sessionId: session.id,
      output: result.result,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};

const getIntegrationStatus = async (req, res, next) => {
  try {
    const status = await googleWorkspaceService.getIntegrationStatus();

    return res.status(200).json({
      success: true,
      message: "Integration status fetched successfully",
      data: status,
    });
  } catch (error) {
    next(error);
  }
};

const generateMicrosoft365Action = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const {
      actionType,
      prompt,
      recipient,
      date,
      time,
      participants,
      channel,
      sessionId,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const session = await getOrCreateChatSession(userId, sessionId, prompt);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Microsoft 365 Integration] ${prompt}`
    );

    const result = await microsoft365Service.generateMicrosoft365Action({
      actionType,
      prompt,
      recipient,
      date,
      time,
      participants,
      channel,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.result
    );

    return res.status(200).json({
      success: true,
      integration: "Microsoft 365",
      sessionId: session.id,
      output: result.result,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }

};

const generateCollaborationAction = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const {
      platform,
      actionType,
      prompt,
      channel,
      recipients,
      priority,
      sessionId,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const session = await getOrCreateChatSession(userId, sessionId, prompt);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Slack & Teams Integration] ${prompt}`
    );

    const result = await collaborationService.generateCollaborationAction({
      platform,
      actionType,
      prompt,
      channel,
      recipients,
      priority,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.result
    );

    return res.status(200).json({
      success: true,
      integration: "Slack & Microsoft Teams",
      sessionId: session.id,
      output: result.result,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateGoogleWorkspaceAction,
  generateMicrosoft365Action,
  generateCollaborationAction,
  getIntegrationStatus,
};