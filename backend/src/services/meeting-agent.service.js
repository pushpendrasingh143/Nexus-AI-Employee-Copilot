const aiService = require("./ai.service");

const generateMeetingSchedule = async ({
  title,
  date,
  time,
  participants,
  purpose,
}) => {
  if (!title) {
    throw new Error("Meeting title is required");
  }

  if (!date) {
    throw new Error("Meeting date is required");
  }

  if (!time) {
    throw new Error("Meeting time is required");
  }

  const schedule = await aiService.generateMeetingSchedule({
    title,
    date,
    time,
    participants: Array.isArray(participants) ? participants : [],
    purpose,
  });

  return {
    schedule,
    metadata: {
      title,
      date,
      time,
      participants: Array.isArray(participants) ? participants : [],
      purpose: purpose || "General meeting",
    },
  };
};

module.exports = {
  generateMeetingSchedule,
};