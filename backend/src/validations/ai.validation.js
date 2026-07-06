const { z } = require("zod");

const searchSchema = z.object({
  query: z.string().min(1),
  documentId: z.string().optional(),
});

const askSchema = z.object({
  question: z.string().min(1),
  documentId: z.string().optional(),
});

module.exports = {
  searchSchema,
  askSchema,
};