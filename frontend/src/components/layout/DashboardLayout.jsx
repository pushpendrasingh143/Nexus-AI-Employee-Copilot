import { Box, Toolbar } from "@mui/material";

import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: {
            xs: "100%",
            md: "calc(100% - 260px)",
          },
          ml: {
            xs: 0,
            md: "260px",
          },
          transition: "0.3s",
        }}
      >
        <Navbar />

        <Toolbar />

        <Box
          sx={{
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;