const aiService = require("./ai.service");

const generateEmailDraft = async ({ prompt, recipient, tone, purpose }) => {
  if (!prompt) {
    throw new Error("Email prompt is required");
  }

  const draft = await aiService.generateEmailDraft({
    prompt,
    recipient,
    tone,
    purpose,
  });

  return {
    draft,
    metadata: {
      recipient: recipient || null,
      tone: tone || "Professional",
      purpose: purpose || "General",
    },
  };
};

module.exports = {
  generateEmailDraft,
};