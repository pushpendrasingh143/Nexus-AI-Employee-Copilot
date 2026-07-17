import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  DeleteOutlineRounded,
  EditRounded,
  EmailRounded,
  PeopleAltRounded,
  PersonAddAltRounded,
  RefreshRounded,
  SearchRounded,
  ShieldRounded,
} from "@mui/icons-material";

import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../../services/employee.service";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "employee",
};

const initialSelectedEmployee = {
  id: "",
  name: "",
  email: "",
  role: "employee",
};

const fieldStyles = {
  "& .MuiOutlinedInput-root": {
    color: "#0F172A !important",
    backgroundColor: "#FFFFFF !important",
    borderRadius: 2.5,

    "& fieldset": {
      borderColor: "#CBD5E1",
    },

    "&:hover fieldset": {
      borderColor: "#818CF8",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#4F46E5",
    },
  },

  "& .MuiInputLabel-root": {
    color: "#64748B !important",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#4F46E5 !important",
  },

  "& .MuiInputBase-input": {
    color: "#0F172A !important",
  },

  "& .MuiSelect-select": {
    color: "#0F172A !important",
  },

  "& .MuiSvgIcon-root": {
    color: "#64748B",
  },
};

const roleStyles = {
  admin: {
    label: "Admin",
    color: "#B91C1C",
    background: "#FEF2F2",
    border: "#FECACA",
  },
  hr: {
    label: "HR",
    color: "#B45309",
    background: "#FFFBEB",
    border: "#FDE68A",
  },
  employee: {
    label: "Employee",
    color: "#4338CA",
    background: "#EEF2FF",
    border: "#C7D2FE",
  },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [editOpen, setEditOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(
    initialSelectedEmployee
  );
  const [updating, setUpdating] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await getEmployees();

      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Employees load error:", error);

      setPageError(
        error.response?.data?.message ||
          "Unable to load employees."
      );

      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return employees.filter((employee) => {
      const matchesSearch =
        !normalizedSearch ||
        employee.name?.toLowerCase().includes(normalizedSearch) ||
        employee.email?.toLowerCase().includes(normalizedSearch);

      const matchesRole =
        roleFilter === "all" ||
        employee.role?.toLowerCase() === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [employees, search, roleFilter]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (creating) return;

    try {
      setCreating(true);

      await createEmployee({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
        role: form.role,
      });

      toast.success("Employee created successfully");

      setForm(initialForm);
      await loadEmployees();
    } catch (error) {
      console.error("Employee create error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create employee"
      );
    } finally {
      setCreating(false);
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee({
      id: employee.id,
      name: employee.name || "",
      email: employee.email || "",
      role: employee.role || "employee",
    });

    setEditOpen(true);
  };

  const handleUpdate = async () => {
    if (
      !selectedEmployee.name.trim() ||
      !selectedEmployee.email.trim() ||
      updating
    ) {
      return;
    }

    try {
      setUpdating(true);

      await updateEmployee(selectedEmployee.id, {
        name: selectedEmployee.name.trim(),
        email: selectedEmployee.email.trim().toLowerCase(),
        role: selectedEmployee.role,
      });

      toast.success("Employee updated successfully");

      setEditOpen(false);
      setSelectedEmployee(initialSelectedEmployee);

      await loadEmployees();
    } catch (error) {
      console.error("Employee update error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to update employee"
      );
    } finally {
      setUpdating(false);
    }
  };

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setEmployeeToDelete(null);
  };

  const handleDelete = async () => {
    if (!employeeToDelete?.id || deleting) return;

    try {
      setDeleting(true);

      await deleteEmployee(employeeToDelete.id);

      toast.success("Employee deleted successfully");

      closeDeleteDialog();
      await loadEmployees();
    } catch (error) {
      console.error("Employee delete error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete employee"
      );
    } finally {
      setDeleting(false);
      setDeleteOpen(false);
      setEmployeeToDelete(null);
    }
  };

  const renderRoleChip = (role) => {
    const normalizedRole = role?.toLowerCase() || "employee";
    const style =
      roleStyles[normalizedRole] || roleStyles.employee;

    return (
      <Chip
        label={style.label}
        size="small"
        sx={{
          height: 27,
          color: `${style.color} !important`,
          backgroundColor: `${style.background} !important`,
          border: `1px solid ${style.border}`,
          fontWeight: 800,
          textTransform: "capitalize",

          "& .MuiChip-label": {
            color: `${style.color} !important`,
            px: 1.2,
          },
        }}
      />
    );
  };

  return (
    <Box
      sx={{
        width: "100%",
        color: "#0F172A",
      }}
    >
      {/* Page heading */}
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center",
        }}
        gap={2}
        mb={3}
      >
        <Box>
          <Stack direction="row" alignItems="center" gap={1.2}>
            <Box
              sx={{
                width: 46,
                height: 46,
                display: "grid",
                placeItems: "center",
                color: "#4F46E5",
                backgroundColor: "#EEF2FF",
                borderRadius: 3,
              }}
            >
              <PeopleAltRounded />
            </Box>

            <Box>
              <Typography
                variant="h4"
                fontWeight={900}
                sx={{
                  color: "#0F172A !important",
                  fontSize: {
                    xs: "1.8rem",
                    md: "2.15rem",
                  },
                }}
              >
                Employees
              </Typography>

              <Typography
                sx={{
                  color: "#64748B !important",
                  mt: 0.3,
                }}
              >
                Manage company employees, roles and access.
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            label={`${employees.length} Total Employees`}
            sx={{
              color: "#4338CA !important",
              backgroundColor: "#EEF2FF !important",
              border: "1px solid #C7D2FE",
              fontWeight: 800,

              "& .MuiChip-label": {
                color: "#4338CA !important",
              },
            }}
          />

          <Button
            onClick={loadEmployees}
            disabled={loading}
            startIcon={
              loading ? (
                <CircularProgress size={17} />
              ) : (
                <RefreshRounded />
              )
            }
            sx={{
              color: "#4F46E5 !important",
              textTransform: "none",
              fontWeight: 800,
              borderRadius: 2,
            }}
          >
            Refresh
          </Button>
        </Stack>
      </Stack>

      {pageError && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 3,
          }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={loadEmployees}
            >
              Retry
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="flex-start">
        {/* Add employee form */}
        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF !important",
              color: "#0F172A !important",
            }}
          >
            <CardContent
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },
                "&:last-child": {
                  pb: {
                    xs: 2.5,
                    md: 3,
                  },
                },
              }}
            >
              <Stack direction="row" alignItems="center" gap={1.3}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: "grid",
                    placeItems: "center",
                    borderRadius: 2.5,
                    color: "#4F46E5",
                    backgroundColor: "#EEF2FF",
                  }}
                >
                  <PersonAddAltRounded />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Add Employee
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                    }}
                  >
                    Create a new employee account.
                  </Typography>
                </Box>
              </Stack>

              <Divider
                sx={{
                  my: 2.5,
                  borderColor: "#E2E8F0",
                }}
              />

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
                  autoComplete="name"
                  sx={fieldStyles}
                />

                <TextField
                  label="Employee Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="email"
                  sx={fieldStyles}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailRounded fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  label="Temporary Password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  fullWidth
                  autoComplete="new-password"
                  helperText="Use at least 6 characters."
                  sx={{
                    ...fieldStyles,

                    "& .MuiFormHelperText-root": {
                      color: "#64748B !important",
                      ml: 0.5,
                    },
                  }}
                />

                <TextField
                  select
                  label="Employee Role"
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  fullWidth
                  sx={fieldStyles}
                >
                  <MenuItem value="employee">
                    Employee
                  </MenuItem>

                  <MenuItem value="hr">HR</MenuItem>

                  <MenuItem value="admin">Admin</MenuItem>
                </TextField>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={creating}
                  startIcon={
                    creating ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <AddRounded />
                    )
                  }
                  sx={{
                    mt: 0.5,
                    py: 1.25,
                    borderRadius: 2.5,
                    color: "#FFFFFF !important",
                    background:
                      "linear-gradient(135deg, #4F46E5, #7C3AED) !important",
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow:
                      "0 8px 20px rgba(79,70,229,0.20)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #4338CA, #6D28D9) !important",
                    },
                  }}
                >
                  {creating
                    ? "Creating Employee..."
                    : "Add Employee"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Employee directory */}
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          <Paper
            elevation={0}
            sx={{
              width: "100%",
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              backgroundColor: "#FFFFFF !important",
              color: "#0F172A !important",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: {
                  xs: 2.5,
                  md: 3,
                },
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Stack
                direction={{
                  xs: "column",
                  md: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                  xs: "stretch",
                  md: "center",
                }}
                gap={2}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Employee Directory
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                      mt: 0.3,
                    }}
                  >
                    Search, review and manage employee accounts.
                  </Typography>
                </Box>

                <Stack
                  direction={{
                    xs: "column",
                    sm: "row",
                  }}
                  gap={1.5}
                  sx={{
                    width: {
                      xs: "100%",
                      md: "auto",
                    },
                  }}
                >
                  <TextField
                    size="small"
                    placeholder="Search employees..."
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    sx={{
                      ...fieldStyles,
                      minWidth: {
                        xs: "100%",
                        sm: 220,
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchRounded fontSize="small" />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    select
                    size="small"
                    value={roleFilter}
                    onChange={(event) =>
                      setRoleFilter(event.target.value)
                    }
                    sx={{
                      ...fieldStyles,
                      minWidth: {
                        xs: "100%",
                        sm: 135,
                      },
                    }}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="employee">
                      Employee
                    </MenuItem>
                    <MenuItem value="hr">HR</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                  </TextField>
                </Stack>
              </Stack>
            </Box>

            {/* Desktop table */}
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    minHeight: 320,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <Stack alignItems="center" spacing={1.5}>
                    <CircularProgress />

                    <Typography
                      sx={{
                        color: "#64748B !important",
                      }}
                    >
                      Loading employees...
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    width: "100%",
                    overflowX: "auto",
                    backgroundColor: "#FFFFFF !important",
                  }}
                >
                  <Table
                    sx={{
                      minWidth: 680,
                      tableLayout: "fixed",
                    }}
                  >
                    <TableHead>
                      <TableRow
                        sx={{
                          backgroundColor: "#F8FAFC",
                        }}
                      >
                        <TableCell
                          sx={{
                            width: "21%",
                            color: "#475569 !important",
                            fontWeight: 800,
                            borderColor: "#E2E8F0",
                          }}
                        >
                          Employee
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "30%",
                            color: "#475569 !important",
                            fontWeight: 800,
                            borderColor: "#E2E8F0",
                          }}
                        >
                          Email
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "14%",
                            color: "#475569 !important",
                            fontWeight: 800,
                            borderColor: "#E2E8F0",
                          }}
                        >
                          Role
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "16%",
                            color: "#475569 !important",
                            fontWeight: 800,
                            borderColor: "#E2E8F0",
                          }}
                        >
                          Created
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            width: "19%",
                            color: "#475569 !important",
                            fontWeight: 800,
                            borderColor: "#E2E8F0",
                          }}
                        >
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredEmployees.map((employee) => {
                        const initial =
                          employee.name
                            ?.trim()
                            ?.charAt(0)
                            ?.toUpperCase() || "E";

                        return (
                          <TableRow
                            key={employee.id}
                            hover
                            sx={{
                              "&:last-child td": {
                                borderBottom: 0,
                              },

                              "&:hover": {
                                backgroundColor:
                                  "#F8FAFC !important",
                              },
                            }}
                          >
                            <TableCell
                              sx={{
                                borderColor: "#E2E8F0",
                              }}
                            >
                              <Stack
                                direction="row"
                                alignItems="center"
                                gap={1.2}
                              >
                                <Avatar
                                  sx={{
                                    width: 36,
                                    height: 36,
                                    fontSize: 14,
                                    fontWeight: 800,
                                    color: "#4338CA",
                                    backgroundColor: "#EEF2FF",
                                  }}
                                >
                                  {initial}
                                </Avatar>

                                <Tooltip
                                  title={employee.name || ""}
                                  arrow
                                >
                                  <Typography
                                    noWrap
                                    fontWeight={700}
                                    sx={{
                                      color:
                                        "#0F172A !important",
                                    }}
                                  >
                                    {employee.name}
                                  </Typography>
                                </Tooltip>
                              </Stack>
                            </TableCell>

                            <TableCell
                              sx={{
                                borderColor: "#E2E8F0",
                              }}
                            >
                              <Tooltip
                                title={employee.email || ""}
                                arrow
                              >
                                <Typography
                                  noWrap
                                  sx={{
                                    color:
                                      "#475569 !important",
                                    fontSize: 13,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {employee.email}
                                </Typography>
                              </Tooltip>
                            </TableCell>

                            <TableCell
                              sx={{
                                borderColor: "#E2E8F0",
                              }}
                            >
                              {renderRoleChip(employee.role)}
                            </TableCell>

                            <TableCell
                              sx={{
                                color: "#64748B !important",
                                fontSize: 13,
                                borderColor: "#E2E8F0",
                              }}
                            >
                              {formatDate(employee.createdAt)}
                            </TableCell>

                            <TableCell
                              align="right"
                              sx={{
                                borderColor: "#E2E8F0",
                              }}
                            >
                              <Stack
                                direction="row"
                                justifyContent="flex-end"
                                gap={0.8}
                              >
                                <Tooltip title="Edit employee">
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      handleEdit(employee)
                                    }
                                    startIcon={<EditRounded />}
                                    sx={{
                                      minWidth: 0,
                                      px: 1.2,
                                      color:
                                        "#4338CA !important",
                                      backgroundColor:
                                        "#EEF2FF !important",
                                      borderRadius: 2,
                                      fontWeight: 800,
                                      textTransform: "none",
                                    }}
                                  >
                                    Edit
                                  </Button>
                                </Tooltip>

                                <Tooltip title="Delete employee">
                                  <Button
                                    size="small"
                                    onClick={() =>
                                      openDeleteDialog(employee)
                                    }
                                    sx={{
                                      minWidth: 38,
                                      color:
                                        "#DC2626 !important",
                                      backgroundColor:
                                        "#FEF2F2 !important",
                                      borderRadius: 2,
                                    }}
                                  >
                                    <DeleteOutlineRounded fontSize="small" />
                                  </Button>
                                </Tooltip>
                              </Stack>
                            </TableCell>
                          </TableRow>
                        );
                      })}

                      {filteredEmployees.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            align="center"
                            sx={{
                              py: 7,
                              borderBottom: 0,
                            }}
                          >
                            <PeopleAltRounded
                              sx={{
                                color: "#CBD5E1",
                                fontSize: 48,
                              }}
                            />

                            <Typography
                              fontWeight={800}
                              sx={{
                                color: "#334155 !important",
                                mt: 1,
                              }}
                            >
                              No employees found
                            </Typography>

                            <Typography
                              sx={{
                                color: "#64748B !important",
                                fontSize: 13,
                                mt: 0.5,
                              }}
                            >
                              Change your search or role filter.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            {/* Mobile employee cards */}
            <Box
              sx={{
                display: {
                  xs: "block",
                  md: "none",
                },
                p: 2,
              }}
            >
              {loading ? (
                <Box
                  sx={{
                    py: 6,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress />
                </Box>
              ) : filteredEmployees.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <PeopleAltRounded
                    sx={{
                      color: "#CBD5E1",
                      fontSize: 48,
                    }}
                  />

                  <Typography
                    fontWeight={800}
                    sx={{
                      color: "#334155 !important",
                      mt: 1,
                    }}
                  >
                    No employees found
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {filteredEmployees.map((employee) => (
                    <Paper
                      key={employee.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 3,
                        border: "1px solid #E2E8F0",
                        backgroundColor: "#FFFFFF !important",
                      }}
                    >
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        gap={1}
                      >
                        <Stack
                          direction="row"
                          alignItems="center"
                          gap={1.2}
                          sx={{
                            minWidth: 0,
                          }}
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              color: "#4338CA",
                              backgroundColor: "#EEF2FF",
                              fontWeight: 800,
                            }}
                          >
                            {employee.name
                              ?.charAt(0)
                              ?.toUpperCase() || "E"}
                          </Avatar>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              noWrap
                              fontWeight={800}
                              sx={{
                                color: "#0F172A !important",
                              }}
                            >
                              {employee.name}
                            </Typography>

                            <Typography
                              noWrap
                              sx={{
                                color: "#64748B !important",
                                fontSize: 12,
                              }}
                            >
                              {employee.email}
                            </Typography>
                          </Box>
                        </Stack>

                        {renderRoleChip(employee.role)}
                      </Stack>

                      <Divider
                        sx={{
                          my: 1.5,
                          borderColor: "#E2E8F0",
                        }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          sx={{
                            color: "#64748B !important",
                            fontSize: 12,
                          }}
                        >
                          Joined {formatDate(employee.createdAt)}
                        </Typography>

                        <Stack direction="row" gap={1}>
                          <Button
                            size="small"
                            onClick={() =>
                              handleEdit(employee)
                            }
                            sx={{
                              color: "#4338CA !important",
                              fontWeight: 800,
                              textTransform: "none",
                            }}
                          >
                            Edit
                          </Button>

                          <Button
                            size="small"
                            onClick={() =>
                              openDeleteDialog(employee)
                            }
                            sx={{
                              color: "#DC2626 !important",
                              fontWeight: 800,
                              textTransform: "none",
                            }}
                          >
                            Delete
                          </Button>
                        </Stack>
                      </Stack>
                    </Paper>
                  ))}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Edit employee dialog */}
      <Dialog
        open={editOpen}
        onClose={() => {
          if (!updating) {
            setEditOpen(false);
          }
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            color: "#0F172A",
            backgroundColor: "#FFFFFF !important",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#0F172A !important",
            fontWeight: 900,
            pb: 1,
          }}
        >
          Edit Employee
        </DialogTitle>

        <DialogContent>
          <Typography
            sx={{
              color: "#64748B !important",
              fontSize: 13,
              mb: 1,
            }}
          >
            Update employee account information and access role.
          </Typography>

          <TextField
            margin="normal"
            fullWidth
            required
            label="Name"
            value={selectedEmployee.name}
            onChange={(event) =>
              setSelectedEmployee((current) => ({
                ...current,
                name: event.target.value,
              }))
            }
            sx={fieldStyles}
          />

          <TextField
            margin="normal"
            fullWidth
            required
            type="email"
            label="Email"
            value={selectedEmployee.email}
            onChange={(event) =>
              setSelectedEmployee((current) => ({
                ...current,
                email: event.target.value,
              }))
            }
            sx={fieldStyles}
          />

          <TextField
            select
            margin="normal"
            fullWidth
            label="Role"
            value={selectedEmployee.role}
            onChange={(event) =>
              setSelectedEmployee((current) => ({
                ...current,
                role: event.target.value,
              }))
            }
            sx={fieldStyles}
          >
            <MenuItem value="employee">Employee</MenuItem>
            <MenuItem value="hr">HR</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={() => setEditOpen(false)}
            disabled={updating}
            sx={{
              color: "#475569 !important",
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={
              updating ||
              !selectedEmployee.name.trim() ||
              !selectedEmployee.email.trim()
            }
            startIcon={
              updating ? (
                <CircularProgress
                  size={17}
                  color="inherit"
                />
              ) : (
                <ShieldRounded />
              )
            }
            sx={{
              color: "#FFFFFF !important",
              backgroundColor: "#4F46E5 !important",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            {updating ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete confirmation dialog */}
      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            color: "#0F172A",
            backgroundColor: "#FFFFFF !important",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: "#0F172A !important",
            fontWeight: 900,
          }}
        >
          Delete Employee?
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 2.5,
            }}
          >
            This action will permanently delete{" "}
            <strong>
              {employeeToDelete?.name || "this employee"}
            </strong>
            .
          </Alert>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 3,
          }}
        >
          <Button
            onClick={closeDeleteDialog}
            disabled={deleting}
            sx={{
              color: "#475569 !important",
              fontWeight: 800,
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleDelete}
            disabled={deleting}
            startIcon={
              deleting ? (
                <CircularProgress
                  size={17}
                  color="inherit"
                />
              ) : (
                <DeleteOutlineRounded />
              )
            }
            sx={{
              color: "#FFFFFF !important",
              backgroundColor: "#DC2626 !important",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: 2,

              "&:hover": {
                backgroundColor: "#B91C1C !important",
              },
            }}
          >
            {deleting ? "Deleting..." : "Delete Employee"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Employees;