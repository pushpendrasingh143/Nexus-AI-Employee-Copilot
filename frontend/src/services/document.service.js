import api from "../api/axios";

export const getDocuments = async () => {
  const response = await api.get("/documents");
  return response.data.data;
};

export const uploadDocument = async (formData) => {
  const response = await api.post("/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const deleteDocument = async (id) => {
  const response = await api.delete(`/documents/${id}`);
  return response.data;
};