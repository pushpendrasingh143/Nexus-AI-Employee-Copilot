import api from "../api/axios";

export const chatWithAI = async (message) => {
  const response = await api.post("/ai/chat", {
    message,
  });

  return response.data.response;
};

export const askDocumentAI = async (question) => {
  const response = await api.post("/ai/ask", {
    question,
  });

  return response.data;
};