const aiService = require("./ai.service");
const documentService = require("./document.service");

const searchKnowledge = async ({ question, documentId }) => {
  if (!question) {
    throw new Error("Question is required");
  }

  const chunks = await documentService.searchRelevantChunks(question, documentId);

  if (!chunks.length) {
    return {
      answer: "I could not find this information in the uploaded enterprise documents.",
      sources: [],
    };
  }

  const answer = await aiService.answerKnowledgeQuestion(question, chunks);

  const sources = chunks.map((chunk) => ({
    documentId: chunk.documentId,
    documentName: chunk.sourceName || chunk.document?.fileName || "Unknown Document",
    chunkIndex: chunk.chunkIndex,
    score: Number(chunk.score),
    source: `${chunk.sourceName || chunk.document?.fileName || "Unknown Document"} - Chunk ${chunk.chunkIndex}`,
    preview:
      chunk.content.length > 150
        ? `${chunk.content.substring(0, 150)}...`
        : chunk.content,
  }));

  return {
    answer,
    sources,
  };
};

module.exports = {
  searchKnowledge,
};