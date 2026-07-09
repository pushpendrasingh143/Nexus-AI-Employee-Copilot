const aiService = require("./ai.service");

const generateWorkspaceAction = async ({
  actionType,
  prompt,
  recipient,
  date,
  time,
  participants,
}) => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const result = await aiService.generateGoogleWorkspaceAction({
    actionType,
    prompt,
    recipient,
    date,
    time,
    participants: Array.isArray(participants) ? participants : [],
  });

  return {
    result,
    metadata: {
      provider: "Google Workspace",
      mode: "demo",
      actionType: actionType || "general",
      recipient: recipient || null,
      date: date || null,
      time: time || null,
      participants: Array.isArray(participants) ? participants : [],
      realExecution: false,
    },
  };
};

const getIntegrationStatus = async () => {
  return {
    googleWorkspace: {
      provider: "Google Workspace",
      status: "demo_ready",
      realOAuthConnected: false,
      supportedApps: ["Gmail", "Google Calendar", "Google Drive", "Google Docs"],
      supportedActions: [
        "Gmail draft generation",
        "Calendar event planning",
        "Drive search planning",
        "Docs summary planning",
      ],
    },
    microsoft365: {
      provider: "Microsoft 365",
      status: "planned",
      realOAuthConnected: false,
      supportedApps: ["Outlook", "Teams", "OneDrive", "Word"],
    },
    slackTeams: {
      provider: "Slack & Microsoft Teams",
      status: "planned",
      realOAuthConnected: false,
      supportedActions: ["Bot assistant", "Notifications", "Task reminders"],
    },
  };
};

module.exports = {
  generateWorkspaceAction,
  getIntegrationStatus,
};