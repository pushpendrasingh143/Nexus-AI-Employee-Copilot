const aiService = require("./ai.service");
const documentService = require("./document.service");

const askHrAgent = async (question, documentId = null) => {
  if (!question) {
    throw new Error("Question is required");
  }

  const chunks = await documentService.searchRelevantChunks(question, documentId);

  if (!chunks.length) {
    return {
      answer: "I could not find this HR information in the uploaded company documents.",
      sources: [],
    };
  }

  const answer = await aiService.answerHrQuestion(question, chunks);

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

  return {
    answer,
    sources,
  };
};

module.exports = {
  askHrAgent,
};