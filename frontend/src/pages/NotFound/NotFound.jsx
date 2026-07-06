import { Box, Button, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#F8FAFC"
    >
      <Paper sx={{ p: 5, textAlign: "center", borderRadius: 4 }}>
        <Typography variant="h2" fontWeight="bold" color="primary">
          404
        </Typography>

        <Typography variant="h5" fontWeight="bold" mt={2}>
          Page Not Found
        </Typography>

        <Typography color="text.secondary" mt={1} mb={3}>
          The page you are looking for does not exist.
        </Typography>

        <Button variant="contained" onClick={() => navigate("/dashboard")}>
          Back to Dashboard
        </Button>
      </Paper>
    </Box>
  );
};

export default NotFound;