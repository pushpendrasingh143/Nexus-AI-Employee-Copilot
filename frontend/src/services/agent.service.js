import api from "../api/axios";

export const askHrAgent = (data) => {
  return api.post("/agents/hr/ask", data);
};

export const generateEmailDraft = (data) => {
  return api.post("/agents/email/generate", data);
};

export const generateMeetingSchedule = (data) => {
  return api.post("/agents/meeting/schedule", data);
};

export const generateTaskPlan = (data) => {
  return api.post("/agents/task/generate", data);
};

export const generateReport = (data) => {
  return api.post("/agents/report/generate", data);
};

export const searchKnowledge = (data) => {
  return api.post("/agents/knowledge/search", data);
};

export const processVoiceCommand = (data) => {
  return api.post("/agents/voice/process", data);
};

export const googleWorkspaceAction = (data) => {
  return api.post("/integrations/google/workspace/action", data);
};

export const microsoft365Action = (data) => {
  return api.post("/integrations/microsoft365/action", data);
};

export const collaborationAction = (data) => {
  return api.post("/integrations/collaboration/action", data);
};

export const getSystemStatus = () => {
  return api.get("/system/status");
};

export const getFeatureRegistry = () => {
  return api.get("/features");
};