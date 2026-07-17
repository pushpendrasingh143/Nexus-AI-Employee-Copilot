import { Box, Toolbar } from "@mui/material";

import Sidebar from "../Sidebar";
import Navbar from "../Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        minHeight: "100vh",
        bgcolor: "#F8FAFC",
        overflowX: "hidden",
      }}
    >
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          width: {
            xs: "100%",
            md: "calc(100% - 260px)",
          },
          bgcolor: "#F8FAFC",
        }}
      >
        <Navbar />

        <Toolbar
          sx={{
            minHeight: {
              xs: "64px !important",
              md: "72px !important",
            },
          }}
        />

        <Box
          sx={{
            width: "100%",
            maxWidth: "1500px",
            mx: "auto",
            p: {
              xs: 2,
              sm: 3,
              md: 4,
            },
            overflowX: "hidden",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;