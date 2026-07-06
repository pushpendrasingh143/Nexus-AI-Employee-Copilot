const aiService = require("../services/ai.service");
const documentService = require("../services/document.service");

const chat = async (req, res, next) => {
  try {
    const { message } = req.body;

    const response = await aiService.chat(message);

    res.status(200).json({
      success: true,
      response,
    });
  } catch (error) {
    next(error);
  }
};

const search = async (req, res, next) => {
  try {
    const { query, documentId } = req.body;

    const chunks = await documentService.searchRelevantChunks(query, documentId);

    res.status(200).json({
      success: true,
      count: chunks.length,
      results: chunks,
    });
  } catch (error) {
    next(error);
  }
};

const ask = async (req, res, next) => {
  try {
    const { question, documentId } = req.body;

    const chunks = await documentService.searchRelevantChunks(question, documentId);

    if (!chunks.length) {
      return res.status(200).json({
        success: true,
        answer: "I could not find this information in the uploaded documents.",
        sources: [],
      });
    }

    const answer = await aiService.answerWithContext(question, chunks);

    const sources = chunks.map((chunk) => ({
      documentId: chunk.documentId,
      chunkIndex: chunk.chunkIndex,
      score: chunk.score,
      preview:
        chunk.content.length > 120
          ? `${chunk.content.substring(0, 120)}...`
          : chunk.content,
    }));

    res.status(200).json({
      success: true,
      answer,
      sources,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  search,
  ask,
};