const prisma = require("../config/prisma");

const getDashboardStats = async () => {
  const [
    employees,
    departments,
    documents,
    aiRequests,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.document.count(),

    // Har user message ko ek AI request maana jayega
    prisma.chatMessage.count({
      where: {
        role: "user",
      },
    }),
  ]);

  return {
    employees,
    departments,
    documents,
    aiRequests,
  };
};

module.exports = {
  getDashboardStats,
};