const prisma = require("../config/prisma");

const createDocument = (data) => {
  return prisma.document.create({
    data,
  });
};

const getAllDocuments = () => {
  return prisma.document.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getDocumentById = (id) => {
  return prisma.document.findUnique({
    where: { id },
  });
};

const getDocumentsByIds = (ids) => {
  return prisma.document.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    select: {
      id: true,
      fileName: true,
      fileType: true,
      uploadedBy: true,
      createdAt: true,
    },
  });
};

const createDocumentChunk = (chunk) => {
  return prisma.documentChunk.create({
    data: chunk,
  });
};

const deleteDocument = (id) => {
  return prisma.document.delete({
    where: { id },
  });
};

const getDocumentChunksByDocumentId = (documentId) => {
  return prisma.documentChunk.findMany({
    where: {
      documentId,
    },
    orderBy: {
      chunkIndex: "asc",
    },
    select: {
      id: true,
      documentId: true,
      content: true,
      chunkIndex: true,
      createdAt: true,
    },
  });
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentsByIds,
  getDocumentChunksByDocumentId,
  createDocumentChunk,
  deleteDocument,
};