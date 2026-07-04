const prisma = require("../config/prisma");

// Create Employee
const createEmployee = async (employeeData) => {
  return await prisma.user.create({
    data: employeeData,
  });
};

// Get All Employees
const getAllEmployees = async () => {
  return await prisma.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

// Get Employee By ID
const getEmployeeById = async (id) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

// Get Employee By Email
const getEmployeeByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

// Update Employee
const updateEmployee = async (id, employeeData) => {
  return await prisma.user.update({
    where: { id },
    data: employeeData,
  });
};

// Delete Employee
const deleteEmployee = async (id) => {
  return await prisma.user.delete({
    where: { id },
  });
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  updateEmployee,
  deleteEmployee,
};