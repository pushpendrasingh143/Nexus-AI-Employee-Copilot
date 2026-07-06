const express = require("express");

const router = express.Router();

const aiController = require("../controllers/ai.controller");
const authenticate = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");

const {
  searchSchema,
  askSchema,
} = require("../validations/ai.validation");

router.post("/chat", authenticate, aiController.chat);

router.post(
  "/search",
  authenticate,
  validate(searchSchema),
  aiController.search
);

router.post(
  "/ask",
  authenticate,
  validate(askSchema),
  aiController.ask
);

module.exports = router;