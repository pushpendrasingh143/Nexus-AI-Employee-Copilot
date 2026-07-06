const prisma = require("../config/prisma");

const getDashboardStats = async () => {
  const [
    totalEmployees,
    totalDepartments,
    totalDocuments,
    totalChunks,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.document.count(),
    prisma.documentChunk.count(),
  ]);

  return {
    totalEmployees,
    totalDepartments,
    totalDocuments,
    totalChunks,
  };
};

module.exports = {
  getDashboardStats,
};