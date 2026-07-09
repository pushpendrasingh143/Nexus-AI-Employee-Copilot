const taskRepository = require("../repositories/task.repository");

const allowedStatus = ["pending", "in_progress", "completed", "cancelled"];
const allowedPriority = ["low", "medium", "high", "urgent"];

const createTask = async ({
  title,
  description,
  priority,
  dueDate,
  assignedToId,
  createdById,
}) => {
  if (!title) {
    throw new Error("Task title is required");
  }

  if (!createdById) {
    throw new Error("Creator user ID is required");
  }

  const finalPriority = priority || "medium";

  if (!allowedPriority.includes(finalPriority)) {
    throw new Error("Invalid task priority");
  }

  return taskRepository.createTask({
    title,
    description: description || null,
    priority: finalPriority,
    dueDate: dueDate ? new Date(dueDate) : null,
    assignedToId: assignedToId || null,
    createdById,
  });
};

const getAllTasks = async () => {
  return taskRepository.getAllTasks();
};

const getMyTasks = async (userId) => {
  if (!userId) {
    throw new Error("User ID is required");
  }

  return taskRepository.getMyTasks(userId);
};

const updateTaskStatus = async (id, status) => {
  if (!id) {
    throw new Error("Task ID is required");
  }

  if (!allowedStatus.includes(status)) {
    throw new Error("Invalid task status");
  }

  const task = await taskRepository.getTaskById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  return taskRepository.updateTaskStatus(id, status);
};

const deleteTask = async (id) => {
  const task = await taskRepository.getTaskById(id);

  if (!task) {
    throw new Error("Task not found");
  }

  return taskRepository.deleteTask(id);
};

module.exports = {
  createTask,
  getAllTasks,
  getMyTasks,
  updateTaskStatus,
  deleteTask,
};