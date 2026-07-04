const bcrypt = require("bcrypt");

const {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmail,
  updateEmployee,
  deleteEmployee,
} = require("../repositories/employee.repository");

// Create Employee
const createEmployeeService = async (employeeData) => {
  const { name, email, password, role } = employeeData;

  // Check existing employee
  const existingEmployee = await getEmployeeByEmail(email);

  if (existingEmployee) {
    throw new Error("Employee already exists with this email.");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Save employee
  const employee = await createEmployee({
    name,
    email,
    password: hashedPassword,
    role,
  });

  // Remove password
  const { password: _, ...employeeWithoutPassword } = employee;

  return employeeWithoutPassword;
};

// Get All Employees
const getAllEmployeesService = async () => {
  return await getAllEmployees();
};

// Get Employee By ID
const getEmployeeByIdService = async (id) => {
  const employee = await getEmployeeById(id);

  if (!employee) {
    throw new Error("Employee not found.");
  }

  return employee;
};

// Update Employee
const updateEmployeeService = async (id, employeeData) => {
  return await updateEmployee(id, employeeData);
};

// Delete Employee
const deleteEmployeeService = async (id) => {
  return await deleteEmployee(id);
};

module.exports = {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
};