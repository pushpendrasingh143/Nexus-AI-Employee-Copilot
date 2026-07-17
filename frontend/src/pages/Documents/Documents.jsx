import { Link } from "react-router-dom";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import toast from "react-hot-toast";

import {
  Alert,
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
  AutoAwesomeRounded,
  CloudUploadRounded,
  DeleteOutlineRounded,
  DescriptionRounded,
  PictureAsPdfRounded,
  RefreshRounded,
  SearchRounded,
} from "@mui/icons-material";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../services/document.service";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

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

const formatFileSize = (bytes) => {
  if (!bytes) return "0 KB";

  const units = ["Bytes", "KB", "MB", "GB"];
  const unitIndex = Math.floor(
    Math.log(bytes) / Math.log(1024)
  );

  const value = bytes / 1024 ** unitIndex;

  return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${
    units[unitIndex]
  }`;
};

const Documents = () => {
  const fileInputRef = useRef(null);

  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] =
    useState(null);
  const [deleting, setDeleting] = useState(false);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await getDocuments();

      setDocuments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Document load error:", error);

      setPageError(
        error.response?.data?.message ||
          "Unable to load documents."
      );

      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filteredDocuments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    if (!normalizedSearch) {
      return documents;
    }

    return documents.filter((document) => {
      const fileName =
        document.fileName?.toLowerCase() || "";

      const fileType =
        document.fileType?.toLowerCase() || "";

      return (
        fileName.includes(normalizedSearch) ||
        fileType.includes(normalizedSearch)
      );
    });
  }, [documents, search]);

  const selectFile = (selectedFile) => {
    if (!selectedFile) return;

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      toast.error("Only PDF documents are allowed");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast.error("PDF size must be below 10 MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileChange = (event) => {
    selectFile(event.target.files?.[0]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);

    selectFile(event.dataTransfer.files?.[0]);
  };

  const clearSelectedFile = () => {
    setFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    if (!file || uploading) {
      toast.error("Please select a PDF document");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      setUploading(true);

      await uploadDocument(formData);

      toast.success("Document uploaded successfully");

      clearSelectedFile();
      await loadDocuments();
    } catch (error) {
      console.error("Document upload error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to upload document"
      );
    } finally {
      setUploading(false);
    }
  };

  const openDeleteDialog = (document) => {
    setDocumentToDelete(document);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    if (deleting) return;

    setDeleteOpen(false);
    setDocumentToDelete(null);
  };

  const handleDelete = async () => {
    if (!documentToDelete?.id || deleting) return;

    try {
      setDeleting(true);

      await deleteDocument(documentToDelete.id);

      toast.success("Document deleted successfully");

      setDeleteOpen(false);
      setDocumentToDelete(null);

      await loadDocuments();
    } catch (error) {
      console.error("Document delete error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to delete document"
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
      {/* Page Header */}
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
              color: "#EA580C",
              backgroundColor: "#FFF7ED",
              borderRadius: 3,
            }}
          >
            <DescriptionRounded />
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
              Documents
            </Typography>

            <Typography
              sx={{
                color: "#64748B !important",
                mt: 0.3,
              }}
            >
              Upload and manage organizational knowledge.
            </Typography>
          </Box>
        </Stack>

        <Stack direction="row" alignItems="center" gap={1}>
          <Chip
            label={`${documents.length} Documents`}
            sx={{
              color: "#C2410C !important",
              backgroundColor: "#FFF7ED !important",
              border: "1px solid #FED7AA",
              fontWeight: 800,

              "& .MuiChip-label": {
                color: "#C2410C !important",
              },
            }}
          />

          <Button
            onClick={loadDocuments}
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
              onClick={loadDocuments}
            >
              Retry
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <Grid container spacing={3} alignItems="flex-start">
        {/* Upload Card */}
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
              color: "#0F172A !important",
              backgroundColor: "#FFFFFF !important",
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
                    color: "#EA580C",
                    backgroundColor: "#FFF7ED",
                    borderRadius: 2.5,
                  }}
                >
                  <CloudUploadRounded />
                </Box>

                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={900}
                    sx={{
                      color: "#0F172A !important",
                    }}
                  >
                    Upload PDF
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                    }}
                  >
                    Add knowledge to the AI assistant.
                  </Typography>
                </Box>
              </Stack>

              <Divider
                sx={{
                  my: 2.5,
                  borderColor: "#E2E8F0",
                }}
              />

              <Box component="form" onSubmit={handleUpload}>
                <Box
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  sx={{
                    minHeight: 190,
                    px: 2,
                    py: 3,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: 3,
                    border: dragActive
                      ? "2px dashed #4F46E5"
                      : "2px dashed #CBD5E1",
                    color: "#0F172A",
                    backgroundColor: dragActive
                      ? "#EEF2FF !important"
                      : "#F8FAFC !important",
                    transition: "all 0.2s ease",

                    "&:hover": {
                      borderColor: "#818CF8",
                      backgroundColor:
                        "#F8FAFF !important",
                    },
                  }}
                >
                  <input
                    ref={fileInputRef}
                    hidden
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                  />

                  <Box>
                    <Box
                      sx={{
                        width: 58,
                        height: 58,
                        mx: "auto",
                        mb: 1.5,
                        display: "grid",
                        placeItems: "center",
                        borderRadius: 3,
                        color: "#4F46E5",
                        backgroundColor: "#EEF2FF",
                      }}
                    >
                      <CloudUploadRounded fontSize="large" />
                    </Box>

                    <Typography
                      fontWeight={900}
                      sx={{
                        color: "#0F172A !important",
                      }}
                    >
                      Drop your PDF here
                    </Typography>

                    <Typography
                      sx={{
                        color: "#64748B !important",
                        fontSize: 13,
                        mt: 0.7,
                      }}
                    >
                      or click to browse your computer
                    </Typography>

                    <Typography
                      sx={{
                        color: "#94A3B8 !important",
                        fontSize: 11,
                        mt: 1,
                      }}
                    >
                      PDF only · Maximum size 10 MB
                    </Typography>
                  </Box>
                </Box>

                {file && (
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 2,
                      p: 1.7,
                      borderRadius: 3,
                      border: "1px solid #FED7AA",
                      backgroundColor: "#FFF7ED !important",
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={1.5}
                    >
                      <Stack
                        direction="row"
                        alignItems="center"
                        gap={1.2}
                        sx={{
                          minWidth: 0,
                        }}
                      >
                        <PictureAsPdfRounded
                          sx={{
                            color: "#DC2626",
                          }}
                        />

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            noWrap
                            fontWeight={800}
                            sx={{
                              color: "#0F172A !important",
                              fontSize: 13,
                            }}
                          >
                            {file.name}
                          </Typography>

                          <Typography
                            sx={{
                              color: "#64748B !important",
                              fontSize: 11,
                              mt: 0.2,
                            }}
                          >
                            {formatFileSize(file.size)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Button
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation();
                          clearSelectedFile();
                        }}
                        sx={{
                          minWidth: 36,
                          color: "#DC2626 !important",
                          borderRadius: 2,
                        }}
                      >
                        <DeleteOutlineRounded fontSize="small" />
                      </Button>
                    </Stack>
                  </Paper>
                )}

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  disabled={uploading || !file}
                  startIcon={
                    uploading ? (
                      <CircularProgress
                        size={18}
                        color="inherit"
                      />
                    ) : (
                      <CloudUploadRounded />
                    )
                  }
                  sx={{
                    mt: 2,
                    py: 1.25,
                    color: "#FFFFFF !important",
                    background:
                      "linear-gradient(135deg, #EA580C, #F97316) !important",
                    borderRadius: 2.5,
                    fontWeight: 800,
                    textTransform: "none",
                    boxShadow:
                      "0 8px 20px rgba(234,88,12,0.18)",

                    "&:hover": {
                      background:
                        "linear-gradient(135deg, #C2410C, #EA580C) !important",
                    },
                  }}
                >
                  {uploading
                    ? "Processing Document..."
                    : "Upload Document"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Document Directory */}
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
                    Knowledge Base
                  </Typography>

                  <Typography
                    sx={{
                      color: "#64748B !important",
                      fontSize: 13,
                      mt: 0.3,
                    }}
                  >
                    Search and manage uploaded company documents.
                  </Typography>
                </Box>

                <TextField
                  size="small"
                  placeholder="Search documents..."
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

            {/* Desktop Table */}
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
                      Loading documents...
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
                      minWidth: 650,
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
                            width: "43%",
                            color: "#475569 !important",
                            borderColor: "#E2E8F0",
                            fontWeight: 800,
                          }}
                        >
                          Document
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "17%",
                            color: "#475569 !important",
                            borderColor: "#E2E8F0",
                            fontWeight: 800,
                          }}
                        >
                          Type
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "20%",
                            color: "#475569 !important",
                            borderColor: "#E2E8F0",
                            fontWeight: 800,
                          }}
                        >
                          Uploaded
                        </TableCell>

                        <TableCell
                          align="right"
                          sx={{
                            width: "20%",
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
                      {filteredDocuments.map((document) => (
                        <TableRow
                          key={document.id}
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
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  display: "grid",
                                  placeItems: "center",
                                  color: "#DC2626",
                                  backgroundColor: "#FEF2F2",
                                  borderRadius: 2.5,
                                  flexShrink: 0,
                                }}
                              >
                                <PictureAsPdfRounded />
                              </Box>

                              <Tooltip
                                title={document.fileName || ""}
                                arrow
                              >
                                <Typography
                                  noWrap
                                  fontWeight={800}
                                  sx={{
                                    color:
                                      "#0F172A !important",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {document.fileName}
                                </Typography>
                              </Tooltip>
                            </Stack>
                          </TableCell>

                          <TableCell
                            sx={{
                              borderColor: "#E2E8F0",
                            }}
                          >
                            <Chip
                              label={
                                document.fileType || "PDF"
                              }
                              size="small"
                              sx={{
                                color: "#4338CA !important",
                                backgroundColor:
                                  "#EEF2FF !important",
                                border:
                                  "1px solid #C7D2FE",
                                fontWeight: 800,

                                "& .MuiChip-label": {
                                  color:
                                    "#4338CA !important",
                                },
                              }}
                            />
                          </TableCell>

                          <TableCell
                            sx={{
                              color: "#64748B !important",
                              borderColor: "#E2E8F0",
                              fontSize: 13,
                            }}
                          >
                            {formatDate(document.createdAt)}
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
                                openDeleteDialog(document)
                              }
                              startIcon={
                                <DeleteOutlineRounded />
                              }
                              sx={{
                                color: "#DC2626 !important",
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
                      ))}

                      {filteredDocuments.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={4}
                            align="center"
                            sx={{
                              py: 7,
                              borderBottom: 0,
                            }}
                          >
                            <DescriptionRounded
                              sx={{
                                color: "#CBD5E1",
                                fontSize: 52,
                              }}
                            />

                            <Typography
                              fontWeight={900}
                              sx={{
                                color: "#334155 !important",
                                mt: 1,
                              }}
                            >
                              No documents found
                            </Typography>

                            <Typography
                              sx={{
                                color: "#64748B !important",
                                mt: 0.5,
                                fontSize: 13,
                              }}
                            >
                              Upload a PDF or change your search.
                            </Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Box>

            {/* Mobile Cards */}
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
              ) : filteredDocuments.length === 0 ? (
                <Box
                  sx={{
                    py: 6,
                    textAlign: "center",
                  }}
                >
                  <DescriptionRounded
                    sx={{
                      color: "#CBD5E1",
                      fontSize: 52,
                    }}
                  />

                  <Typography
                    fontWeight={900}
                    sx={{
                      color: "#334155 !important",
                      mt: 1,
                    }}
                  >
                    No documents found
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.5}>
                  {filteredDocuments.map((document) => (
                    <Paper
                      key={document.id}
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
                        gap={1.5}
                      >
                        <Stack
                          direction="row"
                          gap={1.2}
                          sx={{ minWidth: 0 }}
                        >
                          <Box
                            sx={{
                              width: 40,
                              height: 40,
                              display: "grid",
                              placeItems: "center",
                              color: "#DC2626",
                              backgroundColor: "#FEF2F2",
                              borderRadius: 2.5,
                              flexShrink: 0,
                            }}
                          >
                            <PictureAsPdfRounded />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography
                              noWrap
                              fontWeight={900}
                              sx={{
                                color: "#0F172A !important",
                              }}
                            >
                              {document.fileName}
                            </Typography>

                            <Typography
                              sx={{
                                color: "#64748B !important",
                                fontSize: 12,
                                mt: 0.3,
                              }}
                            >
                              Uploaded{" "}
                              {formatDate(document.createdAt)}
                            </Typography>
                          </Box>
                        </Stack>

                        <Button
                          size="small"
                          onClick={() =>
                            openDeleteDialog(document)
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
                  ))}
                </Stack>
              )}
            </Box>

            {documents.length > 0 && (
              <Box
                sx={{
                  p: 2,
                  borderTop: "1px solid #E2E8F0",
                  backgroundColor: "#F8FAFC",
                }}
              >
                <Button
                  component={Link}
                  to="/ai"
                  fullWidth
                  startIcon={<AutoAwesomeRounded />}
                  sx={{
                    color: "#4338CA !important",
                    fontWeight: 800,
                    textTransform: "none",
                    borderRadius: 2.5,
                  }}
                >
                  Ask questions from uploaded documents
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Delete Confirmation */}
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
          Delete Document?
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
              {documentToDelete?.fileName ||
                "this document"}
            </strong>{" "}
            and its searchable AI knowledge chunks.
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
            {deleting ? "Deleting..." : "Delete Document"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Documents;