const prisma = require("../config/prisma");

const createDepartment = (data) => {
  return prisma.department.create({
    data,
  });
};

const getAllDepartments = () => {
  return prisma.department.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });
};

const getDepartmentById = (id) => {
  return prisma.department.findUnique({
    where: { id },
  });
};

const findDepartmentByName = (name) => {
  return prisma.department.findUnique({
    where: { name },
  });
};

const updateDepartment = (id, data) => {
  return prisma.department.update({
    where: { id },
    data,
  });
};

const deleteDepartment = (id) => {
  return prisma.department.delete({
    where: { id },
  });
};

module.exports = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  findDepartmentByName,
  updateDepartment,
  deleteDepartment,
};