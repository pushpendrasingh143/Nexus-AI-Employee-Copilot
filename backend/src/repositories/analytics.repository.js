const prisma = require("../config/prisma");

const getOverviewStats = async () => {
  const [
    totalEmployees,
    totalDepartments,
    totalDocuments,
    totalChatSessions,
    totalMessages,
    totalUserQuestions,
    totalAiResponses,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.department.count(),
    prisma.document.count(),
    prisma.chatSession.count(),
    prisma.chatMessage.count(),
    prisma.chatMessage.count({
      where: { role: "user" },
    }),
    prisma.chatMessage.count({
      where: { role: "assistant" },
    }),
  ]);

  return {
    totalEmployees,
    totalDepartments,
    totalDocuments,
    totalChatSessions,
    totalMessages,
    totalUserQuestions,
    totalAiResponses,
  };
};

const getRecentDocuments = async () => {
  return prisma.document.findMany({
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      fileName: true,
      fileType: true,
      uploadedBy: true,
      createdAt: true,
    },
  });
};

const getRecentQuestions = async () => {
  return prisma.chatMessage.findMany({
    where: {
      role: "user",
    },
    take: 5,
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      content: true,
      sessionId: true,
      createdAt: true,
    },
  });
};

const getRecentChatSessions = async () => {
  return prisma.chatSession.findMany({
    take: 5,
    orderBy: {
      updatedAt: "desc",
    },
    select: {
      id: true,
      title: true,
      userId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  });
};

module.exports = {
  getOverviewStats,
  getRecentDocuments,
  getRecentQuestions,
  getRecentChatSessions,
};