const aiService = require("./ai.service");

const processVoiceCommand = async ({ transcript, intent }) => {
  if (!transcript) {
    throw new Error("Voice transcript is required");
  }

  const response = await aiService.processVoiceCommand({
    transcript,
    intent,
  });

  return {
    response,
    metadata: {
      transcript,
      intent: intent || "general_assistant",
    },
  };
};

module.exports = {
  processVoiceCommand,
};