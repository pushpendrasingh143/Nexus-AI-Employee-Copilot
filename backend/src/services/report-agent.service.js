const aiService = require("./ai.service");
const analyticsService = require("./analytics.service");

const generateReport = async ({
  reportType,
  title,
  period,
  instructions,
  includeAnalytics,
}) => {
  if (!reportType) {
    throw new Error("Report type is required");
  }

  let analytics = null;

  if (includeAnalytics !== false) {
    analytics = await analyticsService.getDashboardAnalytics();
  }

  const report = await aiService.generateReport({
    reportType,
    title,
    period,
    instructions,
    analytics,
  });

  return {
    report,
    metadata: {
      reportType,
      title: title || "Nexus AI Report",
      period: period || null,
      includeAnalytics: includeAnalytics !== false,
    },
  };
};

module.exports = {
  generateReport,
};