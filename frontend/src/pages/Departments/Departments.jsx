import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  getDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/department.service";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch {
      toast.error("Failed to load departments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createDepartment({ name });

      toast.success("Department Created Successfully");

      setName("");

      loadDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this department?")) return;

    try {
      await deleteDepartment(id);

      toast.success("Department Deleted Successfully");

      loadDepartments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed");
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Departments
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Manage company departments.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" mb={3}>
                Add Department
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
                  label="Department Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  fullWidth
                />

                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                >
                  Add Department
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
                    <strong>Created</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {departments.map((department) => (
                  <TableRow
                    key={department.id}
                    hover
                  >
                    <TableCell>
                      {department.name}
                    </TableCell>

                    <TableCell>
                      {new Date(
                        department.createdAt
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        onClick={() =>
                          handleDelete(department.id)
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {departments.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                    >
                      No Departments Found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Departments;