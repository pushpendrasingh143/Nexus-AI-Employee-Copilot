const fs = require("fs");
const documentRepository = require("../repositories/document.repository");
const vectorRepository = require("../repositories/vector.repository");
const { extractTextFromPDF } = require("./pdf.service");
const { splitTextIntoChunks } = require("./chunk.service");
const aiService = require("./ai.service");

const MIN_RELEVANCE_SCORE = 0.15;

const uploadDocument = async (file, userId) => {
  const document = await documentRepository.createDocument({
    fileName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    uploadedBy: userId,
  });

  const text = await extractTextFromPDF(file.path);
  const chunks = await splitTextIntoChunks(text);

  for (const chunk of chunks) {
    const savedChunk = await documentRepository.createDocumentChunk({
      documentId: document.id,
      content: chunk.content,
      chunkIndex: chunk.chunkIndex,
    });

    const embedding = await aiService.generateEmbedding(chunk.content);
    await vectorRepository.updateChunkEmbedding(savedChunk.id, embedding);
  }

  return document;
};

const isSummaryQuestion = (query) => {
  const normalizedQuery = query.toLowerCase();

  return (
    normalizedQuery.includes("summary") ||
    normalizedQuery.includes("summarize") ||
    normalizedQuery.includes("summarise") ||
    normalizedQuery.includes("about this document") ||
    normalizedQuery.includes("about the document") ||
    normalizedQuery.includes("file ke bare") ||
    normalizedQuery.includes("document ke bare") ||
    normalizedQuery.includes("kya hai")
  );
};

const searchRelevantChunks = async (query, documentId = null) => {
  const embedding = await aiService.generateEmbedding(query);

  const chunks = await vectorRepository.searchSimilarChunks(
    embedding,
    8,
    documentId
  );

  if (!chunks.length) {
    return [];
  }

  if (isSummaryQuestion(query)) {
    return chunks;
  }

  const relevantChunks = chunks.filter(
    (chunk) => Number(chunk.score) >= MIN_RELEVANCE_SCORE
  );

  return relevantChunks.length ? relevantChunks : chunks.slice(0, 3);
};

const getAllDocuments = async () => {
  return documentRepository.getAllDocuments();
};

const getDocumentById = async (id) => {
  const document = await documentRepository.getDocumentById(id);

  if (!document) {
    throw new Error("Document not found");
  }

  return document;
};

const deleteDocument = async (id) => {
  const document = await getDocumentById(id);

  await documentRepository.deleteDocument(id);

  if (document.filePath && fs.existsSync(document.filePath)) {
    fs.unlinkSync(document.filePath);
  }

  return document;
};

module.exports = {
  uploadDocument,
  searchRelevantChunks,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
};