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

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
};