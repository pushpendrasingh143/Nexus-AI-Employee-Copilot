const prisma = require("../config/prisma");

const createTask = (data) => {
  return prisma.task.create({
    data,
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
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

const getAllTasks = () => {
  return prisma.task.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      assignedTo: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
      createdBy: {
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

const getMyTasks = (userId) => {
  return prisma.task.findMany({
    where: {
      assignedToId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      createdBy: {
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

const getTaskById = (id) => {
  return prisma.task.findUnique({
    where: {
      id,
    },
  });
};

const updateTaskStatus = (id, status) => {
  return prisma.task.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
};

const deleteTask = (id) => {
  return prisma.task.delete({
    where: {
      id,
    },
  });
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  getTaskById,
  updateTaskStatus,
  deleteTask,
};