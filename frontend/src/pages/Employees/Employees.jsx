import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
DialogTitle,
DialogContent,
DialogActions,
} from "@mui/material";

import Loader from "../../components/Loader";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employee.service";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee",
  });

  const [editOpen, setEditOpen] = useState(false);

const [selectedEmployee, setSelectedEmployee] = useState({
  id: "",
  name: "",
  email: "",
  role: "",
});

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);

      const data = await getEmployees();

      setEmployees(data);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await createEmployee(form);

      toast.success("Employee created successfully");

      setForm({
        name: "",
        email: "",
        password: "",
        role: "employee",
      });

      loadEmployees();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create employee"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmDelete) return;

    try {
      await deleteEmployee(id);

      toast.success("Employee deleted successfully");

      loadEmployees();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const handleEdit = (employee) => {
  setSelectedEmployee({
    id: employee.id,
    name: employee.name,
    email: employee.email,
    role: employee.role,
  });

  setEditOpen(true);
};

const handleUpdate = async () => {
  try {
    await updateEmployee(
      selectedEmployee.id,
      selectedEmployee
    );

    toast.success("Employee Updated Successfully");

    setEditOpen(false);

    loadEmployees();
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Update Failed"
    );
  }
};

  if (loading) {
    return <Loader />;
  }

  return (
    <Box>
  <Typography variant="h4" fontWeight="bold" mb={1}>
    Employees
  </Typography>

  <Typography color="text.secondary" mb={4}>
    Manage company employees, roles, and access.
  </Typography>

  <Grid container spacing={3}>
    <Grid size={{ xs: 12, md: 4 }}>
      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Add Employee
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              label="Employee Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Employee Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
            />

            <Select
              name="role"
              value={form.role}
              onChange={handleChange}
              fullWidth
            >
              <MenuItem value="employee">Employee</MenuItem>
              <MenuItem value="hr">HR</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{ borderRadius: 2 }}
            >
              Add Employee
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Grid>

    <Grid size={{ xs: 12, md: 8 }}>
      <TableContainer
        component={Paper}
        sx={{ borderRadius: 4 }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Name</strong>
              </TableCell>

              <TableCell>
                <strong>Email</strong>
              </TableCell>

              <TableCell>
                <strong>Role</strong>
              </TableCell>

              <TableCell>
                <strong>Created</strong>
              </TableCell>

              <TableCell>
                <strong>Actions</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id} hover>
                <TableCell>{employee.name}</TableCell>

                <TableCell>{employee.email}</TableCell>

                <TableCell>
                  <Chip
                    label={employee.role}
                    color={
                      employee.role === "admin"
                        ? "error"
                        : employee.role === "hr"
                        ? "warning"
                        : "primary"
                    }
                    size="small"
                  />
                </TableCell>

                <TableCell>
                  {new Date(
                    employee.createdAt
                  ).toLocaleDateString()}
                </TableCell>

                <TableCell>
                  <Box
  sx={{
    display: "flex",
    gap: 1,
  }}
>
  <Button
    variant="contained"
    size="small"
    onClick={() => handleEdit(employee)}
  >
    Edit
  </Button>

  <Button
    variant="outlined"
    color="error"
    size="small"
    onClick={() => handleDelete(employee.id)}
  >
    Delete
  </Button>
</Box>
                </TableCell>
              </TableRow>
            ))}

            {employees.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  align="center"
                >
                  No employees found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Grid>
  </Grid>
  <Dialog
  open={editOpen}
  onClose={() => setEditOpen(false)}
  maxWidth="sm"
  fullWidth
>
  <DialogTitle>Edit Employee</DialogTitle>

  <DialogContent>
    <TextField
      margin="normal"
      fullWidth
      label="Name"
      value={selectedEmployee.name}
      onChange={(e) =>
        setSelectedEmployee({
          ...selectedEmployee,
          name: e.target.value,
        })
      }
    />

    <TextField
      margin="normal"
      fullWidth
      label="Email"
      value={selectedEmployee.email}
      onChange={(e) =>
        setSelectedEmployee({
          ...selectedEmployee,
          email: e.target.value,
        })
      }
    />

    <Select
      fullWidth
      sx={{ mt: 2 }}
      value={selectedEmployee.role}
      onChange={(e) =>
        setSelectedEmployee({
          ...selectedEmployee,
          role: e.target.value,
        })
      }
    >
      <MenuItem value="employee">Employee</MenuItem>
      <MenuItem value="hr">HR</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
    </Select>
  </DialogContent>

  <DialogActions>
    <Button onClick={() => setEditOpen(false)}>
      Cancel
    </Button>

    <Button
      variant="contained"
      onClick={handleUpdate}
    >
      Save Changes
    </Button>
  </DialogActions>
</Dialog>
</Box>
  );
};

export default Employees;