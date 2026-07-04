const {
  createEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
} = require("../services/employee.service");

// Create Employee
const createEmployee = async (req, res, next) => {
  try {
    const employee = await createEmployeeService(req.body);

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Get All Employees
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await getAllEmployeesService();

    res.status(200).json({
      success: true,
      message: "Employees fetched successfully.",
      data: employees,
    });
  } catch (error) {
    next(error);
  }
};

// Get Employee By ID
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await getEmployeeByIdService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Employee fetched successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Update Employee
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await updateEmployeeService(req.params.id, req.body);

    res.status(200).json({
      success: true,
      message: "Employee updated successfully.",
      data: employee,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Employee
const deleteEmployee = async (req, res, next) => {
  try {
    await deleteEmployeeService(req.params.id);

    res.status(200).json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};