const { RecursiveCharacterTextSplitter } = require("@langchain/textsplitters");

const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});

const splitTextIntoChunks = async (text) => {
  if (!text || typeof text !== "string") {
    throw new Error("Valid text is required.");
  }

  const chunks = await textSplitter.createDocuments([text]);

  return chunks.map((chunk, index) => ({
    content: chunk.pageContent,
    chunkIndex: index,
  }));
};

module.exports = {
  splitTextIntoChunks,
};