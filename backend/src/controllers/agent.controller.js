const hrAgentService = require("../services/hr-agent.service");
const emailAgentService = require("../services/email-agent.service");
const meetingAgentService = require("../services/meeting-agent.service");
const chatService = require("../services/chat.service");
const taskAgentService = require("../services/task-agent.service");
const reportAgentService = require("../services/report-agent.service");
const knowledgeAgentService = require("../services/knowledge-agent.service");
const voiceAgentService = require("../services/voice-agent.service");

const getUserId = (req) => {
  return req.user?.id || req.user?.userId || req.userId;
};

const createSessionTitle = (text, fallbackTitle) => {
  if (!text) return fallbackTitle;

  return text.length > 50 ? `${text.substring(0, 50)}...` : text;
};

const getOrCreateChatSession = async (
  userId,
  sessionId,
  titleSource,
  fallbackTitle
) => {
  if (sessionId) {
    return chatService.getChatSessionById(sessionId, userId);
  }

  return chatService.createChatSession(
    userId,
    createSessionTitle(titleSource, fallbackTitle)
  );
};

const askHrAgent = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { question, documentId, sessionId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      question,
      "HR Agent Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[HR Agent] ${question}`
    );

    const result = await hrAgentService.askHrAgent(question, documentId);

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.answer
    );

    return res.status(200).json({
      success: true,
      agent: "HR Agent",
      sessionId: session.id,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    next(error);
  }
};

const generateEmailDraft = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { prompt, recipient, tone, purpose, sessionId } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Email prompt is required",
      });
    }

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      prompt,
      "Email Agent Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Email Agent] ${prompt}`
    );

    const result = await emailAgentService.generateEmailDraft({
      prompt,
      recipient,
      tone,
      purpose,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.draft
    );

    return res.status(200).json({
      success: true,
      agent: "Email Agent",
      sessionId: session.id,
      draft: result.draft,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};

const generateMeetingSchedule = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, date, time, participants, purpose, sessionId } = req.body;

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      title,
      "Meeting Scheduler Agent Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Meeting Scheduler Agent] ${title}`
    );

    const result = await meetingAgentService.generateMeetingSchedule({
      title,
      date,
      time,
      participants,
      purpose,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.schedule
    );

    return res.status(200).json({
      success: true,
      agent: "Meeting Scheduler Agent",
      sessionId: session.id,
      schedule: result.schedule,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};
const generateTaskPlan = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { title, description, priority, dueDate, sessionId } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      title,
      "Task Manager Agent Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Task Manager Agent] ${title}`
    );

    const result = await taskAgentService.generateTaskPlan({
      title,
      description,
      priority,
      dueDate,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.plan
    );

    return res.status(200).json({
      success: true,
      agent: "Task Manager Agent",
      sessionId: session.id,
      plan: result.plan,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};
const generateReport = async (req, res, next) => {
  try {
    const userId = getUserId(req);

    const {
      reportType,
      title,
      period,
      instructions,
      includeAnalytics,
      sessionId,
    } = req.body;

    if (!reportType) {
      return res.status(400).json({
        success: false,
        message: "Report type is required",
      });
    }

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      title || reportType,
      "Report Generator Agent Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Report Generator Agent] ${title || reportType}`
    );

    const result = await reportAgentService.generateReport({
      reportType,
      title,
      period,
      instructions,
      includeAnalytics,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.report
    );

    return res.status(200).json({
      success: true,
      agent: "Report Generator Agent",
      sessionId: session.id,
      report: result.report,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};

const searchKnowledge = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { question, documentId, sessionId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      question,
      "Knowledge Agent Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Knowledge Agent] ${question}`
    );

    const result = await knowledgeAgentService.searchKnowledge({
      question,
      documentId,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.answer
    );

    return res.status(200).json({
      success: true,
      agent: "Knowledge Agent",
      sessionId: session.id,
      answer: result.answer,
      sources: result.sources,
    });
  } catch (error) {
    next(error);
  }
};

const processVoiceCommand = async (req, res, next) => {
  try {
    const userId = getUserId(req);
    const { transcript, intent, sessionId } = req.body;

    if (!transcript) {
      return res.status(400).json({
        success: false,
        message: "Voice transcript is required",
      });
    }

    const session = await getOrCreateChatSession(
      userId,
      sessionId,
      transcript,
      "Voice Assistant Chat"
    );

    await chatService.addMessageToSession(
      session.id,
      userId,
      "user",
      `[Voice Assistant] ${transcript}`
    );

    const result = await voiceAgentService.processVoiceCommand({
      transcript,
      intent,
    });

    await chatService.addMessageToSession(
      session.id,
      userId,
      "assistant",
      result.response
    );

    return res.status(200).json({
      success: true,
      agent: "Voice Assistant",
      sessionId: session.id,
      response: result.response,
      metadata: result.metadata,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  askHrAgent,
  generateEmailDraft,
  generateMeetingSchedule,
  generateTaskPlan,
  generateReport,
  searchKnowledge,
  processVoiceCommand,
};
