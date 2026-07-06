import api from "../api/axios";

export const getDepartments = async () => {
  const response = await api.get("/departments");
  return response.data.data;
};

export const createDepartment = async (department) => {
  const response = await api.post("/departments", department);
  return response.data;
};

export const deleteDepartment = async (id) => {
  const response = await api.delete(`/departments/${id}`);
  return response.data;
};