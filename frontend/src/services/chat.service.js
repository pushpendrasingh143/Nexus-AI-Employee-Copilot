import api from "../api/axios";

export const getChatSessions = async () => {
  const response = await api.get("/chats");
  return response.data.data || [];
};

export const getChatSessionById = async (sessionId) => {
  const response = await api.get(`/chats/${sessionId}`);
  return response.data.data;
};

export const deleteChatSession = async (sessionId) => {
  const response = await api.delete(`/chats/${sessionId}`);
  return response.data;
};