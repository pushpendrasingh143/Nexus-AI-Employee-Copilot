import api from "../api/axios";

export const getDashboardStats = async () => {
  const stats = {
    employees: 0,
    departments: 0,
    documents: 0,
  };

  try {
    const employees = await api.get("/employees");
    stats.employees = employees.data.data.length;
  } catch (error) {
    console.log("Employees count unavailable");
  }

  try {
    const departments = await api.get("/departments");
    stats.departments = departments.data.data.length;
  } catch (error) {
    console.log("Departments count unavailable");
  }

  try {
    const documents = await api.get("/documents");
    stats.documents = documents.data.data.length;
  } catch (error) {
    console.log("Documents count unavailable");
  }

  return stats;
};