const documentRepository = require("../repositories/document.repository");

const uploadDocument = async (file, userId) => {
  return documentRepository.createDocument({
    fileName: file.originalname,
    filePath: file.path,
    fileType: file.mimetype,
    uploadedBy: userId,
  });
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

module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
};