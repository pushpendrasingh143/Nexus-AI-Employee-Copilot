const documentService = require("../services/document.service");

const uploadDocument = async (req, res, next) => {
  try {
    const document = await documentService.uploadDocument(
      req.file,
      req.user.id
    );

    res.status(201).json({
      success: true,
      message: "Document uploaded successfully",
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

const getAllDocuments = async (req, res, next) => {
  try {
    const documents = await documentService.getAllDocuments();

    res.status(200).json({
      success: true,
      data: documents,
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentById = async (req, res, next) => {
  try {
    const document = await documentService.getDocumentById(req.params.id);

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    next(error);
  }
};

const getDocumentSummary = async (req, res, next) => {
  try {
    const summary = await documentService.summarizeDocument(req.params.id);

    res.status(200).json({
      success: true,
      message: "Document summary generated successfully",
      data: summary,
    });
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id);

    res.status(200).json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  getDocumentSummary,
  deleteDocument,
};