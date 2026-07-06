import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  getDocuments,
  uploadDocument,
  deleteDocument,
} from "../../services/document.service";

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch {
      toast.error("Failed to load documents");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a PDF");
      return;
    }

    const formData = new FormData();
    formData.append("document", file);

    try {
      await uploadDocument(formData);

      toast.success("Document Uploaded Successfully");

      setFile(null);

      loadDocuments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload Failed"
      );
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;

    try {
      await deleteDocument(id);

      toast.success("Document Deleted Successfully");

      loadDocuments();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={1}>
        Documents
      </Typography>

      <Typography color="text.secondary" mb={4}>
        Upload and manage company documents.
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 4 }}>
            <CardContent>
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={3}
              >
                Upload PDF
              </Typography>

              <Box
                component="form"
                onSubmit={handleUpload}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<UploadFileIcon />}
                >
                  {file ? file.name : "Choose PDF"}

                  <input
                    hidden
                    type="file"
                    accept=".pdf"
                    onChange={(e) =>
                      setFile(e.target.files[0])
                    }
                  />
                </Button>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<UploadFileIcon />}
                >
                  Upload Document
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
                    <strong>Document</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Type</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Uploaded</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Action</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {documents.map((document) => (
                  <TableRow
                    key={document.id}
                    hover
                  >
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <PictureAsPdfIcon color="error" />

                        {document.fileName}
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={document.fileType}
                        color="primary"
                        size="small"
                      />
                    </TableCell>

                    <TableCell>
                      {new Date(
                        document.createdAt
                      ).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Button
                        color="error"
                        variant="outlined"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() =>
                          handleDelete(document.id)
                        }
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {documents.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                    >
                      No Documents Found
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

export default Documents;