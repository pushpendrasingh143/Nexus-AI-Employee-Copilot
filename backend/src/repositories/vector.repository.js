const prisma = require("../config/prisma");

const toVector = (embedding) => `[${embedding.join(",")}]`;

const updateChunkEmbedding = async (chunkId, embedding) => {
  const vector = toVector(embedding);

  return prisma.$executeRaw`
    UPDATE "DocumentChunk"
    SET embedding = ${vector}::vector,
        "updatedAt" = NOW()
    WHERE id = ${chunkId}
  `;
};

const searchSimilarChunks = async (
  embedding,
  limit = 5,
  documentId = null
) => {
  const vector = toVector(embedding);

  if (documentId) {
    return prisma.$queryRaw`
      SELECT
        id,
        "documentId",
        content,
        "chunkIndex",
        1 - (embedding <=> ${vector}::vector) AS score
      FROM "DocumentChunk"
      WHERE
        embedding IS NOT NULL
        AND "documentId" = ${documentId}
      ORDER BY embedding <=> ${vector}::vector
      LIMIT ${limit}
    `;
  }

  return prisma.$queryRaw`
    SELECT
      id,
      "documentId",
      content,
      "chunkIndex",
      1 - (embedding <=> ${vector}::vector) AS score
    FROM "DocumentChunk"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> ${vector}::vector
    LIMIT ${limit}
  `;
};

module.exports = {
  updateChunkEmbedding,
  searchSimilarChunks,
};