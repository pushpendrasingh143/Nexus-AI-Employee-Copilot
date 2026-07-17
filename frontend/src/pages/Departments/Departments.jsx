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
  ApartmentRounded,
  DeleteOutlineRounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  getDepartments,
  createDepartment,
  deleteDepartment,
} from "../../services/department.service";

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

  "& .MuiSvgIcon-root": {
    color: "#64748B",
  },
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDepartments = async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await getDepartments();

      setDepartments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Department load error:", error);

      setPageError(
        error.response?.data?.message ||
          "Unable to load departments."
      );

      toast.error("Failed to load departments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const filteredDepartments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return departments;
    }

    return departments.filter((department) =>
      department.name
        ?.toLowerCase()
        .includes(normalizedSearch)
    );
  }, [departments, search]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = name.trim();

    if (!trimmedName || creating) return;

    try {
      setCreating(true);

      await createDepartment({
        name: trimmedName,
      });

      toast.success("Department created successfully");

      setName("");

      await loadDepartments();
    } catch (error) {
      console.error("Department create error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to create department"
      );
    } finally {
      setCreating(false);
    }
  };

  const openDeleteDialog = (department) => {
    setDepartmentToDelete(department);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setDepartmentToDelete(null);
  };

  const handleDelete = async () => {
    if (!departmentToDelete?.id || deleting) return;

    try {
      setDeleting(true);

      await deleteDepartment(departmentToDelete.id);

      toast.success("Department deleted successfully");

      setDeleteOpen(false);
      setDepartmentToDelete(null);

      await loadDepartments();
    } catch (error) {
      console.error("Department delete error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete department"
      );
    } finally {
      setDeleting(false);
    }
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
        <Stack direction="row" alignItems="center" gap={1.3}>
          <Box
            sx={{
              width: 46,
              height: 46,
              display: "grid",
              placeItems: "center",
              color: "#16A34A",
              backgroundColor: "#F0FDF4",
              borderRadius: 3,
            }}
          >
            <ApartmentRounded />
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
              Departments
            </Typography>

            <Typography
              sx={{
                color: "#64748B !important",
                mt: 0.3,
              }}
            >
              Organize company teams and business units.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            label={`${departments.length} Departments`}
            sx={{
              color: "#15803D !important",
              backgroundColor: "#F0FDF4 !important",
              border: "1px solid #BBF7D0",
              fontWeight: 800,

              "& .MuiChip-label": {
                color: "#15803D !important",
              },
            }}
          />

          <Button
            onClick={loadDepartments}
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
              onClick={loadDepartments}
            >
              Retry
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="flex-start">
        {/* Create department */}
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
                    color: "#16A34A",
                    backgroundColor: "#F0FDF4",
                    borderRadius: 2.5,
                  }}
                >
                  <AddRounded />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Add Department
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                    }}
                  >
                    Create a new organizational unit.
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
                  label="Department Name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  fullWidth
                  placeholder="Example: Engineering"
                  sx={fieldStyles}
                />

                <Button
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={creating || !name.trim()}
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
                    py: 1.25,
                    color: "#FFFFFF !important",
                    background:
                      "linear-gradient(135deg, #16A34A, #059669) !important",
                    borderRadius: 2.5,
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow:
                      "0 8px 20px rgba(22,163,74,0.18)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #15803D, #047857) !important",
                    },
                  }}
                >
                  {creating
                    ? "Creating Department..."
                    : "Add Department"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Department directory */}
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
              overflow: "hidden",
              borderRadius: 4,
              border: "1px solid #E2E8F0",
              color: "#0F172A !important",
              backgroundColor: "#FFFFFF !important",
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
                  sm: "row",
                }}
                justifyContent="space-between"
                alignItems={{
                  xs: "stretch",
                  sm: "center",
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
                    Department Directory
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                      mt: 0.3,
                    }}
                  >
                    Review and manage organization departments.
                  </Typography>
                </Box>

                <TextField
                  size="small"
                  placeholder="Search departments..."
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  sx={{
                    ...fieldStyles,
                    width: {
                      xs: "100%",
                      sm: 250,
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
                    minHeight: 300,
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
                      Loading departments...
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <TableContainer
                  sx={{
                    width: "100%",
                    backgroundColor: "#FFFFFF !important",
                  }}
                >
                  <Table
                    sx={{
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
                            width: "48%",
                            color: "#475569 !important",
                            borderColor: "#E2E8F0",
                            fontWeight: 800,
                          }}
                        >
                          Department
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "27%",
                            color: "#475569 !important",
                            borderColor: "#E2E8F0",
                            fontWeight: 800,
                          }}
                        >
                          Created
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            width: "25%",
                            color: "#475569 !important",
                            borderColor: "#E2E8F0",
                            fontWeight: 800,
                          }}
                        >
                          Action
                        </TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {filteredDepartments.map(
                        (department) => {
                          const initial =
                            department.name
                              ?.trim()
                              ?.charAt(0)
                              ?.toUpperCase() || "D";

                          return (
                            <TableRow
                              key={department.id}
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
                                  gap={1.3}
                                >
                                  <Avatar
                                    sx={{
                                      width: 38,
                                      height: 38,
                                      color: "#15803D",
                                      backgroundColor:
                                        "#F0FDF4",
                                      fontSize: 14,
                                      fontWeight: 900,
                                    }}
                                  >
                                    {initial}
                                  </Avatar>

                                  <Tooltip
                                    title={
                                      department.name || ""
                                    }
                                    arrow
                                  >
                                    <Typography
                                      noWrap
                                      fontWeight={800}
                                      sx={{
                                        color:
                                          "#0F172A !important",
                                      }}
                                    >
                                      {department.name}
                                    </Typography>
                                  </Tooltip>
                                </Stack>
                              </TableCell>

                              <TableCell
                                sx={{
                                  color: "#64748B !important",
                                  borderColor: "#E2E8F0",
                                  fontSize: 13,
                                }}
                              >
                                {formatDate(
                                  department.createdAt
                                )}
                              </TableCell>

                              <TableCell
                                align="right"
                                sx={{
                                  borderColor: "#E2E8F0",
                                }}
                              >
                                <Button
                                  size="small"
                                  onClick={() =>
                                    openDeleteDialog(
                                      department
                                    )
                                  }
                                  startIcon={
                                    <DeleteOutlineRounded />
                                  }
                                  sx={{
                                    color:
                                      "#DC2626 !important",
                                    backgroundColor:
                                      "#FEF2F2 !important",
                                    borderRadius: 2,
                                    fontWeight: 800,
                                    textTransform: "none",

                                    "&:hover": {
                                      backgroundColor:
                                        "#FEE2E2 !important",
                                    },
                                  }}
                                >
                                  Delete
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}

                      {filteredDepartments.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            align="center"
                            sx={{
                              py: 7,
                              borderBottom: 0,
                            }}
                          >
                            <ApartmentRounded
                              sx={{
                                color: "#CBD5E1",
                                fontSize: 50,
                              }}
                            />

                            <Typography
                              fontWeight={900}
                              sx={{
                                color: "#334155 !important",
                                mt: 1,
                              }}
                            >
                              No departments found
                            </Typography>

                            <Typography
                              sx={{
                                color: "#64748B !important",
                                mt: 0.5,
                                fontSize: 13,
                              }}
                            >
                              Change your search or create a new
                              department.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            {/* Mobile department cards */}
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
              ) : filteredDepartments.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <ApartmentRounded
                    sx={{
                      color: "#CBD5E1",
                      fontSize: 50,
                    }}
                  />

                  <Typography
                    fontWeight={900}
                    sx={{
                      color: "#334155 !important",
                      mt: 1,
                    }}
                  >
                    No departments found
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {filteredDepartments.map(
                    (department) => (
                      <Paper
                        key={department.id}
                        elevation={0}
                        sx={{
                          p: 2,
                          borderRadius: 3,
                          border: "1px solid #E2E8F0",
                          backgroundColor:
                            "#FFFFFF !important",
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="flex-start"
                          gap={2}
                        >
                          <Stack
                            direction="row"
                            alignItems="center"
                            gap={1.3}
                            sx={{
                              minWidth: 0,
                            }}
                          >
                            <Avatar
                              sx={{
                                color: "#15803D",
                                backgroundColor: "#F0FDF4",
                                fontWeight: 900,
                              }}
                            >
                              {department.name
                                ?.charAt(0)
                                ?.toUpperCase() || "D"}
                            </Avatar>

                            <Box sx={{ minWidth: 0 }}>
                              <Typography
                                noWrap
                                fontWeight={900}
                                sx={{
                                  color:
                                    "#0F172A !important",
                                }}
                              >
                                {department.name}
                              </Typography>

                              <Typography
                                sx={{
                                  color:
                                    "#64748B !important",
                                  fontSize: 12,
                                  mt: 0.3,
                                }}
                              >
                                Created{" "}
                                {formatDate(
                                  department.createdAt
                                )}
                              </Typography>
                            </Box>
                          </Stack>

                          <Button
                            size="small"
                            onClick={() =>
                              openDeleteDialog(department)
                            }
                            sx={{
                              minWidth: 38,
                              color: "#DC2626 !important",
                              backgroundColor:
                                "#FEF2F2 !important",
                              borderRadius: 2,
                            }}
                          >
                            <DeleteOutlineRounded fontSize="small" />
                          </Button>
                        </Stack>
                      </Paper>
                    )
                  )}
                </Stack>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Delete confirmation */}
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
          Delete Department?
        </DialogTitle>

        <DialogContent>
          <Alert
            severity="warning"
            sx={{
              borderRadius: 2.5,
            }}
          >
            This will permanently delete{" "}
            <strong>
              {departmentToDelete?.name ||
                "this department"}
            </strong>
            . Make sure no important employees depend on it.
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
              borderRadius: 2,
              fontWeight: 800,
              textTransform: "none",

              "&:hover": {
                backgroundColor: "#B91C1C !important",
              },
            }}
          >
            {deleting
              ? "Deleting..."
              : "Delete Department"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Departments;