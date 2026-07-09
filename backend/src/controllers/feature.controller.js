const featureService = require("../services/feature.service");

const getFeatures = async (req, res, next) => {
  try {
    const features = featureService.getFeatureRegistry();

    res.status(200).json({
      success: true,
      message: "Project features fetched successfully",
      data: features,
    });
  } catch (error) {
    next(error);
  }
};

const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = featureService.getFinalRoadmap();

    res.status(200).json({
      success: true,
      message: "Project roadmap fetched successfully",
      data: roadmap,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFeatures,
  getRoadmap,
};