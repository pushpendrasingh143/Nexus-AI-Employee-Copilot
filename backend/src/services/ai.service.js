const llm = require("../config/langchain");
const gemini = require("../config/gemini");
const { SYSTEM_PROMPT } = require("../prompts/ai.prompt");
const chatHistory = require("../memory/chat.memory");

class AIService {
  async chat(message) {
    try {
      chatHistory.push(`User: ${message}`);

      const prompt = `
${SYSTEM_PROMPT}

Conversation History:
${chatHistory.join("\n")}

Assistant:
`;

      const response = await llm.invoke(prompt);

      chatHistory.push(`Assistant: ${response.content}`);

      return response.content;
    } catch (error) {
      console.error("LangChain Error:", error.message);
      throw new Error("Failed to generate AI response.");
    }
  }

  async generateEmbedding(text) {
    try {
      const response = await gemini.models.embedContent({
        model: "gemini-embedding-001",
        contents: text,
        config: {
          outputDimensionality: 768,
        },
      });

      return response.embeddings[0].values;
    } catch (error) {
      console.error("Gemini Embedding Error:", error.message);
      throw new Error("Failed to generate embedding.");
    }
  }

  async answerWithContext(question, chunks) {
    try {
      const context = chunks.map((chunk) => chunk.content).join("\n\n");

      const recentHistory = chatHistory.slice(-6).join("\n");

      const prompt = `
You are Nexus AI Employee Copilot.

Answer the user's question using ONLY:
1. Provided document context
2. Recent conversation history

If the answer is not available in the document context or recent conversation history, say:
"I could not find this information in the uploaded documents."

Document Context:
${context}

Recent Conversation History:
${recentHistory}

User Question:
${question}

Answer:
`;

      const response = await llm.invoke(prompt);

      chatHistory.push(`User: ${question}`);
      chatHistory.push(`Assistant: ${response.content}`);

      return response.content;
    } catch (error) {
      console.error("RAG Answer Error:", error.message);
      throw new Error("Failed to generate RAG answer.");
    }
  }
}

module.exports = new AIService();