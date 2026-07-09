const express = require("express");

const featureController = require("../controllers/feature.controller");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, featureController.getFeatures);

router.get("/roadmap", authMiddleware, featureController.getRoadmap);

module.exports = router;