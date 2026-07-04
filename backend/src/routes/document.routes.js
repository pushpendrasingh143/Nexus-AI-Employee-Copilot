const express = require("express");

const documentController = require("../controllers/document.controller");
const authMiddleware = require("../middleware/auth.middleware");
const roleMiddleware = require("../middleware/role.middleware");
const upload = require("../config/multer");

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin", "hr"),
  upload.single("document"),
  documentController.uploadDocument
);

router.get(
  "/",
  authMiddleware,
  documentController.getAllDocuments
);

router.get(
  "/:id",
  authMiddleware,
  documentController.getDocumentById
);

module.exports = router;