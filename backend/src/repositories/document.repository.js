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

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  createDocumentChunk,
  deleteDocument,
};