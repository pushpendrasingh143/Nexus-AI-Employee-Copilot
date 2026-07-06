import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Divider,
} from "@mui/material";

import {
  Notifications,
  Search,
  Logout,
  AccountCircle,
} from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        background: "#fff",
        color: "#111827",
        width: "calc(100% - 250px)",
        ml: "250px",
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Nexus AI Employee Copilot
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              background: "#F3F4F6",
              px: 2,
              py: 0.5,
              borderRadius: 2,
            }}
          >
            <Search />

            <InputBase
              placeholder="Search..."
              sx={{ ml: 1 }}
            />
          </Box>

          <IconButton>
            <Badge
              badgeContent={3}
              color="error"
            >
              <Notifications />
            </Badge>
          </IconButton>

          <IconButton onClick={handleOpen}>
            <Avatar
              sx={{
                bgcolor: "#4F46E5",
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem disabled>
              <AccountCircle
                sx={{ mr: 1 }}
              />
              {user?.name}
            </MenuItem>

            <Divider />

            <MenuItem onClick={logout}>
              <Logout
                sx={{ mr: 1 }}
              />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;