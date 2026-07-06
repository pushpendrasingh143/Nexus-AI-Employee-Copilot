const dashboardRepository = require("../repositories/dashboard.repository");

const getDashboardStats = async () => {
  return dashboardRepository.getDashboardStats();
};

module.exports = {
  getDashboardStats,
};