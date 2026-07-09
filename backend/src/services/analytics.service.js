const analyticsRepository = require("../repositories/analytics.repository");

const getDashboardAnalytics = async () => {
  const [
    overview,
    recentDocuments,
    recentQuestions,
    recentChatSessions,
  ] = await Promise.all([
    analyticsRepository.getOverviewStats(),
    analyticsRepository.getRecentDocuments(),
    analyticsRepository.getRecentQuestions(),
    analyticsRepository.getRecentChatSessions(),
  ]);

  return {
    overview,
    recentDocuments,
    recentQuestions,
    recentChatSessions,
  };
};

module.exports = {
  getDashboardAnalytics,
};