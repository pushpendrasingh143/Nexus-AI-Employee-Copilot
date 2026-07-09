const prisma = require("../config/prisma");

const createChatSession = async (data) => {
  return prisma.chatSession.create({
    data,
    include: {
      messages: true,
    },
  });
};

const getUserChatSessions = async (userId) => {
  return prisma.chatSession.findMany({
    where: {
      userId,
    },
    orderBy: {
      updatedAt: "desc",
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

const getChatSessionById = async (sessionId, userId) => {
  return prisma.chatSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
    include: {
      messages: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });
};

const addMessageToSession = async (data) => {
  return prisma.$transaction(async (tx) => {
    const message = await tx.chatMessage.create({
      data,
    });

    await tx.chatSession.update({
      where: {
        id: data.sessionId,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    return message;
  });
};

const deleteChatSession = async (sessionId) => {
  return prisma.chatSession.delete({
    where: {
      id: sessionId,
    },
  });
};

module.exports = {
  createChatSession,
  getUserChatSessions,
  getChatSessionById,
  addMessageToSession,
  deleteChatSession,
};