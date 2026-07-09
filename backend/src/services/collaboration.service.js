const aiService = require("./ai.service");

const generateCollaborationAction = async ({
  platform,
  actionType,
  prompt,
  channel,
  recipients,
  priority,
}) => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const result = await aiService.generateCollaborationAction({
    platform,
    actionType,
    prompt,
    channel,
    recipients: Array.isArray(recipients) ? recipients : [],
    priority,
  });

  return {
    result,
    metadata: {
      provider: "Slack & Microsoft Teams",
      mode: "demo",
      platform: platform || "Both",
      actionType: actionType || "general",
      channel: channel || null,
      recipients: Array.isArray(recipients) ? recipients : [],
      priority: priority || "medium",
      realExecution: false,
    },
  };
};

module.exports = {
  generateCollaborationAction,
};