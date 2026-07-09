const aiService = require("./ai.service");

const generateTaskPlan = async ({ title, description, priority, dueDate }) => {
  if (!title) {
    throw new Error("Task title is required");
  }

  const plan = await aiService.generateTaskPlan({
    title,
    description,
    priority,
    dueDate,
  });

  return {
    plan,
    metadata: {
      title,
      description: description || null,
      priority: priority || "medium",
      dueDate: dueDate || null,
    },
  };
};

module.exports = {
  generateTaskPlan,
};