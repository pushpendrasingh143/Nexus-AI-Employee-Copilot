const aiService = require("./ai.service");

const generateMicrosoft365Action = async ({
  actionType,
  prompt,
  recipient,
  date,
  time,
  participants,
  channel,
}) => {
  if (!prompt) {
    throw new Error("Prompt is required");
  }

  const result = await aiService.generateMicrosoft365Action({
    actionType,
    prompt,
    recipient,
    date,
    time,
    participants: Array.isArray(participants) ? participants : [],
    channel,
  });

  return {
    result,
    metadata: {
      provider: "Microsoft 365",
      mode: "demo",
      actionType: actionType || "general",
      recipient: recipient || null,
      date: date || null,
      time: time || null,
      participants: Array.isArray(participants) ? participants : [],
      channel: channel || null,
      realExecution: false,
    },
  };
};

module.exports = {
  generateMicrosoft365Action,
};