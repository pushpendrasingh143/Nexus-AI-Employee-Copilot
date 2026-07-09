const analyticsService = require("../services/analytics.service");

const getDashboardAnalytics = async (req, res, next) => {
  try {
    const analytics = await analyticsService.getDashboardAnalytics();

    res.status(200).json({
      success: true,
      message: "Dashboard analytics fetched successfully",
      data: analytics,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardAnalytics,
};