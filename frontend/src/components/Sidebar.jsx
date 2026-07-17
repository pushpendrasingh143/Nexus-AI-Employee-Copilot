import {
  DashboardRounded,
  PeopleAltRounded,
  ApartmentRounded,
  DescriptionRounded,
  SmartToyRounded,
  AutoAwesomeRounded,
  LogoutRounded,
  RocketLaunchRounded,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import { NavLink, useNavigate } from "react-router-dom";

const drawerWidth = 260;

const menuItems = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <DashboardRounded />,
  },
  {
    title: "Employees",
    path: "/employees",
    icon: <PeopleAltRounded />,
  },
  {
    title: "Departments",
    path: "/departments",
    icon: <ApartmentRounded />,
  },
  {
    title: "Documents",
    path: "/documents",
    icon: <DescriptionRounded />,
  },
  {
    title: "AI Assistant",
    path: "/ai",
    icon: <SmartToyRounded />,
  },
  {
    title: "AI Agents",
    path: "/agents",
    icon: <AutoAwesomeRounded />,
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const userInitial =
    user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        display: {
          xs: "none",
          md: "block",
        },

        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          overflowX: "hidden",
          borderRight: "none",
          color: "#FFFFFF",
          background:
            "linear-gradient(180deg, #0F172A 0%, #111827 55%, #172033 100%)",
          boxShadow: "8px 0 30px rgba(15, 23, 42, 0.08)",
        },
      }}
    >
      {/* Logo */}
      <Toolbar
        sx={{
          minHeight: "88px !important",
          px: 2.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
        >
          <Box
            sx={{
              width: 46,
              height: 46,
              display: "grid",
              placeItems: "center",
              borderRadius: 3,
              color: "#FFFFFF",
              background:
                "linear-gradient(135deg, #4F46E5, #7C3AED)",
              boxShadow:
                "0 8px 20px rgba(79, 70, 229, 0.35)",
            }}
          >
            <RocketLaunchRounded />
          </Box>

          <Box>
            <Typography
              fontWeight={900}
              sx={{
                color: "#FFFFFF !important",
                fontSize: 20,
                lineHeight: 1.1,
              }}
            >
              Nexus AI
            </Typography>

            <Typography
              sx={{
                mt: 0.4,
                color: "#94A3B8 !important",
                fontSize: 11,
                fontWeight: 600,
              }}
            >
              Employee Copilot
            </Typography>
          </Box>
        </Stack>
      </Toolbar>

      <Divider
        sx={{
          borderColor: "rgba(148,163,184,0.16)",
        }}
      />

      <Box
        sx={{
          height: "calc(100vh - 89px)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Navigation */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: "auto",
            px: 1.5,
            pt: 2.5,
          }}
        >
          <Typography
            sx={{
              px: 1.5,
              mb: 1.2,
              color: "#64748B !important",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Workspace
          </Typography>

          <List disablePadding>
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {({ isActive }) => (
                  <ListItemButton
                    selected={isActive}
                    sx={{
                      position: "relative",
                      minHeight: 48,
                      mb: 0.7,
                      px: 1.5,
                      borderRadius: 2.5,
                      color: isActive
                        ? "#FFFFFF"
                        : "#CBD5E1",
                      transition:
                        "background-color 0.2s ease, color 0.2s ease, transform 0.2s ease",

                      "&:hover": {
                        color: "#FFFFFF",
                        backgroundColor:
                          "rgba(99,102,241,0.12)",
                        transform: "translateX(3px)",
                      },

                      "&.Mui-selected": {
                        color: "#FFFFFF",
                        background:
                          "linear-gradient(90deg, rgba(79,70,229,0.95), rgba(124,58,237,0.90))",
                        boxShadow:
                          "0 8px 18px rgba(79,70,229,0.24)",
                      },

                      "&.Mui-selected:hover": {
                        background:
                          "linear-gradient(90deg, #4338CA, #6D28D9)",
                      },

                      "&.Mui-selected::before": {
                        content: '""',
                        position: "absolute",
                        left: 0,
                        top: 11,
                        bottom: 11,
                        width: 4,
                        borderRadius: "0 6px 6px 0",
                        backgroundColor: "#FFFFFF",
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 40,
                        color: "inherit",
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>

                    <ListItemText
                      primary={item.title}
                      primaryTypographyProps={{
                        fontSize: 14,
                        fontWeight: isActive ? 800 : 600,
                      }}
                    />
                  </ListItemButton>
                )}
              </NavLink>
            ))}
          </List>

          <Box
            sx={{
              mt: 3,
              mx: 0.5,
              p: 2,
              borderRadius: 3,
              border:
                "1px solid rgba(129,140,248,0.20)",
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.16), rgba(124,58,237,0.10))",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
            >
              <AutoAwesomeRounded
                sx={{
                  color: "#A5B4FC",
                  fontSize: 20,
                }}
              />

              <Typography
                sx={{
                  color: "#FFFFFF !important",
                  fontWeight: 800,
                  fontSize: 13,
                }}
              >
                AI Workspace
              </Typography>
            </Stack>

            <Typography
              sx={{
                mt: 1,
                color: "#94A3B8 !important",
                fontSize: 11,
                lineHeight: 1.5,
              }}
            >
              Document intelligence and workplace automation are
              active.
            </Typography>

            <Chip
              label="Live MVP"
              size="small"
              sx={{
                mt: 1.5,
                height: 24,
                color: "#C7D2FE !important",
                fontWeight: 800,
                fontSize: 10,
                backgroundColor:
                  "rgba(99,102,241,0.18)",
                border:
                  "1px solid rgba(165,180,252,0.22)",
                "& .MuiChip-label": {
                  color: "#C7D2FE !important",
                },
              }}
            />
          </Box>
        </Box>

        {/* User and Logout */}
        <Box
          sx={{
            p: 1.5,
            borderTop:
              "1px solid rgba(148,163,184,0.14)",
          }}
        >
          <Box
            sx={{
              mb: 1,
              p: 1.3,
              borderRadius: 2.5,
              backgroundColor:
                "rgba(255,255,255,0.04)",
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              spacing={1.3}
            >
              <Avatar
                sx={{
                  width: 38,
                  height: 38,
                  fontSize: 15,
                  fontWeight: 800,
                  background:
                    "linear-gradient(135deg, #4F46E5, #7C3AED)",
                }}
              >
                {userInitial}
              </Avatar>

              <Box sx={{ minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    color: "#FFFFFF !important",
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  {user?.name || "Nexus User"}
                </Typography>

                <Typography
                  noWrap
                  sx={{
                    color: "#94A3B8 !important",
                    fontSize: 10,
                    textTransform: "capitalize",
                  }}
                >
                  {user?.role || "Authenticated user"}
                </Typography>
              </Box>
            </Stack>
          </Box>

          <ListItemButton
            onClick={logout}
            sx={{
              minHeight: 45,
              px: 1.5,
              borderRadius: 2.5,
              color: "#FDA4AF",

              "&:hover": {
                color: "#FFFFFF",
                backgroundColor:
                  "rgba(220,38,38,0.18)",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 40,
                color: "inherit",
              }}
            >
              <LogoutRounded />
            </ListItemIcon>

            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: 700,
              }}
            />
          </ListItemButton>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;