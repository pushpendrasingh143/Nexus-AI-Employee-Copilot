const departmentRepository = require("../repositories/department.repository");

const createDepartment = async (data) => {
  const existingDepartment =
    await departmentRepository.findDepartmentByName(data.name);

  if (existingDepartment) {
    throw new Error("Department already exists");
  }

  return departmentRepository.createDepartment(data);
};

const getAllDepartments = async () => {
  return departmentRepository.getAllDepartments();
};

const getDepartmentById = async (id) => {
  const department = await departmentRepository.getDepartmentById(id);

  if (!department) {
    throw new Error("Department not found");
  }

  return department;
};

const updateDepartment = async (id, data) => {
  await getDepartmentById(id);

  return departmentRepository.updateDepartment(id, data);
};

const deleteDepartment = async (id) => {
  await getDepartmentById(id);

  return departmentRepository.deleteDepartment(id);
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};