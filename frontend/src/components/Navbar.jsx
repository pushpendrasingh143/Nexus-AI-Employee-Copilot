import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";

import {
  LogoutRounded,
  AccountCircleRounded,
  KeyboardArrowDownRounded,
  AutoAwesomeRounded,
} from "@mui/icons-material";

const Navbar = () => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

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

    handleClose();
    navigate("/login");
  };

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: {
          xs: "100%",
          md: "calc(100% - 260px)",
        },
        ml: {
          xs: 0,
          md: "260px",
        },
        color: "#0F172A",
        backgroundColor: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E2E8F0",
        zIndex: 1100,
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: 64,
            md: 72,
          },
          px: {
            xs: 2,
            md: 3,
          },
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Typography
            fontWeight={800}
            sx={{
              fontSize: {
                xs: 16,
                sm: 19,
              },
              lineHeight: 1.2,
            }}
          >
            Nexus AI Employee Copilot
          </Typography>

          <Typography
            color="text.secondary"
            fontSize={12}
            sx={{
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          >
            Intelligent workplace management
          </Typography>
        </Box>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: {
              xs: 1,
              sm: 2,
            },
          }}
        >
          <Chip
            icon={<AutoAwesomeRounded />}
            label="Live MVP"
            size="small"
            sx={{
              display: {
                xs: "none",
                sm: "flex",
              },
              color: "#4338CA",
              fontWeight: 800,
              backgroundColor: "#EEF2FF",
              border: "1px solid #C7D2FE",
            }}
          />

          <IconButton
            onClick={handleOpen}
            sx={{
              p: 0.5,
              borderRadius: 3,
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                fontSize: 16,
                fontWeight: 800,
                background:
                  "linear-gradient(135deg, #4F46E5, #7C3AED)",
              }}
            >
              {userInitial}
            </Avatar>

            <KeyboardArrowDownRounded
              sx={{
                ml: 0.5,
                color: "#64748B",
              }}
            />
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            transformOrigin={{
              horizontal: "right",
              vertical: "top",
            }}
            anchorOrigin={{
              horizontal: "right",
              vertical: "bottom",
            }}
            PaperProps={{
              sx: {
                mt: 1,
                minWidth: 230,
                borderRadius: 3,
                border: "1px solid #E2E8F0",
                boxShadow:
                  "0 12px 32px rgba(15, 23, 42, 0.12)",
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography fontWeight={800}>
                {user?.name || "Nexus User"}
              </Typography>

              <Typography
                color="text.secondary"
                fontSize={12}
                mt={0.3}
              >
                {user?.email || "Authenticated user"}
              </Typography>

              {user?.role && (
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    mt: 1,
                    textTransform: "capitalize",
                    fontWeight: 700,
                  }}
                />
              )}
            </Box>

            <Divider />

            <MenuItem
              disabled
              sx={{
                py: 1.2,
              }}
            >
              <AccountCircleRounded sx={{ mr: 1.2 }} />
              Account Profile
            </MenuItem>

            <MenuItem
              onClick={logout}
              sx={{
                py: 1.2,
                color: "#DC2626",
              }}
            >
              <LogoutRounded sx={{ mr: 1.2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;